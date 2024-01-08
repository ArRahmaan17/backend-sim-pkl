const express = require('express')
const fs = require('fs')
const router = express.Router();
const bcrypt = require('bcrypt')
const { users, attendances } = require('../models')
let folder = 'storage/profile'
const mutler = require('multer');
const { sign } = require('jsonwebtoken');
const storage = mutler.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname == 'profile_picture') {
            cb(null, folder)
        } else if (file.fieldname == 'attendance_photo') {
            folder = 'storage/attendance'
            cb(null, folder)
        }
    },
    filename: (req, file, cb) => {
        if (file) {
            const extension = file.mimetype.split('/')[1]
            cb(null, `${file.fieldname}_${req.params.id}.${extension}`);
        }
    }
});
const upload = mutler({ storage: storage });


router.get('/', async (req, res) => {
    const allUsers = await users.findAll();
    res.json({ 'status': 'success', 'message': 'List all users', 'data': allUsers ?? [] });
});
router.get('/:id', async (req, res) => {
    const user = await users.findOne({
        where: {
            id: req.params.id
        }
    });
    res.json({ 'status': 'success', 'message': 'user id ' + req.params.id, 'data': user ?? {} });
});

router.post('/auth/registration', async (req, res) => {
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

router.post('/auth/login', async (req, res) => {
    const requestUser = req.body;
    const user = await users.findOne({ where: { username: requestUser.username } });
    if (!user) {
        res.json({ status: 'failed', message: 'username doest match to our records', data: [] }, 404);
    } else {
        bcrypt.compare(requestUser.password, user.password).then((match) => {
            if (!match) {
                res.json({ status: 'failed', message: 'wrong username and password combination', data: [] }, 404);
            } else {
                const accessToken = sign({ username: user.username, id: user.id }, 'mamanrecing')
                res.json({ status: 'success', message: 'successfully logged in', data: { accessToken: accessToken }, }, 200);
            }
        })
    }
})
router.post('/attendance', async (req, res) => {
    let buffer = Buffer.from(req.body.photo, 'base64');
    if (!fs.existsSync(`storage/attendances/${req.body.username}`)) {
        fs.mkdirSync(`storage/attendances/${req.body.username}`)
    }
    const date = new Date;
    const filename = `storage/attendances/${req.body.username}/attendance_${req.body.username}_${req.body.status}_${(date.toDateString()).split(' ').join('_')}.jpg`;
    fs.writeFileSync(filename, buffer);
    const { latitude, longitude } = JSON.parse(req.body.location);
    const attendance = await attendances.create({
        status: req.body.status,
        photo: filename,
        location: `${latitude},${longitude}`,
    });
    res.json({ message: `Attendance User ${req.body.username} successfully` });
})
router.post('/:id', upload.single('profile_picture'), async (req, res) => {
    let user = req.body;
    user.profile_picture = req.file !== undefined ? req.file.path : null
    await users.update(user, {
        where: {
            id: req.params.id
        }
    });
    const userUpdated = await users.findByPk(req.params.id)
    res.json({ 'status': `successfully update profile user ${req.params.id}`, 'data': userUpdated ?? {} });
});


module.exports = router;