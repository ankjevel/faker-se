'use strict'
const { load } = require('cheerio')

function parseContent (html) {
  return new Promise((resolve, reject) => {
    const $ = load(html)
    const mainContent = $('.info .content')

    const name = mainContent.find('.address h3').text()
    const preAddress = mainContent.find('.address .adr').text()
    const phone = mainContent.find('.extra .hh3+.dl-horizontal dd').html()
    const email = `${name.replace(/[^\w]/g, '').toLowerCase()}@fake.me`

    const [, unparsedStreet, postal, region ] = preAddress.match(/(.+?)((?:\d{3})\s{1,}(?:\d{2}))\s{1,}(\w{2,})/)
    const street = unparsedStreet.replace(/^\s{0,}/g, '')

    const address = {
      street,
      postal,
      region
    }

    resolve({
      name,
      address,
      phone,
      email
    })
  })
}

module.exports = parseContent
