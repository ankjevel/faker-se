'use strict'
const request = require('request')
const parseContent = require('./parseContent')
const base = 'http://www.merinfo.se/search'

function parsePNR (input) {
  const pnr = `${input}`.replace(/\-/g, '')
  const length = pnr.length

  if (length !== 10 && length !== 12) {
    return new Error('Wrong format')
  }

  const lastDigits = pnr.slice(length - 4, length)

  const fullPNR = length === 12 ? pnr.slice(0, 8) : `19${pnr.slice(0, 6)}`
  const formatedPNR = `${fullPNR}-${lastDigits}`

  return {
    fullPNR,
    formatedPNR
  }
}

module.exports =
  pnr =>
    new Promise((resolve, reject) => {
      const { formatedPNR } = parsePNR(pnr)
      const query = `who=${formatedPNR}&where=`
      const headers = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:48.0) Gecko/20100101 Firefox/48.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'sv-SE,sv;q=0.8,en-US;q=0.5,en;q=0.3',
          'DNT': 1,
          'Referer': 'http://www.merinfo.se/',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': 1
        }
      }
      request.get(`${base}?${query}`, headers, (error, response, body) => {
        if (error) {
          return reject(error)
        }

        const { statusCode } = response

        const ok = statusCode >= 200 && statusCode < 300
        if (ok === false) {
          return reject(response)
        }

        parseContent(body, formatedPNR)
          .then(parsed => {
            resolve(parsed)
          })
      })
    })
