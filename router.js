const Router = require("koa-router");
const router = new Router();
const { getEvents, addEvent } = require("./controllers/events.controllers");

router.get("/events_list", (ctx) => getEvents(ctx));
router.post("/add_event", (ctx) => addEvent(ctx));

module.exports = router;