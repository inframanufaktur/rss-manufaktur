const blogParser = import('@inframanufaktur/blog-parser')

const blogs = require('./blog-info.json')

module.exports = async function () {
  const { getBlog } = await blogParser

  let feeds = []

  for (const blog of blogs) {
    const { parserInfo } = blog

    const content = await getBlog(parserInfo)

    if (content.feeds.length) {
      console.log(
        `Found existing feeds on ${
          parserInfo.url
        }.\nUse first party feeds whenever possible.\n${content.feeds.join(
          '\n',
        )}\n`,
      )
    }

    feeds.push({ ...blog, ...content })
  }

  return feeds
}
