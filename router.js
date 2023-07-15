const Router = require("koa-router");
const router = new Router();
const { getEvents, addEvent } = require("./controllers/events.controllers");

const { client, baseLinkTokenConfig } = require('./initPlaid.js')

router.get("/link/token/create", async (ctx) => {
  const createTokenResponse = await client.linkTokenCreate(
    baseLinkTokenConfig
  )
  ctx.body = createTokenResponse.data 
  ctx.status = 200
})

router.get("/link/token/update", async (ctx) => {
  const { access_token } = ctx.request.body

  const createTokenResponse = await client.linkTokenCreate({ 
    access_token,
    ...baseLinkTokenConfig
  })
  ctx.body = createTokenResponse.data 
  ctx.status = 200
})

router.post("/item/public_token/exchange", async (ctx) => {
  try {
    const { publicToken } = ctx.request.body

    const tokenResponse = await client.itemPublicTokenExchange({
      public_token: publicToken
    })
    const { access_token, item_id } = tokenResponse.data
    ctx.body = { access_token, item_id }
    ctx.status = 200
  } catch (error) {
    console.log(error)
  }
})

router.post('/accounts/get', async (ctx) => {
  const { access_token } = ctx.request.body

  try {
    const response = await client.accountsGet({ access_token })
    const accounts = response.data.accounts
    ctx.status = 200
    ctx.body = accounts
  } catch (error) {
    console.log(error)
  }
})

// assumes EXACTLY one account
router.post("/accounts/balance/get", async (ctx) => {
  try {
    const { access_token, account_id } = ctx.request.body

    const response = await client.accountsBalanceGet({
      access_token, 
      options: {
        account_ids: [account_id]
      }
    })
    console.log('server response =', response)
    ctx.body = { account: response.data.accounts[0] }
    ctx.status = 200
  } catch (error) {
    console.log(error)
    ctx.status = 400
    ctx.body = 'Need to login again, probably'
  }
})

router.post('/accounts/transactions/sync', async (ctx) => {
  const { access_token, account_id } = ctx.request.body 
  console.log("server received access_token and account_id =", access_token, account_id)

  // Get today's date in YYYY-MM-DD format https://stackoverflow.com/a/29774197/7812829
  // note it's converted to UTC time, so the date can be +- 1 day
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  now.toISOString().substring(0,10); // This is a cleaner alternative, since it reminds you that YYYY-MM-DD are the first ten characters of the complete iso format – 
  const thisMonthDateInYYYYMMDD = now.toISOString().substring(0,10)

  // get last month https://stackoverflow.com/a/50098236/7812829
  now.setDate(0) // 0 will result in the last day of the previous month
  now.setDate(1)
  const lastMonthDateInYYYYMMDD = now.toISOString().substring(0,10)

  const response = await client.transactionsGet({
    access_token,
    start_date: lastMonthDateInYYYYMMDD,
    end_date: thisMonthDateInYYYYMMDD, // YYYY-MM-DD
    // options: {
    //   include_personal_finance_category: true
    // }
  });

  ctx.status = 200
  ctx.body = response.data // let transactions = response.data.transactions
})

router.get("/events_list", (ctx) => getEvents(ctx));
router.post("/add_event", (ctx) => addEvent(ctx));

module.exports = router;