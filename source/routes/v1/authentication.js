const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { dbConfig, jwtSecret } = require('../../config');
const router = express.Router();

const registerSchema = Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required()
});

const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

router.post('/register', async (req, res) => {
    let registerData = req.body;

    try {
        registerData = await registerSchema.validateAsync(registerData);
    } catch (error) {
        return res.status(400).send({ error: 'Missing full name or email' });
    }

    try {
        const hashedPassword = bcrypt.hashSync(registerData.password);
        registerData.password = hashedPassword;

        const con = await mysql.createConnection(dbConfig);
        const [dbResponse] = await con.query('INSERT INTO users SET ?', [registerData]);

        con.end();
        res.send({ message: 'Registration complete'})
    } catch (error) {
        res.status(500).send({ error: 'Unexpected error. Please try again' });
    }
});

router.post('/login', async (req, res) => {
    let loginData = req.body;

    try {
        loginData = await loginSchema.validateAsync(loginData);
    } catch (error) {
        return res.status(400).send({ error: 'Wrong email or password' });
    }

    try {
        const con = await mysql.createConnection(dbConfig);
        const [users] = await con.query('SELECT password, id FROM users WHERE email = ?', [loginData.email]);

        con.end();

        if (!users.length) {
            return res.status(400).send({ error: 'Wrong email or password' });
        }

        const isPasswordValid = bcrypt.compareSync(loginData.password, users[0].password);
        
        if (!isPasswordValid) {
            return res.status(400).send({ error: 'Wrong email or password' });
        }

        const token = jwt.sign({ user_id: users[0].id}, jwtSecret);

        console.log(token, users[0].id);

        res.send({ token: token, user_id: users[0].id});
    } catch (error) {
        res.status(500).send({ error: 'Unexpected error. Please try again' });
    }
});

module.exports = router;