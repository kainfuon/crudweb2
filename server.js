require('./models/db');

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');


const productController = require('./controllers/productController');

const expressHandlebars = require('express-handlebars');
const { title } = require('process');





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