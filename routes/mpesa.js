const express = require("express");
const request = require("request");
const router = express.Router();
const auth = require("../middleware/auth");
const { Book } = require("../model/book");

router.get("/", mpesaReq, (req, res) => {
  res.status(200).send({
    access_token: req.access_token
  });
});

router.post("/pay", [mpesaReq, auth], (req, res) => {
  let oauth_token = req.access_token;
  const tel = req.body.tel;
  console.log(tel)
  let url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
  let auth = "Bearer " + oauth_token;
  let amount = 1;
  let datenow = new Date();

  const Timestamp =
    datenow.getFullYear() +
    "" +
    "" +
    (datenow.getMonth() + 1) +
    "" +
    "" +
    datenow.getDate() +
    "" +
    "" +
    ("0" + datenow.getHours()).slice(-2) +
    "" +
    "" +
    ("0" + datenow.getMinutes()).slice(-2) +
    "" +
    "" +
    ("0" + datenow.getSeconds()).slice(-2);
  console.log(Timestamp);
  const password = new Buffer.from(
    "174379" +
      "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
      Timestamp
  ).toString("base64");
  request(
    {
      method: "POST",
      url: url,
      headers: {
        Authorization: auth
      },
      json: {
        BusinessShortCode: "174379",
        Password: password,
        Timestamp: Timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: tel,
        PartyB: "174379",
        PhoneNumber: tel,
        CallBackURL: "http://154.159.238.75:5000/api/mpesa/callback",
        AccountReference: "whiz",
        TransactionDesc: "bus payment"
      }
    },
    async function(error, response, body) {
      if (error) {
        console.log(error);
      } else {
        console.log(req.user._id);
        const paid = await Book.findByIdAndUpdate(req.body.bookId);
        if (!paid) res.status(404).send("id not there");
        paid.travel.paid = true;
        paid.save();
        console.log(paid);
        res.status(200).json(body);
      }
    }
  );
});
router.post("/callbacks", (req, res) => {
  console.log("...............stk......");
  console.log(req.body);
});

module.exports = router;

function mpesaReq(req, res, next) {
  let consumer_key = "h8D7mTSmXAIJ5J3IL5MKfJz0WsXnAn9l";
  let consumer_secret = "CQe5JwnG10Yo3YVb";

  let url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  let auth =
    "Basic " +
    new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");

  request(
    {
      url: url,
      headers: {
        Authorization: auth
      }
    },
    function(error, response, body) {
      if (error) {
        console.log(error);
      } else {
        req.access_token = JSON.parse(body).access_token;
        next();
      }
    }
  );
}
