const express = require('express')
const router = express.Router();
const { Users } = require('../models')
const folder = 'storage/profile'
const mutler = require('multer')
const storage = mutler.diskStorage({
    destination: (req, file, cb) => {
        if (file) {
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

router.post('/:id', upload.single('profile_picture'), async (req, res) => {
    let user = req.body;
    console.log(req.file)
    user.profile_picture = req.file !== undefined ? req.file.path : null
    // await Users.update(user, {
    //     where: {
    //         id: req.params.id
    //     }
    // });
    const userUpdated = await Users.findByPk(req.params.id)
    res.json({ 'status': `successfully update profile user ${req.params.id}`, 'data': userUpdated });
})


module.exports = router;