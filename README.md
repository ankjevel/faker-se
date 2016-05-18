# faker-se

Generate a fake swedish user from [fakenamegenerator](http://www.fakenamegenerator.com).

usage:

```javascript
'use strict'

const { basedOnPNR, parsePNR } = require('faker-se')

basedOnPNR('198601010050')
  .then(({ name = '', address = { street: '', postal: '', region: '' }, phone = '', email = '' } = {}) => {
    // handle person
  })

parsePNR('198601010050')
  .then(({ age = 30, gender = 'm' } = {}) => {
    // do something with parsed content
  })

```
