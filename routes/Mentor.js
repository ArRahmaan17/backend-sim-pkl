const express = require('express');
const router = express.Router();
const moment = require('moment');
const fs = require('fs')
const { tasks, users, tasks_comment } = require('../models');
const { Authenticated } = require('../middlewares/Authenticated');
let folder = 'storage/task';
router.get('/task', Authenticated, async (req, res) => {
    let tasksData = await tasks.findAll({ include: users });
    if (tasksData.length > 0) {
        res.status(200).json({ message: "Successfully get all tasks", data: tasksData });
    } else {
        res.status(404).json({ message: "Failed get tasks", data: tasksData });
    }
});
router.get('/task/:id', Authenticated, async (req, res) => {
    let tasksData = await tasks.findByPk(req.params.id, {
        include: { all: true, nested: true }
    });
    if (tasksData) {
        res.status(200).json({ message: "Successfully get task", data: tasksData });
    } else {
        res.status(404).json({ message: "Failed get task", data: tasksData });
    }
});

router.post('/task/:id/comment', Authenticated, async (req, res) => {
    let comment = await tasks_comment.create({ content: req.body.content, up: 0, down: 0, userId: req.user.id, taskId: req.params.id });
    if (comment) {
        let comments = await tasks_comment.findAll({ where: { taskId: req.params.id }, order: [['createdAt', 'ASC']], include: users });
        res.status(200).json({ "message": "comment successfully added", data: comments });
    } else {
        res.status(401).json({ "message": "failed adding your comment" });
    }
});

router.post('/task/create', Authenticated, async (req, res) => {
    let thumbnailBuffer = Buffer.from(req.body.thumbnail.replace(/^data\:image\/\w+\;base64\,/, ""), 'base64');
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder)
    }
    let filename = undefined;
    if (req.body.thumbnail) {
        filename = `storage/task/task_${req.body.title.split(' ').join('_')}_${moment().utcOffset(7).format("Y_M_D_H_m_s")}.jpg`;
        fs.writeFileSync(filename, thumbnailBuffer)
    }
    req.body.userId = req.user.id
    req.body.thumbnail = filename ?? "default-task.jpg"
    let task = await tasks.create(req.body);
    res.status(200).json({ 'message': "Task Create Successfully" })
});

module.exports = router;