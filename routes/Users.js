const express = require('express')
const router = express.Router();
const { users } = require('../models')
let folder = 'storage/profile'
const mutler = require('multer')
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

router.post('/', async (req, res) => {
    const user = req.body;
    const post = await users.create(user);
    res.json({ 'status': 'success', 'data': post });
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
})

router.post('/attendance', upload.single('attendance_photo'), (req, res) => {
    console.log(req)
})


module.exports = router;