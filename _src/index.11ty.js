module.exports = class Homepage {
  data() {
    return { permalink: '/', layout: 'layouts/page.njk' }
  }

  render({ collections }) {
    return `
      <h1>Feeds</h1>
      <ul>
        ${collections.feeds
          .map(
            (feed) =>
              `<li><a href="${feed.data.permalink}">${feed.data.feed.meta.title}</a></li>`,
          )
          .join('')}
      </ul>`
  }
}
