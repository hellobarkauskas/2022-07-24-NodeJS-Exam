const express = require('express');
const mysql = require('mysql2/promise');
const Joi = require('joi');
const { dbConfig } = require('../../config');
const { authorised } = require('../../middlewares/authentication');
const router = express.Router();

const addBillSchema = Joi.object({
    group_id: Joi.number().required(),
    amount: Joi.number().required(),
    description: Joi.string().required()
});

router.get('/:groupId', authorised, async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const con = await mysql.createConnection(dbConfig);
        const [bills] = await con.query('SELECT bills.group_id, bills.amount, bills.description FROM bills WHERE bills.group_id = ?', [groupId]);

        con.end();
        res.send(bills);
    } catch (error) {
        res.status(500).send({ error: 'Unexpected error. Try again' });
    }
});

router.post('/', authorised, async (req, res) => {
    let addBillData = req.body;

    try {
        addBillData = await addBillSchema.validateAsync(addBillData);

        const con = await mysql.createConnection(dbConfig);
        const [dbResponse] = await con.query('INSERT INTO bills SET ?', [addBillData]);

        con.end();
        res.send({ message: 'New bill added'});
    } catch (error) {
        return res.status(400).send({ error: 'Missing information' });
    }
});

module.exports = router;