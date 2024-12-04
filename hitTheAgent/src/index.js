import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
const port = process.env.PORT;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log("Listening on " + port);
});
