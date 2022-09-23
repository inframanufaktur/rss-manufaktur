const blogParser = import('@inframanufaktur/blog-parser')

const blogs = require('./blog-info.json')

module.exports = async function () {
  const { getBlog } = await blogParser

  let feeds = []

  for (const blog of blogs) {
    const { parserInfo } = blog

    const content = await getBlog(parserInfo)

    feeds.push({ ...blog, ...content })
  }

  return feeds
}
