const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, 'porsche.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        tagline TEXT,
        image TEXT,
        price TEXT
    )`, (err) => {
        if (!err) {
            seedProducts();
        }
    });
}

function seedProducts() {
    db.get("SELECT count(*) as count FROM products", (err, row) => {
        if (err) return console.error(err.message);
        if (row.count === 0) {
            const products = [
                { name: '911 Carrera', tagline: 'The definition of a sports car.', image: 'assets/model_911_1766120049147.png' },
                { name: 'Taycan', tagline: 'Soul, electrified.', image: 'assets/model_taycan_1766120062887.png' },
                { name: 'Panamera', tagline: 'Courage changes everything.', image: 'assets/model_panamera_1766120081175.png' }
            ];
            const sql = `INSERT INTO products (name, tagline, image) VALUES (?, ?, ?)`;
            products.forEach(p => {
                db.run(sql, [p.name, p.tagline, p.image]);
            });
            console.log('Products seeded');
        }
    });
}

function getAllProducts(callback) {
    const sql = `SELECT * FROM products`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}

function createUser(name, email, password, callback) {
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return callback(err);
        }
        const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
        db.run(sql, [name, email, hash], function (err) {
            callback(err, { id: this.lastID });
        });
    });
}

function findUserByEmail(email, callback) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], (err, row) => {
        callback(err, row);
    });
}

function verifyPassword(password, hash, callback) {
    bcrypt.compare(password, hash, (err, result) => {
        callback(err, result);
    });
}

module.exports = {
    db,
    createUser,
    findUserByEmail,
    verifyPassword,
    getAllProducts
};
