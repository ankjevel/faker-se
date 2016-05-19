'use strict'
const { load } = require('cheerio')

function parseContent (html) {
  return new Promise(resolve => {
    const $ = load(html)
    const mainContent = $('#result-list > .result').first()

    const name = mainContent.find('.name').text()
    const [ , street, postalAndRegion ] = mainContent.find('p.address').text().split('\n')
    const phone = mainContent.find('p.phone').text().replace(/tel: /gi, '')
    const [ , postal, region ] = postalAndRegion.match(/((?:\d{3})\s{1,}(?:\d{2}))\s{1,}(.+?)$/)

    const address = {
      street,
      postal,
      region
    }
    resolve({
      name,
      address,
      phone,
      email: ''
    })
  })
}

module.exports = parseContent
