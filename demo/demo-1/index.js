const validate = require('../../src')

console.log(validate())

document.querySelector('body').innerHTML = `Demo: ${validate()}`
