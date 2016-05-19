# faker-se

Get information about a user from merinfo.

usage:

```javascript
'use strict'

const { basedOnPNR } = require('faker-se')

basedOnPNR('198601010050')
  .then(({ name = '', address = { street: '', postal: '', region: '' }, phone = '', email = '' } = {}) => {
    // handle person
  })

```
