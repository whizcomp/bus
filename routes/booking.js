const express = require("express");
const router = express.Router();
const {
    Travel
} = require("../model/travel");
const auth = require("../middleware/auth");
const {
    Bus
} = require("../model/bus");
const {
    Book,
    validateBook
} = require("../model/book");

router.post("/", auth, async (req, res) => {
    const {
        error
    } = validateBook(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const travel = await Travel.findById(req.body.travelId);
    if (!travel) return res.status(400).send("booking error");

    const bus = await Bus.findById(travel.bus._id);
    if (!bus) return res.status(400).send("bus not available today");
    const {
        _id,
        bus: busses,
        fare,
        time
    } = travel;
    if (bus.seats <= 0) return res.status(400).send("the bus is full");
    const book = new Book({
        client: {
            _id: req.user._id,
            email: req.user.email,
        },
        travel: {
            _id,
            busses,
            fare,
            time,
            seats: bus.seats
        },
    });
    bus.seats--;
    bus.save();

    await book.save();
    res.send(book);
});
router.get("/", auth, async (req, res) => {
    const bookings = await Book.find();
    if (!Book) return res.status(404).send("haven't booked any bus");
    res.send(bookings);
});
router.get("/:id", auth, async (req, res) => {
    const booking = await Book.findById(req.params.id);
    if (!booking) return res.status(404).send('no id ')
    console.log(booking)
    res.send(booking)
})
router.delete("/:id", auth, async (req, res) => {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).send("booking doesn't exist");
    console.log(book);

    const bus = await Bus.findById(book.travel.bus._id);
    console.log(bus);

    if (!bus) return res.status(400).send("bus booking not available");
    bus.seats++;
    Book.deleteOne({
        _id: book._id
    });
    res.send(book);
});
module.exports = router;