
import { Router } from "express";
import Group from "../models/groupsModel.js";
import User from "../models/userModels.js";
const groupRoute = Router();

// Routes for group management
groupRoute.post('/groups', async (req, res) => {
    const group = new Group(req.body);
    await group.save();
    res.status(201).send(group);
});

groupRoute.get('/groups', async (req, res) => {
    const groups = await Group.find().populate('members');
    res.send(groups);
});

groupRoute.delete('/groups/:id', async (req, res) => {
    await Group.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

groupRoute.post('/groups/:id/members', async (req, res) => {
    const group = await Group.findById(req.params.id);
    const user = await User.findOne({name:req.body.name});
    group.members.push(user);
    await group.save();
    res.send(group);
});

export default groupRoute;