import Task from '../models/task.model.js';

// POST /tasks
export async function createTask(req, res, next) {
  try {
    const { taskType, assignee, priorityLevel, description, dueDate, location } = req.body;
    const reqFields = ['taskType','assignee','priorityLevel','description','dueDate','location'];
    for (let f of reqFields) if (!req.body[f]) return res.status(400).json({ status:400, message:`${f} required` });

    const task = await Task.create({
      taskType, assignee, priorityLevel, description,
      dueDate:new Date(dueDate), location,
      createdBy: req.user.sub
    });

    res.status(201).json({
      status:201,
      message:'Task created successfully',
      data:{ taskId: task._id.toString() }
    });
  } catch (err) { next(err); }
}