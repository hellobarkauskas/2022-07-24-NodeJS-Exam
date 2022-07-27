const express = require('express');
const mysql = require('mysql2/promise');
const { dbConfig } = require('../../config');
const { authorised } = require('../../middlewares/authentication');
const router = express.Router();

router.get('/', authorised, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const con = await mysql.createConnection(dbConfig);
        const [accounts] = await con.query('SELECT users.full_name AS user_id, `groups`.name AS group_id FROM accounts LEFT JOIN users ON accounts.user_id = users.id LEFT JOIN `groups` ON accounts.group_id = `groups`.id WHERE accounts.user_id = ?', [userId]);

        con.end();
        res.send(accounts);
    } catch (error) {
        res.status(500).send({ error: 'Unexpected error. Try again' });
    }
});

router.post('/:groupId', authorised, async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.user.user_id;
        const con = await mysql.createConnection(dbConfig);
        const [dbResponse] = await con.query('INSERT INTO accounts SET accounts.group_id = ?, accounts.user_id = ?', [groupId, userId]);

        con.end();
        res.send('OK');
    } catch (error) {
        res.status(500).send({ error: 'Unexpected error. Try again' });
    }
});

module.exports = router;