const express = require('express');
const router = express.Router();
require("dotenv").config()


router.get("/", (req, res) => {
  const myEmitter = req.app.get('emitter')
  let inactiveFieldList = req.app.get('inactiveFieldList')
  res.writeHead(200, {
    'Content-Type': 'text/event-stream', Connection: 'keep-alive', 'Cache-Control': 'no-cache',
  });
  res.write('event: open\n')
  res.write(`data: ${inactiveFieldList.toString()}\n\n`)
  const touchChangeHandler = (ev) => {

    res.write('event: change\n');
    res.write(`data: ${ev}\n\n`);
  }
  myEmitter.on('touchChange', touchChangeHandler);

  // Close the connection when the client disconnects
  req.on('end', () => {
    myEmitter.removeListener("touchChange", touchChangeHandler)
    res.end('OK')
  })
  req.on('close', () => {
    myEmitter.removeListener("touchChange", touchChangeHandler)
    res.end('OK')
  })
})

module.exports = router;
