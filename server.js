require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
//const mysql = require('mysql');

const productController = require('./controllers/productController');

const expressHandlebars = require('express-handlebars');
const { title } = require('process');

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


var app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: false }));


app.set('views', path.join(__dirname, '/views/'));
app.engine('hbs', exphbs.engine({ 
    extname: 'hbs', defaultLayout: 'mainLayout', 
    layoutsDir: __dirname + '/views/layouts/', 
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'hbs');

// Xử lý route "/login"
app.get('/login', (req, res) => {
    
    res.render("adminlogin");
    //res.send("<h1>Home Page</h1>")
});

// Xử lý route "/login"
app.post('/login', (req, res) => {
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

app.get('/user', (req, res) => {
    connection.query('SELECT CONCAT(first_name, " ", last_name) AS name, username, email, phone FROM users', (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        res.status(500).send('Internal Server Error');
      } else {
        //console.log('render list product');
        res.render("user", {
            users : results
        });
      }
    });
  });


app.get('/add', (req, res) => {
    
    res.render("userAdd");
    //res.send("<h1>Home Page</h1>")
});

app.post('/add', (req, res) => {
    const { username, email, phone, first_name, last_name } = req.body;
  
    if (!email) {
      return res.status(400).send('Email là bắt buộc');
    }
  
    connection.query(
      'INSERT INTO users (username, email, phone, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
      [username, email, phone, first_name, last_name],
      (error, results) => {
        if (error) {
          console.error('Lỗi khi thực hiện truy vấn:', error);
          res.status(500).send('Lỗi máy chủ');
        } else {
          console.log('Tạo người dùng thành công');
          res.redirect('user');
        }
      }
    );
  });

app.listen(3001, () => {
    console.log('Express server started at port : 3001');
});


app.use('/product', productController);

// connection.end((err) => {
//     if (err) {
//         console.error('Lỗi khi đóng kết nối đến cơ sở dữ liệu MySQL: ' + err.stack);
//         return;
//     }
//     console.log('Đã đóng kết nối đến cơ sở dữ liệu MySQL');
// });