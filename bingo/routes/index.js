const express = require("express");
const ComfyJS = require("comfy.js");
const { response } = require("express");
const router = express.Router();
require("dotenv").config();

const channels = ["Nihonik"];
const regex = /\b(0?[1-9]|1[0-6])\b/;

router.get("/", function (req, res) {
  let inactiveFieldList = req.app.get("inactiveFieldList");
  const myEmitter = req.app.get("emitter");
  ComfyJS.onCommand = (user, command, message, flags, extra) => {
    if (
      (flags.broadcaster || flags.mod || flags.vip) &&
      command.toLowerCase() === "bingo" &&
      (extra.sinceLastCommand.any > 1000 || extra.sinceLastCommand.any === 0)
    ) {
      regex.lastIndex = 0;
      let match = regex.exec(message) !== null;
      let msg = message.split(" ")[0];

      if (match) {
        myEmitter.emit("touchChange", `${msg}`);
        ComfyJS.Say(`zmieniono stan kafelka ${msg}`, extra.channel);

        if (inactiveFieldList.includes(msg)) {
          inactiveFieldList.forEach((e, idx) => {
            if (e === msg) {
              inactiveFieldList.splice(idx, 1);
            }
          });
        } else {
          inactiveFieldList.push(`${msg}`);
        }
      } else {
        ComfyJS.Say("poprawny format: '!bingo [1-16]'", extra.channel);
      }
    }
  };
  res.render("index");
});

ComfyJS.Init(process.env.NICK, process.env.PASS, channels);

module.exports = router;
