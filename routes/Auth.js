const express = require('express')
const router = express.Router();
const bcrypt = require('bcrypt')
const { sign } = require('jsonwebtoken');
const { users, attendances } = require('../models')
router.post('/registration', async (req, res) => {
    const { username, password, email, phone_number } = req.body;
    bcrypt.hash(password, 10).then(async (hashPassword) => {
        try {
            const post = await users.create({
                username: username,
                password: hashPassword,
                email: email,
                phone_number: phone_number,
            });
            res.status(201).json({ 'status': 'success', 'data': post });
        } catch ({ errors }) {
            res.status(406).json({ 'status': 'failed', 'errors': errors });
        }
    })
});

router.post('/login', async (req, res) => {
    const requestUser = req.body;
    const user = await users.scope('withPassword').findOne({ where: { username: requestUser.username } });
    if (!user) {
        res.status(404).json({ status: 'failed', message: 'username doest match to our records', data: [] });
    } else {
        bcrypt.compare(requestUser.password, user.password).then((match) => {
            if (!match) {
                res.status(404).json({ status: 'failed', message: 'wrong username and password combination', data: [] });
            } else {
                const accessToken = sign({ username: user.username, id: user.id, clusterId: user.clusterId, role: 'M' }, 'mamanrecing')
                res.status(202).json({ status: 'success', message: 'successfully logged in', data: { accessToken: accessToken }, });
            }
        })
    }
});

module.exports = router;