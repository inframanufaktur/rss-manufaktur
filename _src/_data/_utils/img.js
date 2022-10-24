const Image = require('@11ty/eleventy-img')

const supportedFormats = new Map([
  ['jpg', 'jpeg'],
  ['jpeg', 'jpeg'],
  ['webp', 'jpeg'],
  ['avif', 'jpeg'],
  ['png', 'png'],
])

const getFileExtension = (fileName) => fileName.split('.').pop()

/**
 *
 *
 * @param {Array} icons
 * @return {String}
 */
async function makeIcon(icons) {
  const sized = icons.filter(({ sizes }) => sizes !== null)
  let icon = null
  let width = null

  if (sized.length) {
    icon = sized.sort((a, b) => a.sizes.localeCompare(b.sizes))[
      Math.ceil(sized.length / 2)
    ]
    width = parseInt(icon.sizes)
  } else {
    icon = icons[0]
  }

  const format = supportedFormats.get(getFileExtension(icon.url.pathname))

  if (!format) {
    return icon.url.href
  }

  const parsed = await Image(icon.url.href, {
    width: [width],
    formats: [format],
    urlPath: '/icons/',
    outputDir: './dist/icons/',
    cacheOptions: {
      duration: '*',
    },
  })

  return parsed[format][0].url
}

module.exports = { makeIcon }
