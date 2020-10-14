const mongoose = require("mongoose");
const Joi = require("joi");

const busSchema = new mongoose.Schema({
    plate: {
        type: String,
        minlength: 6,
        maxlength: 25,
        required: 1,
        uppercase: true,
    },
    driver: {
        type: String,
        minlength: 3,
        maxlength: 25,
        required: 1,
         
    },
    seats: {
        type: Number,
        min: 0,
        max: 100,
    },

    
});
const Bus = mongoose.model("Bus", busSchema);

function validateBus(bus) {
    const schema = Joi.object({
        plate: Joi.string().min(6).max(25).required(),
        driver: Joi.string().min(3).max(25).required(),
        seats: Joi.number().min(1).max(100).required(),

    });
    return schema.validate(bus);
}
module.exports.validateBus = validateBus;
module.exports.Bus = Bus;