const { PLAID_CLIENT_ID, PLAID_SECRET } = require('./plaidSecrets.js')
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid')

const PLAID_PRODUCTS = ['transactions'] // I think 'transactions' work as well, but not 'balance'
const PLAID_COUNTRY_CODES = ['US','CA']

const configuration = new Configuration({
  basePath: PlaidEnvironments.development,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
      'PLAID-SECRET': PLAID_SECRET,
    },
  },
})

const client = new PlaidApi(configuration)

// for "UPDATE mode", add the `access_token` property
const baseLinkTokenConfig = {
  user: {
    client_user_id: 'user-id',
  },
  client_name: 'Organize-life',
  products: PLAID_PRODUCTS,
  country_codes: PLAID_COUNTRY_CODES,
  language: 'en'
}
// translate ES6 to commonJS https://stackoverflow.com/questions/38296667/getting-unexpected-token-export
module.exports = { client, baseLinkTokenConfig }
