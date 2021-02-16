const express = require("express")
const path = require("path")
const bcrpyt = require("bcrypt");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middlewares
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// Stock API routes
const stockRoutes = require("./stock");
app.use("/api/stocks", stockRoutes);

// Option API routes
const optionsRoutes = require("./options");
app.use("/api/options", optionsRoutes);

// Setup server
const port = 8000;
app.listen(port);
console.log(`Server listening on port ${port}`);
