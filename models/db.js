const mongoose = require("mongoose");
const MONGO_URL = 'mongodb+srv://commercial:05timE2NuctQg0Yy@cluster0.wfto06b.mongodb.net/things?retryWrites=true&w=majority&appName=Cluster0';
const PORT = 3001;

// mongoose.connect(url, { useNewUrlParser: true }, (err) => {
//     if (!err) { console.log('MongoDB Connection Succeeded.') }
//     else { console.log('Error in DB connection : ' + err) }
// });

mongoose.connect(MONGO_URL)

    .then(() => {
        console.log('Database is connected');
        
        mongoose.connection.db.collection('products').find({}, { projection: { _id: 1, name: 1, description: 1, img: 1, price: 1 } }).toArray()
        .then(data => {
            products = data.map(product => ({
            id: product._id ? product._id.toString() : null, // Check if _id exists before converting to string
            name: product.name,
            description: product.description,
            img: product.img,
            price: product.price // Add the price field
        }));
        console.log(products); // Log the product names, descriptions, images, and prices to the console
    })
    })
    .catch((err) => {
        console.log('Error: ', err);
});

require('./product.model');