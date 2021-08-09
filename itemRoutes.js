const express = require("express");
const router = new express.Router();
const items = require('./fakeDb');


router.get('/', (req, res) => {
    return res.json(items);
});


router.post('/', (req, res) => {
    const newItem = {
        name: req.body.name,
        price: req.body.price
    };
    items.push(newItem);
    return res.status(201).json({'added': newItem})
})


router.get('/:name/', (req, res) => {
    const item = items.find(item => item.name === req.params.name);
    if (item === undefined) {
        throw new Error;
    }
    return res.json(item);
})


router.patch('/:name/', (req, res) => {
    const item = items.find(item => item.name === req.params.name);
    if (item === undefined) {
        throw new Error;
    }
    item.name = req.body.name;
    item.price = req.body.price;
    return res.json({'updated': {item}})
})


router.delete('/:name/', (req, res) => {
    const itemIndex = items.findIndex(item => item.name === req.params.name);
    if (itemIndex === -1) {
        throw new Error
    }
    items.splice(itemIndex, 1);
    return res.json({'message': 'Deleted'})
})


module.exports = router;