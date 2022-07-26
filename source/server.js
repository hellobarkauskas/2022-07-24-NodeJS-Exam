const express = require('express');
const cors = require('cors');
const { port } = require('./config.js');
const { users, groups, bills, accounts, autentication } = require('./routes/v1/exports.js');
const app = express();

app.use(express.json());
app.use(cors());

app.use('/v1/users/', users);
app.use('/v1/groups/', groups);
app.use('/v1/bills/', bills);
app.use('/v1/accounts/', accounts);
app.use('/v1/authentication/', autentication);

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.all('*', (req, res) => {
    res.status(404).send({ error: '404 Page Not Found'});
})

app.listen(port, () => {
    console.log(`Listening on ${port}...`);
});