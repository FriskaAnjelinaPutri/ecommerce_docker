const express =  require('express');
const app = express();

//Dummy data
const products = [
    { id: 1, name: 'iphone 17', price: 100, Description: 'This is iphone 17' },
    { id: 2, name: 'Microwave', price: 150, Description: 'This is Microwave' },
    { id: 3, name: 'blender', price: 200, Description: 'This is blender' },
];

// **********************************************
// SOLUSI: Endpoint untuk Root ( / )
// **********************************************
app.get('/', (req, res) => {
    // Ketika pengguna mengakses http://localhost:3000/, server akan merespons ini
    res.json({ 
        message: 'Welcome to the Product API!', 
        available_routes: ['/products', '/products/:id']
    });
});
// **********************************************

//Endpoint untuk mendapatkan semua produk
app.get('/products', (req, res) => {
    res.json(products);
});
//Endpoint untuk mendapatkan produk berdasarkan ID
app.get('/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = products.find(p => p.id === productId);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }   
});

//Start the server
const PORT = process.env.PORT || 3000;  
app.listen(PORT, () => {
    console.log(`Product service is running on port ${PORT}`);
});