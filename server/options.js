const express = require("express");
const router = express.Router();
const request = require("request");
const { API_KEY, API_BASE_URL } = require('./config');

router.post("/expiries", async(req,res) => {
  const symbol = req.body.symbol;

  request({
    method: 'get',
    url: `${API_BASE_URL}markets/options/expirations`,
    qs: {
       symbol: symbol,
       includeAllRoots: 'true',
       strikes: 'false'
    },
    headers: {
      Authorization: `Bearer  ${API_KEY}`,
      Accept: 'application/json'
    }
  }, (error, response, body) => {
      res.send(body)
  });
})

router.post("/getChain", async(req, res) => {
  const symbol = req.body.symbol;
  const expiry = req.body.expiry;
  
  request({
    method: 'get',
    url: `${API_BASE_URL}markets/options/chains`,
    qs: {
       symbol: symbol,
       expiration: expiry,
       greeks: 'true'
    },
    headers: {
      Authorization: `Bearer  ${API_KEY}`,
      Accept: 'application/json'
    }
  }, (error, response, body) => {
      res.send(body);
  });
})

module.exports = router;