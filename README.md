# RSS Manufaktur

A template to build RSS Feeds.

In short, RSS Manufaktur takes information of a blog and transforms it into a custom RSS feed for your enjoyment.

## How it works

Add blog data in `_src/_data/blog-info.json`. You can add as many blogs as you like.

The data should look as follows:

```json
[
  {
    "name": "ovl.design",
    "cache_name": "ovl",
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

The feed is named after `parserInfo.url`. Say your domain is `https://www.zachleat.com`, the feed will be available at `/feeds/www.zachleat.com.xml`.

All created feeds are shown on the homepage.

## What it needs

Create a `.env` file with the following content:

```
BASE_URL=https://www.yourdomain.dev
```

We need to have a base URL to construct a public link to your feed.
