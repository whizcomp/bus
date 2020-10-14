const mongoose = require("mongoose");
const Joi = require("joi");
const {
    Bus
} = require("./bus");
const {
    Router
} = require("express");

const travelSchema = new mongoose.Schema({
    bus: new mongoose.Schema({
        _id: {
            type: String,
            required: true,
        },
        plate: {
            type: String,
            required: true,
        },
        seats: {
            type: Number,
            required: true
        }
    }),
    depart: {
        place: {
            type: String,
            minlength: 2,
            maxlength: 15,
            required: true,
        },
        time: {
            type: Date,
            min: new Date().toString(),
            required: true,
        },
        destination: {
            type: String,
            minlength: 2,
            maxlength: 15,
            required: true,
        },
        fare: {
            type: Number,
            min: 10,
            max: 10000,
            required: true,
        },
    },
});
const Travel = mongoose.model("travel", travelSchema);

function validateTravel(travel) {
    const schema = Joi.object({
        busId: Joi.string().required(),
        place: Joi.string().min(2).max(25).required(),
        time: Joi.date().required(),
        destination: Joi.string().min(2).max(25).required(),
        fare: Joi.number().min(10).max(10000).required(),
    });
    return schema.validate(travel);
}
module.exports.Travel = Travel;
module.exports.validateTravel = validateTravel;