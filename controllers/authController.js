const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const generateToken = (user) => {

    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};


// REGISTER
const register = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            phone
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const [existingUsers] = await pool.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const [result] = await pool.execute(
            `INSERT INTO users
            (name, email, password, phone)
            VALUES (?, ?, ?, ?)`,
            [
                name,
                email,
                hashedPassword,
                phone || null
            ]
        );

        const user = {
            id: result.insertId,
            name,
            email,
            role: "customer"
        };

        const token = generateToken(user);

        res.status(201).json({
            message: "Registration successful",
            token,
            user
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// LOGIN
const login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const [users] = await pool.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {

            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user);

        delete user.password;

        res.json({
            message: "Login successful",
            token,
            user
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// GET PROFILE
const profile = async (req, res) => {

    try {

        const [users] = await pool.execute(
            `SELECT id, name, email, phone, role, created_at
             FROM users
             WHERE id = ?`,
            [req.user.id]
        );

        if (users.length === 0) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(users[0]);

    } catch (error) {

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    register,
    login,
    profile
};