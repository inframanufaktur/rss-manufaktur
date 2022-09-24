# RSS Manufaktur

A template to build RSS Feeds.

In short, RSS Manufaktur takes information of a blog and transforms it into a custom RSS feed for your enjoyment.

## Get started

To make this to your own Manufaktur you can either:

- Use the «Use this template» button on the top of the page
- Fork this repository

Note: When you use the template button, you lose access to the commit history and (potential) future features.

Afterwards you can update the JSON file in `./_src/_data` and add the sites you want to scrape.

As working with CSS selectors is a bit daunting, we’re open for better ideas.

## How it works

Add blog data in `_src/_data/blog-info.json`. You can add as many blogs as you like.

The data should look as follows:

```json
[
  {
    "name": "ovl.design",
    "parserInfo": {
      "url": "https://www.ovl.design/text/",
      "elements": {
        "posts": "article.article-card",
        "postTitle": ".article-card__headline",
        "postURL": ".article-card__link",
        "postDate": ".article-card__date > time",
        "postIntro": ".article-card__date + p"
      }
    }
  }
]
```

`parserInfo` will be passed to [Blog Parser](https://github.com/inframanufaktur/blog-parser), our friendly little utility to make sense of a blog. See those docs for further info.

The URL given in `parserInfo.url` will be scraped and all posts returned. Based on this data, RSS Manufaktur will build a RSS feed.

All created feeds are shown on the homepage.

### Caching

Fetched posts are preserved to disc in a distinct cache per site. This allows you to build up a feed over time, as `@inframanufaktur/blog-parser` only fetches the first page of a blog.

You can either have this cache in your version control, or .gitignore this, and use a build plugin like [`netlify-plugin-cache`](https://www.npmjs.com/package/netlify-plugin-cache) to preserve it between builds.

The cache folder is `./posts`.

The cache name is automatically generated based on `parserInfo.url`, replacing `www.` and adding the hashed URL `pathname`. This allows to have multiple feeds from the same host (e.g. for following multiple categories or authors which do not have their own feeds).

### Rebuilding Feeds

The generated site itself is static. To update the feeds you’ll need to trigger a rebuild at certain intervals (e.g. every night).

On most hosting providers you’ll be able to do so via [CRON jobs](https://en.wikipedia.org/wiki/Cron). Netlify provided a [guide for scheduled deploys](https://www.netlify.com/blog/how-to-schedule-deploys-with-netlify/) on their blog. The same concept can be adapted for [DigitalOcean functions](https://docs.digitalocean.com/products/functions/) or your own server.

### Existing Feeds

As `@inframanufaktur/blog-parser` collects existing feeds from the blog page, we can use this information to show them when building. Please use first party feeds whenever possible. They are most likely better.

## What it needs

Create a `.env` file with the following content:

```
BASE_URL=https://www.yourdomain.dev
```

We need to have a base URL to construct a public link to your feed.
