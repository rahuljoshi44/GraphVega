const express = require("express");
const router = express.Router();
const request = require("request");
const { API_KEY, API_BASE_URL } = require('./config');

// Lookup based on company name. Change /search to /lookup for symbol
router.post("/search", async (req, res) => {
  request(
    {
      method: "get",
      url: `${API_BASE_URL}markets/search`,
      qs: {
          q: req.body.ticker,
          exchanges: 'Q,N',
          types: 'stock'
          
      },
      headers: {
          Authorization: `Bearer  ${API_KEY}`,
          Accept: "application/json",
      },
    },
    (error, response, body) => {
        // console.log(body);
        res.send(body);
    }
  )
})

// get quote of a company using symbol.
router.post("/quote", async (req, res) => {
  const symbol = req.body.ticker;

  request(
    {
      method: "get",
      url: `${API_BASE_URL}markets/quotes`,
      qs: {
        symbols: symbol,
        greeks: "false",
      },
      headers: {
        Authorization: `Bearer  ${API_KEY}`,
        Accept: "application/json",
      },
    },
    (error, response, body) => {
      // console.log(body);
      res.send(body);
    }
  );
});

module.exports = router;
