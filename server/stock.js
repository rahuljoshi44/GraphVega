const express = require("express");
const router = express.Router();
const request = require("request");
const { API_KEY, API_BASE_URL } = require("./config");

// Lookup based on company name
router.post("/search", async (req, res) => {
  request(
    {
      method: "get",
      url: `${API_BASE_URL}markets/search`,
      qs: {
        q: req.body.ticker,
        exchanges: "Q,N",
        types: "stock",
      },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
    },
    (error, response, body) => {
      // the api key error is different from the vanilla error
      try {
        if (error) {
          throw new Error("Something went wrong! Please try again later.");
        }
        if (body == "Invalid Access Token") {
          throw new Error("Invalid Access Token");
        }
        // console.log(body)
        res.send(body);
      } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err.toString() });
      }
    }
  );
});

// Lookup based on symbol
router.post("/lookup", async (req, res) => {
  request(
    {
      method: "get",
      url: `${API_BASE_URL}markets/lookup`,
      qs: {
        q: req.body.ticker,
        exchanges: "Q,N",
        types: "stock",
      },
      headers: {
        Authorization: `Bearer  ${API_KEY}`,
        Accept: "application/json",
      },
    },
    (error, body) => {
      // the api key error is different from the vanilla error
      try {
        if (error) {
          throw new Error("Something went wrong! Please try again later.");
        }
        if (body == "Invalid Access Token") {
          throw new Error("Invalid Access Token");
        }
        // console.log(body)
        res.send(body);
      } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err.toString() });
      }
    }
  );
});

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
      console.log(error)

      res.send(body);
    }
  );
});

module.exports = router;
