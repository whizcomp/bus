const mongoose = require("mongoose");
const Joi = require("joi");
const {
    Bus
} = require("./bus");
const {
    Client
} = require("./client");

const bookSchema = new mongoose.Schema({
    client: new mongoose.Schema({
        id: String,
        email: String,
    }),
    travel: {
        _id: {
            type: String,
        },
        bus: {
            _id: String,
            plate: String,
            seats: Number
        },
        fare: {
            type: Number,
        },
        time: {
            type: Date,
        },
    },
});
const Book = mongoose.model("book", bookSchema);

function validateBook(book) {
    const schema = Joi.object({
        travelId: Joi.string().required(),
        // busId: Joi.string().required(),
    });
    return schema.validate(book);
}
module.exports.validateBook = validateBook;
module.exports.Book = Book;