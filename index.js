const express = require("express");
const cors = require("cors");
const User = require("./user/model");
const Ticket = require("./ticket/model");
const Event = require("./event/model");
const Comment = require("./comment/model");

const app = express();
// in case I want to deploy it to heroku
const port = process.env.PORT || 4000;

//using cors
const corsMiddleware = cors();
app.use(corsMiddleware);

//using bodyparser from express
const parser = express.json();
app.use(parser);

app.listen(port, () => console.log(`Listening on :${port}`));
