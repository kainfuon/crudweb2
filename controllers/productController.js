const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MONGO_URL = 'mongodb+srv://commercial:05timE2NuctQg0Yy@cluster0.wfto06b.mongodb.net/things?retryWrites=true&w=majority&appName=Cluster0';
const Product = mongoose.model('Product')

router.get('/', (req, res) => {
    res.render('product/addOrEdit', {
        viewTitle: "Insert Product"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '') 
        insertRecord(req, res);
});

router.put('/:productId', async (req, res) => {
    try {
        const updatedProduct = await Product.findOneAndUpdate({ _id: req.params.productId }, req.body, { new: true });
        
        if (updatedProduct) {
            res.status(200).json({'product': 'Product updated successfully'});
            // res.redirect('product/list');
        } else {
            res.render("product/addOrEdit", {
                viewTitle: 'Update Product',
                product: req.body
            });
        }
    } catch (err) {
        if (err.name == 'ValidationError') {
            handleValidationError(err, req.body);
            res.render("product/addOrEdit", {
                viewTitle: 'Update Product',
                product: req.body
            });
        } else {
            console.log('Error during record update : ' + err);
        }
    }
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
    let productId = mongoose.Types.ObjectId(req.params.productId);
    Product.findOneAndUpdate({ _id: productId }, req.body, { new: true }, (err, doc) => {
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
    Product.find().then((data) => {
        products = data.map(product => ({
            id: product._id ? product._id.toString() : null, // Check if _id exists before converting to string
            name: product.name,
            description: product.description,
            img: product.img,
            stock: product.stock,
            price: product.price // Add the price field
        }));
        //console.log(products);
        res.render("product/list", {
                list: products
            })
    }).catch((err) => {
        console.log(err);
        res.status(500).send("Internal server error");
    });
})



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

router.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    Product.findByIdAndDelete(req.params.id)
        .then(doc => {
            if (doc) {
                res.redirect('/product/list');
            } else {
                console.log('Product can not found');
            }
        })
        .catch(err => {
            console.log('Error in product delete: ' + err);
        });
});

module.exports = router;
