import express from "express";
import "dotenv/config";
import { sqlite } from "./dbConfig.js";
import pullFromDb from "./setMyWatchtime.js";
import path from "path";
import { fileURLToPath } from "url";

process.env.STATE = true;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT;
let isSure;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  isSure = false;
  res.render("index");
});

app.post("/check", async (req, res) => {
  await pullFromDb();
  const amountOfWatchtime = req.headers.amountofwatchtime;
  const records = sqlite
    .prepare(
      `SELECT * FROM users WHERE myWatchtime >= ${amountOfWatchtime} ORDER BY MyWatchtime DESC`
    )
    .all();
  res.send({
    data: records,
  });
});

app.post("/state", async (req, res) => {
  if (req.headers.ischanging === "true") {
    const currentState = process.env.STATE === "true";
    process.env.STATE = (!currentState).toString();
  }

  res.send({ state: process.env.STATE });
});

app.post("/reset", async (req, res) => {
  if (!isSure) {
    isSure = true;
    return res.status(401).send();
  }
  sqlite.prepare(`UPDATE users SET myWatchtime = 1`).run();
  isSure = false;
  res.status(200).send();
});

app.listen(port, () => {
  console.log("Listening on " + port);
});
