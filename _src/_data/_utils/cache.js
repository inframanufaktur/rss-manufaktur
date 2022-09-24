const fs = require('fs')
const path = require('path')
const { createHash } = require('crypto')

const { promises: promiseFs } = fs
const { R_OK } = fs.constants

const CACHE_DIR = path.join(process.cwd(), 'posts')

function makeCacheName(url) {
  url = new URL(url)

  const cacheBase = url.host.startsWith('www.')
    ? url.host.replace('www.', '')
    : url.host

  let hash = createHash('sha256')
  hash.update(url.pathname)

  return `${cacheBase}-${hash.digest('hex').substring(0, 15)}`
}

function createCacheFile(key) {
  return promiseFs.writeFile(path.join(CACHE_DIR, `${key}.json`), '[]', {
    encoding: 'utf-8',
  })
}

async function setCache(key, posts) {
  // const key = makeCacheName(url)

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

async function getCache(key) {
  // const key = makeCacheName(url)

  const fileName = path.join(CACHE_DIR, `${key}.json`)

  try {
    await promiseFs.access(fileName, R_OK)
    const content = require(fileName)

    // revive non-primitive types lost by stringification
    return content.map((entry) => ({
      title: entry.title,
      date: new Date(entry.date),
      url: new URL(entry.url),
      postIntro: entry.postIntro,
    }))
  } catch {
    return []
  }
}

module.exports = { getCache, setCache, makeCacheName }
