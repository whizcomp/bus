const { Client, validateClient } = require("../model/client");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
router.post("/", async(req, res) => {
    const { error } = validateClient(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { email, password, fullname, isAdmin, phone, isClient } = req.body;
    let client = await Client.findOne({ email });
    if (client) return res.status(400).send("user already registered");

    client = new Client({
        email,
        password,
        phone,
        fullname,
        isAdmin,
        isClient,
    });
    client.password = await bcrypt.hash(client.password, 10);
    await client.save();
    const token = client.genAuthToken();
    res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(token);
});
module.exports = router;