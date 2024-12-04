const express = require('express');
const router = express.Router();



/* GET home page. */
router.get('/', function(req, res) {
let ip = req.headers['cf-connecting-ip']
let otherIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress
 console.log("ip z commands: ", ip)
 console.log("ip z commands: ", otherIp)

  res.render('index');
}).get("*", (req, res)=>{
 res.redirect('/');

})
module.exports = router;
