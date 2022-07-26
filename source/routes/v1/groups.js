const express = require('express');
const mysql = require('mysql2/promise');
const Joi = require('joi');
const { dbConfig } = require('../../config');
const { authorised } = require('../../middlewares/authentication');
const router = express.Router();

const addGroupSchema = Joi.object({
    name: Joi.string().required()
});

router.get('/', async (req, res) => {
    try {
        const con = await mysql.createConnection(dbConfig);
        const [groups] = await con.query('SELECT * FROM `groups`');

        con.end();
        res.send(groups);
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Unexpected error. Try again' });
    }
});

router.post('/', authorised, async (req,res) => {
    let addGroupData = req.body;

    try {
        addGroupData = await addGroupSchema.validateAsync(addGroupData);

        const con = await mysql.createConnection(dbConfig);
        const [dbResponse] = await con.query('INSERT INTO `groups` SET ?', [addGroupData]);

        con.end();
        res.send({ message: 'Group added'});
    } catch (error) {
        console.log(error)
        return res.status(400).send({ error: 'Missing information' });
    }
});


module.exports = router;