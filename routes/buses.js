const express = require("express");
const { Bus, validateBus } = require("../model/bus");
const isDriver = require('../middleware/isDriver');
const router = express.Router();

router.post("/",isDriver, async(req, res) => {
    const { error } = validateBus(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { plate, seats, driver} = req.body;
    let bus = await Bus.findOne({ plate });
    if (bus) return res.status(400).send("bus already registered");

    bus = new Bus({
        plate,
        seats,
        driver,
         
    });
    await bus.save();
    res.send(bus);
});
router.get("/", async(req, res) => {
    const buses = await Bus.find({}).sort("-seats");
    if (!buses) return res.status(501).send("internal server error");
    res.send(buses);
});
router.get("/:plate",async (req,res)=>{
    const bus=await Bus.findOne({plate:req.params.plate})
    if (!bus) return res.status(404).send("bus not registered");
    res.send(bus);
})
module.exports = router;