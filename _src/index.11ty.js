module.exports = class Homepage {
  data() {
    return { permalink: '/', layout: 'layouts/page.njk' }
  }

  render({ collections }) {
    return `
      <h1>Feeds</h1>
      <ul role="list">
        ${collections.feeds
          .map(
            (feed) =>
              `<li style="display: flex; align-items: center;">
                ${
                  feed.data.feed.meta.icon
                    ? `<img src="${feed.data.feed.meta.icon.parsedIcon}" alt="" style="display: inline-block; width: 1rem; margin-right: 0.5rem;"/>`
                    : ''
                }
                <a href="${feed.data.permalink}">${
                feed.data.feed.meta.title
              }</a>
              </li>`,
          )
          .join('')}
      </ul>`
  }
}
