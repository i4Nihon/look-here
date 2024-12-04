const express = require("express");
const { render } = require("express/lib/application");
const fs = require("fs");
const router = express.Router();
const path = require('path');

router.get("/", async (req, res) => {

  const con = fs.readFileSync(path.join(__dirname, "..", "public", 'names.txt'))
  res.render("fieldName", { content: con });
});
router.post("/", (req, res) => {
  const keys = Object.values(req.body);
  const content = keys.join("\n");
  fs.writeFileSync(path.join(__dirname,"..", "public", 'names.txt'), content);
  res.redirect("/");
});

module.exports = router;
