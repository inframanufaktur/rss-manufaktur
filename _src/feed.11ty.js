const { escape } = require('html-escaper')
const { dateToRfc3339 } = require('@11ty/eleventy-plugin-rss')

function renderFeedItem({ title, url, date, postIntro }) {
  return `
    <entry>
      <title>${escape(title)}</title>
      <id>${url}</id>
      <link href="${url}" rel="alternate" />
      <published>${dateToRfc3339(new Date(date))}</published>
      <updated>${dateToRfc3339(new Date(date))}</updated>
      ${postIntro ? `<summary>${escape(postIntro)}</summary>` : ''}
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
