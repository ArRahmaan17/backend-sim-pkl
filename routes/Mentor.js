const express = require('express');
const router = express.Router();
const fs = require('fs')
const { tasks } = require('../models');
const { Authenticated } = require('../middlewares/Authenticated');
let folder = 'storage/task';
const mutler = require('multer');
const diskStorage = mutler.diskStorage({
    destination: (req, file, cb) => {
        cb(null, folder)
    }, filename: (req, file, cb) => {
        console.log(file, req);
        cb(null, 'test.jpg');
    }
});
const upload = mutler({ storage: diskStorage });
router.get('/task', Authenticated, async (req, res) => {
    let tasksData = await tasks.findAll();
    if (tasksData.length > 0) {
        res.json({ message: "Successfully get all tasks", data: tasksData }, 200);
    } else {
        res.json({ message: "Failed get tasks", data: tasksData }, 404);
    }
});
router.get('/task/:id', Authenticated, async (req, res) => {
    let tasksData = await tasks.findByPk(req.params.id);
    if (tasksData) {
        res.json({ message: "Successfully get task", data: tasksData }, 200);
    } else {
        res.json({ message: "Failed get task", data: tasksData }, 404);
    }
});

router.post('/task/create', Authenticated, async (req, res) => {
    let thumbnailBuffer = Buffer.from(req.body.thumbnail.replace(/^data\:image\/\w+\;base64\,/, ""), 'base64');
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder)
    }
    let filename = undefined;
    if (req.body.thumbnail) {
        filename = `storage/task/task_${req.body.title.split(' ').join('_')}.jpg`;
        fs.writeFileSync(filename, thumbnailBuffer)
    }
    req.body.userId = req.user.id
    req.body.thumbnail = filename ?? "default-task.jpg"
    let task = await tasks.create(req.body);
    console.log(task)
    res.json({ 'message': "Anjim" })
});

module.exports = router;