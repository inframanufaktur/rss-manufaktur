const blogParser = import('@inframanufaktur/blog-parser')
const Image = require('@11ty/eleventy-img')

const { setCache, getCache, makeCacheName } = require('./_utils/cache')

const blogs = require('./blog-info.json')

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
    const uniqueName = makeCacheName(parserInfo.url)
    const cached = await getCache(uniqueName)

    if (content.feeds.length) {
      console.group()
      console.log(`Found existing feeds on ${parserInfo.url}.`)
      console.log('Use first party feeds whenever possible.')
      console.log(`${content.feeds.join('\n')}\n`)
      console.groupEnd()
    }

    if (content.meta.icon) {
      try {
        const parsed = await Image(content.meta.icon.href.href, {
          width: [null],
          formats: ['jpeg'],
          urlPath: '/icons/',
          outputDir: './dist/icons/',
          cacheOptions: {
            duration: '*',
          },
        })

        content.meta.icon.parsedIcon = parsed.jpeg[0].url
      } catch {
        content.meta.icon.parsedIcon = content.meta.icon.href.href
      }
    }

    for (const post of content.posts) {
      if (post.date === null) {
        post.date = new Date()
      }
    }

    const distinctPosts = getDistinctPosts(cached, content.posts)

    await setCache(uniqueName, distinctPosts)

    feeds.push({
      ...blog,
      ...content,
      uniqueName,
      posts: distinctPosts.sort((a, b) => b.date - a.date),
    })
  }

  return feeds
}
