const { dateToRfc3339 } = require('@11ty/eleventy-plugin-rss')

function renderFeedItem({ title, url, date, postIntro }) {
  return `
    <entry>
      <title>${title}</title>
      <link href="${url}"/>
      <published>${dateToRfc3339(new Date(date))}</published>
      <updated>${dateToRfc3339(new Date(date))}</updated>
      <id>${url}</id>
      <summary type="html">${postIntro || ''}</summary>
    </entry>
  `
}

module.exports = class Feed {
  data() {
    return {
      pagination: {
        data: 'feeds',
        size: 1,
        alias: 'feed',
        addAllPagesToCollections: true,
      },
      tags: ['feeds'],

      eleventyComputed: {
        permalink: ({ feed }) => `/feeds/${feed.uniqueName}.xml`,
      },
    }
  }

  render({ feed }) {
    return feed.posts.map((post) => renderFeedItem(post)).join('')
  }
}
