const Image = require('@11ty/eleventy-img')

const supportedFormats = new Map([
  ['jpg', 'jpeg'],
  ['jpeg', 'jpeg'],
  ['webp', 'jpeg'],
  ['avif', 'jpeg'],
  ['png', 'png'],
])

const getFileExtension = (fileName) => fileName.split('.').pop()

async function makeIcon(icon) {
  const format = supportedFormats.get(getFileExtension(icon.href.pathname))

  if (!format) {
    icon.parsedIcon = icon.href.href

    return icon
  }
  const parsed = await Image(icon.href.href, {
    width: [null],
    formats: [format],
    urlPath: '/icons/',
    outputDir: './dist/icons/',
    cacheOptions: {
      duration: '*',
    },
  })

  icon.parsedIcon = parsed[format][0].url

  return icon
}

module.exports = { makeIcon }
