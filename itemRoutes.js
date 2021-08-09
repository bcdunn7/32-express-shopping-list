const express = require("express");
const app = require("./app");
const ExpressError = require("./expressError")
const router = new express.Router();
const items = require('./fakeDb');


router.get('/', (req, res) => {
    return res.json(items);
});


router.post('/', (req, res, next) => {
    try {
        if (!req.body.name || !req.body.price) throw new ExpressError("Name or price is missing", 400);
        const newItem = {
            name: req.body.name,
            price: req.body.price
        };
        items.push(newItem);
        return res.status(201).json({'added': newItem})
    } catch (e) {
        return next(e)
    }
})


router.get('/:name/', (req, res) => {
    const item = items.find(item => item.name === req.params.name);
    if (item === undefined) {
        throw new ExpressError("Item not found", 404);
    }
    return res.json(item);
})


router.patch('/:name/', (req, res) => {
    const item = items.find(item => item.name === req.params.name);
    if (item === undefined) {
        throw new ExpressError("Item not found", 404);
    }
    if (req.body.name) {
        item.name = req.body.name;
    }
    if (req.body.price) {
        item.price = req.body.price;
    }
    return res.json({'updated': {item}})
})


router.delete('/:name/', (req, res) => {
    const itemIndex = items.findIndex(item => item.name === req.params.name);
    if (itemIndex === -1) {
        throw new ExpressError("Item not found", 404)
    }
    items.splice(itemIndex, 1);
    return res.json({'message': 'Deleted'})
});


module.exports = router;