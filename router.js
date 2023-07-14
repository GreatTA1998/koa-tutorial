const Router = require("koa-router");
const router = new Router();
const { getEvents, addEvent } = require("./controllers/events.controllers");

const { client, baseLinkTokenConfig } = require('./initPlaid.js')

async function exchangePublicTokenForAccessToken (context) {
  const { publicToken } = data
  console.log('publicToken =', publicToken)
  const tokenResponse = await client.itemPublicTokenExchange({
    public_token: publicToken
  })

  const ACCESS_TOKEN = tokenResponse.data.access_token;
  const ITEM_ID = tokenResponse.data.item_id;
  return {
    access_token: ACCESS_TOKEN,
    item_id: ITEM_ID,
    error: null
  }
}

router.get("/link/token/create", async (ctx) => {
  const createTokenResponse = await client.linkTokenCreate(
    baseLinkTokenConfig
  )
  ctx.body = createTokenResponse.data 
  ctx.status = 200
})

router.get("/events_list", (ctx) => getEvents(ctx));
router.post("/add_event", (ctx) => addEvent(ctx));

module.exports = router;