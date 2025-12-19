const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '.')));

// Mock Data
const products = [
    { name: '911 Carrera', tagline: 'The definition of a sports car.', image: 'assets/model_911_1766120049147.png' },
    { name: 'Taycan', tagline: 'Soul, electrified.', image: 'assets/model_taycan_1766120062887.png' },
    { name: 'Panamera', tagline: 'Courage changes everything.', image: 'assets/model_panamera_1766120081175.png' },
    { name: '718 Cayman', tagline: 'For the sport of it.', image: 'assets/model_911_1766120049147.png' } // Reusing image for demo
];

// API Routes

// Get All Products
app.get('/api/products', (req, res) => {
    res.json(products);
});

// Mock Signup
app.post('/api/signup', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    // Mock success - in real app, would save to DB
    res.status(201).json({ message: 'User created successfully', userId: Date.now() });
});

// Mock Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    // Mock success - accept any login
    res.status(200).json({
        message: 'Login successful',
        user: {
            id: 'mock-id-123',
            name: 'Porsche Enthusiast',
            email: email
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
