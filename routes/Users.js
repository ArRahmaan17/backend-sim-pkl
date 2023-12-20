const express = require('express')
const router = express.Router();
const { Users } = require('../models')

router.get('/', async (req, res) => {
    const allUsers = await Users.findAll();
    res.json({ 'status': 'success', 'message': 'List all users', 'data': allUsers });
});
router.get('/:id', async (req, res) => {
    const user = await Users.findOne({
        where: {
            id: req.params.id
        }
    });
    res.json({ 'status': 'success', 'message': 'user id ' + req.params.id, 'data': user });
});

router.post('/', async (req, res) => {
    const user = req.body;
    const post = await Users.create(user);
    res.json({ 'status': 'success', 'data': post });
})

router.put('/:id', async (req, res) => {
    const user = req.body;
    await Users.update(user, {
        where: {
            id: req.params.id
        }
    });
    const userUpdated = await Users.findByPk(req.params.id)
    res.json({ 'status': `successfully update profile user ${req.params.id}`, 'data': userUpdated });
})


module.exports = router;