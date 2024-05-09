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
    if (req.body._id == '') 
        insertRecord(req, res);
    else
        updatedRecord(req, res);
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

function updatedRecord(req, res) {
    Product.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
        if (!err) { res.redirect('product/list'); }
        else {
            if (err.name == 'ValidationError') {
                handleValidationError(err, req.body);
                res.render("product/addOrEdit", {
                    viewTitle: 'Update Product',
                    product: req.body
                });
            }
            else
                console.log('Error during record update : ' + err);
        }
    });
}

router.get('/list', (req, res) => {
    Product.find({}, { products: { _id: 1, name: 1, description: 1, img: 1, price: 1 } })
    .then(data => {
        products = data.map(product => ({
            id: product._id ? product._id.toString() : null, // Check if _id exists before converting to string
            name: product.name,
            description: product.description,
            img: product.img,
            price: product.price.price // Add the price field
        }))
        console.log(products);
        res.render("product/list", {
            list: products
        })
            
    })
        .catch(err => {
            console.log(err);
            res.status(400).send(err);
            //console.log('Error in retrieving product list :' + err);
        });
});

router.get('/:id', (req, res) => {
    Product.findById(req.params.id)
        .then(doc => {
            if (doc) {
                res.render("product/addOrEdit", {
                    viewTitle: "Update Product",
                    product: doc
                });
            } else {
                console.log('Product not found');
            }
        })
        .catch(err => {
            console.log('Error in finding product: ' + err);
        });
});

router.get('/delete/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id)
        .then(doc => {
            if (doc) {
                res.redirect('/product/list');
            } else {
                console.log('Product not found');
            }
        })
        .catch(err => {
            console.log('Error in product delete: ' + err);
        });
});

module.exports = router;
