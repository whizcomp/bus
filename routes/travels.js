const express = require("express");
const auth = require("../middleware/auth");
// const Booking = require("../model/book")
const router = express.Router();
const {
    Bus
} = require("../model/bus");
const isDriver = require('../middleware/isDriver');

const {
    Travel,
    validateTravel
} = require("../model/travel");

router.post("/", isDriver, async (req, res) => {
    const {
        error
    } = validateTravel(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const bus = await Bus.findById(req.body.busId);
    if (!bus) return res.status(404).send("bus not registered");
    const {
        place,
        time,
        destination,
        fare
    } = req.body;
    let travel = new Travel({
        bus: {
            _id: bus._id,
            plate: bus.plate,
            seats: bus.seats
        },
        depart: {
            place,
            time,
            destination,
            fare,
        },
    });
    await travel.save();
    res.send(travel);
});
router.get("/", async (req, res) => {
    const travels = await Travel.find().sort("time");
    res.send(travels);
});
router.get("/myTravels", auth, async (req, res) => {
    const travels = await Travel.find({
        email: 'req.user.email'
    }).sort("-time");
    res.send(travels);
});
router.get("/info/:id", auth, async (req, res) => {
    const travel = await Travel.findById(req.params.id);
    if (!travel) res.status(404).send('travel already deleted');
    res.send(travel);
})
router.delete("/:id", auth, async (req, res) => {

    const travel = await Travel.findByIdAndDelete(req.params.id)
    if (!travel) res.status(404).send('travel already deleted');
    res.send(travel)
})

module.exports = router;