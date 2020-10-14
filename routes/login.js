const { Client } = require("../model/client");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { email, password } = req.body;
    const client = await Client.findOne({ email });
    if (!client) return res.status(400).send("invalid email or password");
    const passwordver = await bcrypt.compare(password, client.password);
    if (!passwordver) return res.status(400).send("invalid email or password");

    const token = client.genAuthToken();
    res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .send(token);
});

function validate(user) {
    const schema = Joi.object({
        email: Joi.string().email().min(3).max(255).required(),
        password: Joi.string().min(6).max(255).required(),
    });
    return schema.validate(user);
}
module.exports = router;