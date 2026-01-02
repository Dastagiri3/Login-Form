const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Initialize SQLite Database
const dbPath = path.join(__dirname, 'users.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        // Create users table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Users table ready');
            }
        });
    }
});

// API Routes

// Register/Sign Up endpoint
app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and password are required' 
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid email format' 
        });
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({ 
            success: false, 
            message: 'Password must be at least 6 characters long' 
        });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        db.run(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            [email, hashedPassword],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(409).json({ 
                            success: false, 
                            message: 'Email already exists' 
                        });
                    }
                    return res.status(500).json({ 
                        success: false, 
                        message: 'Database error: ' + err.message 
                    });
                }
                res.json({ 
                    success: true, 
                    message: 'User registered successfully',
                    userId: this.lastID 
                });
            }
        );
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error: ' + error.message 
        });
    }
});

// Login endpoint
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Email and password are required' 
        });
    }

    // Find user by email
    db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        async (err, user) => {
            if (err) {
                return res.status(500).json({ 
                    success: false, 
                    message: 'Database error: ' + err.message 
                });
            }

            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid email or password' 
                });
            }

            try {
                // Compare password with hash
                const passwordMatch = await bcrypt.compare(password, user.password);
                
                if (passwordMatch) {
                    // Remove password from response
                    delete user.password;
                    res.json({ 
                        success: true, 
                        message: 'Login successful',
                        user: user 
                    });
                } else {
                    res.status(401).json({ 
                        success: false, 
                        message: 'Invalid email or password' 
                    });
                }
            } catch (error) {
                res.status(500).json({ 
                    success: false, 
                    message: 'Server error: ' + error.message 
                });
            }
        }
    );
});

// Get all users (for testing purposes - remove in production)
app.get('/api/users', (req, res) => {
    db.all('SELECT id, email, created_at FROM users', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error: ' + err.message 
            });
        }
        res.json({ success: true, users: rows });
    });
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed');
        process.exit(0);
    });
});

