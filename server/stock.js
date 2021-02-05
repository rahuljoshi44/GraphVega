const express = require("express");
const router = express.Router();
const request = require("request");

// Lookup based on company name. Change /search to /lookup for symbol
router.post("/search", async (req, res) => {
  const KEY = process.env.TRADIER_API_KEY;
  request(
    {
      method: "get",
      url: "https://sandbox.tradier.com/v1/markets/lookup",
      qs: {
          q: req.body.ticker,
          exchanges: 'Q,N',
          types: 'stock'
          
      },
      headers: {
          Authorization: `Bearer  ${KEY}`,
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
  const KEY = process.env.TRADIER_API_KEY;
  const symbol = req.body.ticker;
  console.log(KEY)
  request(
    {
      method: "get",
      url: "https://sandbox.tradier.com/v1/markets/quotes",
      qs: {
        symbols: symbol,
        greeks: "false",
      },
      headers: {
        Authorization: `Bearer  ${KEY}`,
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
