const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//const MONGO_URL = 'mongodb+srv://commercial:05timE2NuctQg0Yy@cluster0.wfto06b.mongodb.net/things?retryWrites=true&w=majority&appName=Cluster0';
const Product = mongoose.model('Product');
const mysql = require('mysql');

const connection  = mysql.createConnection({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    password        : 'password',
    database        : 'ecommerce',
  
});

connection.connect((err) => {
    if (err) {
        console.error('Lỗi khi kết nối đến cơ sở dữ liệu MySQL: ' + err.stack);
        return;
    }
    console.log('Kết nối thành công đến cơ sở dữ liệu MySQL');
    
    const query = 'SELECT * FROM users';
    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi truy vấn cơ sở dữ liệu: ' + error.stack);
            return;
        }

        // In ra thông tin từng người dùng
        for (let i = 0; i < results.length; i++) {
            const user = results[i];
            console.log('Người dùng:', user);
        }
    })
});

router.get('/login', (req, res) => {
    
    res.render("product/adminlogin");
    //res.send("<h1>Home Page</h1>")
});

// Xử lý route "/login"
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // Truy vấn kiểm tra người dùng
    const query = "SELECT * FROM users WHERE email = ? AND password = ? AND admin = 1";
    connection.query(query, [email, password], (error, results, fields) => {
        if (error) {
            console.error('Lỗi khi truy vấn cơ sở dữ liệu: ' + error.stack);
            res.status(500).send('Lỗi server');
            return;
        }

        // Kiểm tra kết quả truy vấn
        if (results.length > 0) {
            // Người dùng đã đăng nhập thành công
            const user = results[0];
            console.log('Đăng nhập thành công. Thông tin người dùng: ' + JSON.stringify(user));
            res.redirect("/product/list");
        } else {
            // Sai thông tin đăng nhập hoặc không phải admin
            
            res.send('Sai thông tin đăng nhập hoặc không đủ quyền truy cập');
        }
    });
});

// router.get('/logout', (req, res) => {
//     // Destroy the session
//     res.render("product/adminlogin");
//   });

router.get('/user', (req, res) => {
    connection.query('SELECT CONCAT(first_name, " ", last_name) AS name, username, email, phone FROM users', (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
      } else {
        //console.log('render list product');
        res.render("product/user", {
            users : results
        });
      }
    });
  });

  router.get('/add', (req, res) => {
    //res.send("<h1>Home Page</h1>");
    res.render("product/userAdd");
  });

  router.post('/add', (req, res) => {
    console.log("add ><");
    res.redirect("product/user");
    // const { username, email, phone, first_name, last_name } = req.body;
    // connection.query('INSERT INTO users (username, email, phone, first_name, last_name) VALUES (?, ?, ?, ?, ?)', 
    // [username, email, phone, first_name, last_name], (error, results) => {
    //   if (error) {
    //     console.error('Error executing query:', error);
    //     res.status(500).send('Internal Server Error');
    //   } else {
    //     console.log('User created successfully');
    //     res.render("product/userAddOrEdit");
    //   }
    // });
  });
  
  // Route: Cập nhật thông tin người dùng (Update)
  router.put('/user/:id', (req, res) => {
    const userId = req.params.id;
    const { username, email, phone } = req.body;
    connection.query('UPDATE users SET username = ?, email = ?, phone = ? WHERE user_id = ?', [username, email, phone, userId], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
      } else {
        res.send('User updated successfully');
      }
    });
  });
  
  // Route: Xóa người dùng (Delete)
  router.delete('/user/delete/:id', (req, res) => {
    const userId = req.params.id;
    connection.query('DELETE FROM users WHERE user_id = ?', [userId], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
      } else {
        res.send('User deleted successfully');
      }
    });
  });








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
