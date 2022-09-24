const blogParser = import('@inframanufaktur/blog-parser')
const fs = require('fs')
const promiseFs = require('fs').promises
const path = require('path')

const blogs = require('./blog-info.json')

const CACHE_DIR = path.join(process.cwd(), 'posts')

function makeCacheName(url) {
  url = new URL(url)

  return url.host.startsWith('www.') ? url.host.replace('www.', '') : url.host
}

function createCacheFile(key) {
  return promiseFs.writeFile(path.join(CACHE_DIR, `${key}.json`), '[]', {
    encoding: 'utf-8',
  })
}

async function setCache(url, posts) {
  const key = makeCacheName(url)

  if (!fs.existsSync(CACHE_DIR)) {
    await promiseFs.mkdir(CACHE_DIR)
  }

  const fileName = path.join(CACHE_DIR, `${key}.json`)

  // make sure file exists one first caching run
  if (!fs.existsSync(fileName)) {
    await createCacheFile(key)
  }

  await promiseFs.writeFile(fileName, JSON.stringify(posts, 2, 2))
}

async function getCache(url) {
  const key = makeCacheName(url)

  const fileName = path.join(CACHE_DIR, `${key}.json`)

  if (fs.existsSync(fileName)) {
    const content = require(fileName)

    return content.map((entry) => ({
      title: entry.title,
      date: new Date(entry.date),
      url: new URL(entry.url),
      postIntro: entry.postIntro,
    }))
  }

  return []
}

function getDistinctPosts(cached, fresh) {
  const urls = new Map()
  const posts = []

  // use cached first to keep old date of entries for which @inframanufaktur/blog-parser
  // found no date when parsing the blog and used Date.now()
  for (const post of [...cached, ...fresh]) {
    // we compare `URL`s here, so stringify them for comparison
    const compareURL = JSON.stringify(post.url)

    if (!urls.has(compareURL)) {
      urls.set(compareURL, true)
      posts.push(post)
    }
  }

  return posts
}

module.exports = async function () {
  const { getBlog } = await blogParser

  let feeds = []

  for (const blog of blogs) {
    const { parserInfo } = blog

    const content = await getBlog(parserInfo)
    const cached = await getCache(parserInfo.url)

    if (content.feeds.length) {
      console.log(
        `Found existing feeds on ${
          parserInfo.url
        }.\nUse first party feeds whenever possible.\n${content.feeds.join(
          '\n',
        )}\n`,
      )
    }

    const distinctPosts = getDistinctPosts(cached, content.posts)

    await setCache(parserInfo.url, distinctPosts)

    feeds.push({
      ...blog,
      ...content,
      posts: distinctPosts.sort((a, b) => a.date < b.date),
    })
  }

  return feeds
}
