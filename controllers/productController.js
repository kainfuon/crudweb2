const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = mongoose.model('Product')

router.get('/', (req, res) => {
    res.render('product/addOrEdit', {
        viewTitle: "Insert Product"
    });
});

router.post('/', (req, res) => {
    insertRecord(req, res);
});

function insertRecord(req, res) {
    const product = new Product({
        name: req.body.name,
        img: req.body.img,
        description: req.body.description,
        stock: req.body.ratings,
        price:req.body.price
        
    });
    product.save()
        .then(product => {
            res.status(200).json({'product': 'Product added successfully'});
        })
        .catch(err => {
            res.status(400).send(err);
        });     
}

router.get('/', (req, res) => {
    res.json('from list');
});

module.exports = router;
