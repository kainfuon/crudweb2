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
    var product = new Product({
        _id: req.body._id.toString(),
        category_id: req.body.category_id,
        available: true,
        stock: req.body.stock,
        name: req.body.name,
        img: req.body.img,
        colors: req.body.colors,
        sizes: req.body.sizes,
        price: {
            original: req.body.original,
            discount: req.body.discount,
            price: req.body.price
        },
        description: req.body.description,


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
