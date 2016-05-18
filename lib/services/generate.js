'use strict'
const request = require('request')
const base = 'http://www.fakenamegenerator.com/advanced.php'

const parseContent = require('./parseContent')

function parseQuery ({ age, gender } = {}) {
  const gen = `${ gender === 'm' ? 100 : 0 }`
  return `?t=country&n[]=sw&c[]=sw&gen=${gen}&age-min=${age}&age-max=${age}`
}

function parsePNR (input) {
  const pnr = `${input}`.replace(/\-/g, '')
  const length = pnr.length

  if (length !== 10 && length !== 12) {
    return new Error('Wrong format')
  }

  const fullPNR = length === 12 ? pnr.slice(0, 8) : `19${pnr.slice(0, 6)}`

  const lastDigits = pnr.slice(length - 4, length)
  const gender = lastDigits[2] % 2 === 0 ? 'f' : 'm'
  const [ , year, month, day ] = fullPNR.match(/(\d{4})(\d{2})(\d{2})/)

  const date = new Date(year, month, day)
  const diff = Date.now() - date.getTime()
  const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25))

  return {
    age,
    gender
  }
}

module.exports = {
  parsePNR,

  basedOnPNR (pnr) {
    return new Promise((resolve, reject) => {
      const { age, gender } = parsePNR(pnr)
      const query = parseQuery({ age, gender })

      request(`${base}${query}`, {}, (error, response, body) => {
        if (error) {
          return reject(error)
        }

        const { statusCode } = response
        const ok = statusCode >= 200 && statusCode < 300
        if (ok === false) {
          return reject(response)
        }

        parseContent(body)
          .then(parsed => {
            console.log(parsed)
            resolve(parsed)
          })
      })
    })
  }
}
