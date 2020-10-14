const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const clientSchema = new mongoose.Schema({
    fullname: {
        type: String,
        minlength: 3,
        maxlength: 255,
        required: true,
    },
    email: {
        type: String,
        minlength: 6,
        maxlength: 255,
        required: true,
    },
    phone: {
        type: String,
        minlength: 7,
        maxlength: 25,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        maxlength: 1024,
        required: true,
    },
    isClient: {
        type: Boolean,
        required: false,
        default: true,
    },
    isAdmin: {
        type: Boolean,
        required: false,
        default: false,
    },
});

clientSchema.methods.genAuthToken = function() {
    return jwt.sign({
            fullname: this.fullname,
            email: this.email,
            isAdmin: this.isAdmin,
            isClient: this.isClient,
            _id: this._id,
        },
        "whiz"
    );
};
const Client = mongoose.model("Client", clientSchema);

function validateClient(user) {
    const schema = Joi.object({
        fullname: Joi.string().min(3).max(255).required(),
        email: Joi.string().email().min(3).max(255).required(),
        phone: Joi.string().min(7).max(25).required(),
        password: Joi.string().min(6).max(255).required(),
        isAdmin: Joi.boolean(),
        isClient: Joi.boolean(),
    });
    return schema.validate(user);
}
module.exports.validateClient = validateClient;
module.exports.Client = Client;