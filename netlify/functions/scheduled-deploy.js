const got = require('got')
const { schedule } = require('@netlify/functions')

const { BUILD_HOOK } = process.env

if (!BUILD_HOOK) return

const handler = schedule('0 0 * * *', async () => {
  const { data } = await got.post(BUILD_HOOK)

  console.log(data)

  return {
    statusCode: 200,
  }
})

module.exports = { handler }
