import Task from '../models/task';
import HttpException from '../exceptions/error';
import ResourceNotFoundException from '../exceptions/ResourceNotFoundException';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class TaskService {
  constructor(){ }

  public createTask = async (updatedTask, userId: string) => {
    const task = new Task({
      ...updatedTask,
      owner: userId
    })
    await task.save();
    return task;
  }

  public getTaskById = async (taskId, userId) => {
    const task = await Task.findOne({ _id: taskId, owner: userId });
    if (!task){
      throw new ResourceNotFoundException('Task', taskId);
    }
    return task;
  }

  public getTasks = async (user: any, query: any) => {
    const match = this.getMatchObject(query)
    const options = this.getOptionsObject(query)
    await user.populate('tasks').execPopulate({
      path: 'tasks',
      match,
      options
    })
    const tasks = user.tasks;
    return tasks;
  }

  public updateTask = async (updatedTask: any, taskId, userId) => {
    const updates = Object.keys(updatedTask);
    const allowedUpdates = ['header', 'description', 'date', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation){
      throw new HttpException(400, "Invalid updates");
    }

    const task = await Task.findOne({ _id: taskId, owner: userId });

    if (!task){
      throw new ResourceNotFoundException('Task', taskId);
    }

    updates.forEach((update) => task[update] = updatedTask[update]);
    await task.save();
    return task;
  }

  public deleteTask = async (taskId, userId) => {
    const task = await Task.findOne({ _id: taskId, owner: userId });

    if (!task){
      throw new ResourceNotFoundException('Task', taskId);
    }

    task.deleteOne();
  }

  private findByCredentials = async (email: string, password: string) => {

  }

  private getMatchObject = (query: any) => {
    const match = {};
    if (query.completed){
      match['completed'] = query.completed === 'true';
    }
    return match;
  }

  private getOptionsObject = (query: any) => {
    const options = {};
    if (query.limit){
      options['limit'] = parseInt(query.limit)
    }

    if (query.skip){
      options['skip'] = parseInt(query.skip);
    }
    return options;
  }

}

module.exports = TaskService;