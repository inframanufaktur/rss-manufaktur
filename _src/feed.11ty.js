const { dateToRfc3339 } = require('@11ty/eleventy-plugin-rss')

function renderFeedItem({ title, url, date, postIntro }) {
  return `
    <entry>
      <title>${title}</title>
      <link href="${url}"/>
      <published>${dateToRfc3339(date)}</published>
      <updated>${dateToRfc3339(date)}</updated>
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
      },

      eleventyComputed: {
        permalink: ({ feed }) =>
          `/feeds/${new URL(feed.parserInfo.url).host}.xml`,
        publicLink: ({ feed, site, permalink }) =>
          new URL(feed.permalink, site.baseURL),
      },
    }
  }

  render({ feed }) {
    console.log(publicLink)
    return feed.posts.map((post) => renderFeedItem(post)).join('')
  }
}
