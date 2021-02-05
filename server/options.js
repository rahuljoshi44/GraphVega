const express = require("express");
const router = express.Router();
const request = require("request");

router.post("/expiries", async(req,res) => {
  const symbol = req.body.symbol;
  const KEY = process.env.TRADIER_API_KEY;
  request({
    method: 'get',
    url: 'https://sandbox.tradier.com/v1/markets/options/expirations',
    qs: {
       symbol: symbol,
       includeAllRoots: 'true',
       strikes: 'false'
    },
    headers: {
      Authorization: `Bearer  ${KEY}`,
      Accept: 'application/json'
    }
  }, (error, response, body) => {
      res.send(body)
  });
})

router.post("/getChain", async(req, res) => {
  const symbol = req.body.symbol;
  const expiry = req.body.expiry;
  const KEY = process.env.TRADIER_API_KEY;
  request({
    method: 'get',
    url: 'https://sandbox.tradier.com/v1/markets/options/chains',
    qs: {
       symbol: symbol,
       expiration: expiry,
       greeks: 'true'
    },
    headers: {
      Authorization: `Bearer  ${KEY}`,
      Accept: 'application/json'
    }
  }, (error, response, body) => {
      res.send(body);
  });
})

module.exports = router;