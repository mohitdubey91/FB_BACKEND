const express = require('express');
const { register, activeAccount, login } = require("../controllers/user");

const route = express.Router();

route.get('/user', (req, res) => {
    res.send("welcome from user home");
});


route.post('/register', register);
route.post('/active', activeAccount);
route.post('/login', login);

module.exports = route;

