const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')
const { sign } = require('jsonwebtoken');
const { users, attendances } = require('../models')
router.post('/registration', async (req, res) => {
    const { username, password, email, phone_number } = req.body;
    bcrypt.hash(password, 10).then(async (hashPassword) => {
        const post = await users.create({
            username: username,
            password: hashPassword,
            email: email,
            phone_number: phone_number,
        });
        res.json({ 'status': 'success', 'data': post });
    })
});

router.post('/login', async (req, res) => {
    const requestUser = req.body;
    const user = await users.scope('withPassword').findOne({ where: { username: requestUser.username } });
    if (!user) {
        res.json({ status: 'failed', message: 'username doest match to our records', data: [] }, 404);
    } else {
        bcrypt.compare(requestUser.password, user.password).then((match) => {
            if (!match) {
                res.json({ status: 'failed', message: 'wrong username and password combination', data: [] }, 404);
            } else {
                const accessToken = sign({ username: user.username, id: user.id, clusterId: user.clusterId }, 'mamanrecing')
                res.json({ status: 'success', message: 'successfully logged in', data: { accessToken: accessToken }, }, 200);
            }
        })
    }
});

module.exports = router;