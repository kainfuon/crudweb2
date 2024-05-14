const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const MONGO_URL = 'mongodb+srv://commercial:05timE2NuctQg0Yy@cluster0.wfto06b.mongodb.net/things?retryWrites=true&w=majority&appName=Cluster0';
const Product = mongoose.model('Product');


router.get('/', (req, res) => {
    res.render('product/addOrEdit', {
        viewTitle: "Insert Product"
    });
});

router.post('/', (req, res) => {
    if (req.body._id == '') 
        insertRecord(req, res);
    else
        console.log('updated');
        updatedRecord(req, res);
});



function insertRecord(req, res) {
    const product = new Product({
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
            res.redirect('product/list');
            //res.status(200).json({'product': 'Product added successfully'});
        })
        .catch(err => {
            res.status(400).send(err);
        });     
}

function updatedRecord(req, res) {
    //let productId = mongoose.Types.ObjectId(req.params.productId);
    let productId = req.body._id; // Lấy id từ body của request
    console.log(productId);
    // Product.findById(productId)
    Product.findByIdAndUpdate({ _id: productId }, req.body, { new: true })
        .then(updatedDoc => {
            if (updatedDoc) {
                // updatedDoc.name = req.body.name;
                // updatedDoc.save();
                console.log('Kết quả sau khi cập nhật:', updatedDoc);
                res.redirect('/product/list'); // Chuyển hướng đến trang danh sách sản phẩm sau khi cập nhật thành công
            } else {
                console.log('Không tìm thấy sản phẩm để cập nhật');
                }
            })
        .catch(err => {
            console.log('Lỗi khi cập nhật thông tin sản phẩm: ' + err);
            // res.redirect('/product/list');
        })
        
    
}

router.get('/list', (req, res) => {
    Product.find().then((data) => {
        const products = data.map(product => ({
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

router.get('/edit/:id', (req, res) => {
    console.log(req.params.id);
    Product.findById(req.params.id)
        .then(doc => {
            if (doc) {
                console.log('Kết quả truy vấn:', doc);
                console.log('ID của sản phẩm:', doc._id);
                res.render("product/addOrEdit", {
                    viewTitle: 'Update Product',
                    product: doc
                });
            }
            
        })
        .catch(err => {
            console.log('Lỗi khi truy vấn thông tin sản phẩm: ' + err);
        });
})




router.delete('/delete/:id', (req, res) => {
    console.log(req.params.id);
    Product.findByIdAndDelete(req.params.id)
        .then(product => {
            if (product) {
                console.log('Delete successed!');
                location.reload();
            } else {
                console.log('Product not found');
            }
        })
        .catch(err => {
            console.log('Error in product delete: ' + err);
        });
});


module.exports = router;
