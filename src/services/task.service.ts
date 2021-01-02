import HttpException from '../exceptions/error';
import { clearCache }  from './cache.service';
import Task, { ITask } from '../models/task';
import { IUser } from '../models/user';
import { Request } from 'express';

class TaskService {
  public redisClient;

  constructor(RedisClient: any){
    this.redisClient = RedisClient;
  }

  public createTask = async (updatedTask: ITask, userId: string) => {
    const task = new Task({
      ...updatedTask,
      owner: userId
    })

    await task.save();
    
    clearCache(userId)

    return task;
  }

  public getTaskById = async (taskId: string, userId: string) => {
    const task = await Task.findOne({ _id: taskId, owner: userId });

    if (!task){
      throw new HttpException(404, 'Task not found');
    }

    return task;
  }

  public getTasks = async (user: IUser, query: any) => {
    const match = this.getMatchObject(query);
    const options = this.getOptionsObject(query);
    const sort = this.getSortObject(query);

    const tasks = await Task.find({ owner: user._id })
      .useCache()
      .where('completed').in(match['completed'])
      .sort({'createdAt': sort['sortBy']})
      .limit(options['limit'])
      .skip(options['skip'])
      .exec();
      
    return tasks;
  }

  public updateTask = async (updatedTask: ITask, taskId: string, userId: string) => {
    const updates = Object.keys(updatedTask);
    const allowedUpdates = ['header', 'description', 'date', 'completed', 'project'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation){
      throw new HttpException(405, "Invalid Updates");
    }
    
    const task = await Task.findOne({ _id: taskId })

    if (!task){
      throw new HttpException(404, "Task not found");
    }

    clearCache(userId)
                    
    updates.forEach((update) => task[update] = updatedTask[update]);
    
    await task.save();

    return task;
  }

  public deleteTask = async (taskId: string, userId: string) => {
    const task = await Task.findOne({ _id: taskId, owner: userId });

    if (!task){
      throw new HttpException(404, "Task not found");
    }

    task.deleteOne();
  }

  private getMatchObject = (query: any) => {
    const match = {};

    if (query.completed){
      match['completed'] = query.completed === 'true';
    } else {
      match['completed'] = [true, false]
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

  private getSortObject = (query: any) => {
    const sort = {};

    if (query.sortBy){
      return query.sortBy === 'desc' ? -1 : 1;
    }

    return sort;
  }
}

export default TaskService;
