const express = require('express')
const moment = require('moment')
const router = express.Router();
const bcrypt = require('bcrypt')
const { sign } = require('jsonwebtoken');
const { users, attendances } = require('../models')
const salt = 10;
router.post('/registration', async (req, res) => {
    const { username, password, email, phone_number } = req.body;
    bcrypt.hash(password, salt, async function (err, hash) {
        if (err) {
            res.status(406).json({ 'status': 'failed', 'errors': errors });
        } else {
            const post = await users.create({
                username: username,
                password: hash,
                email: email,
                phone_number: phone_number,
            });
            res.status(201).json({ 'status': 'success', 'data': post });
        }
    });
});

router.post('/login', async (req, res) => {
    const requestUser = req.body;
    const user = await users.scope('withPassword').findOne({ where: { username: requestUser.username } });
    if (!user) {
        res.status(404).json({ status: 'failed', message: 'username doest match to our records', data: [] });
    } else {
        bcrypt.compare(requestUser.password, user.password, function (err, result) {
            if (err) {
                res.status(404).json({ status: 'failed', message: 'wrong username and password combination', data: [] });
            } else {
                const accessToken = sign({ username: user.username, id: user.id, clusterId: user.clusterId, role: 'M', lifetime: moment().add(1, 'days').unix() }, 'mamanrecing')
                res.status(202).json({ status: 'success', message: 'successfully logged in', data: { accessToken: accessToken } });
            }
        });
    }
});

module.exports = router;