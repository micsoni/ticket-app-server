const express = require("express");
const cors = require("cors");
const logingRouter = require("./auth/router");
const userRouter = require("./user/router")

const app = express();
// in case I want to deploy it to heroku
const port = process.env.PORT || 4000;

//using cors
const corsMiddleware = cors();
app.use(corsMiddleware);

//using bodyparser from express
const parser = express.json();
app.use(parser);

// using jwt
app.use(logingRouter);

//routers for endpoints
app.use(userRouter)

app.listen(port, () => console.log(`Listening on :${port}`));
