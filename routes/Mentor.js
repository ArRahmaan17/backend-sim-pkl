const express = require('express');
const router = express.Router();
const moment = require('moment');
const fs = require('fs')
const { tasks, users, tasks_comment, tasks_detail } = require('../models');
const { Authenticated } = require('../middlewares/Authenticated');
const { Op } = require('sequelize');
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
        include: [
            { model: users },
            { model: tasks_comment, include: { model: users } },
            { model: tasks_detail, where: { userId: req.user.id }, required: false, include: { model: users } },
        ]
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
    await tasks.create(req.body);
    res.status(201).json({ 'message': "Task Create Successfully" })
});

router.post('/task/:id/update', Authenticated, async (req, res) => {
    let filename = undefined;
    if (req.body.thumbnail) {
        let task = await tasks.findByPk(req.params.id);
        fs.rmSync(task.thumbnail)
        let thumbnailBuffer = Buffer.from(req.body.thumbnail.replace(/^data\:image\/\w+\;base64\,/, ""), 'base64');
        filename = `storage/task/task_${req.body.title.split(' ').join('_')}_${moment().utcOffset(7).format("Y_M_D_H_m_s")}.jpg`;
        fs.writeFileSync(filename, thumbnailBuffer)
        req.body.thumbnail = filename;
    }
    req.body.userId = req.user.id
    await tasks.update(req.body, { where: { id: req.params.id } });
    res.status(200).json({ 'message': "Task Updated Successfully" })
});
module.exports = router;