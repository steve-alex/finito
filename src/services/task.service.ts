import Task from '../models/task';
import HttpException from '../exceptions/error';

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
      throw new HttpException(404, 'Task not found');
    }

    return task;
  }

  public getTasks = async (user: any, query: any) => {
    const match = this.getMatchObject(query);
    const options = this.getOptionsObject(query);
    const sortBy = this.getSortObject(query);

    const populatedUser = await user.populate('tasks').execPopulate({
      path: 'tasks',
      match,
      options,
      sortBy
    });
    
    const tasks = populatedUser.tasks;
                          
    return tasks;
  }

  public updateTask = async (updatedTask: any, taskId, userId) => {
    const updates = Object.keys(updatedTask);
    const allowedUpdates = ['header', 'description', 'date', 'completed', 'project'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation){
      throw new HttpException(405, "Invalid Updates");
    }

    const task = await Task.findOne({ _id: taskId, owner: userId });

    if (!task){
      throw new HttpException(404, "Task not found");
    }

    updates.forEach((update) => task[update] = updatedTask[update]);
    
    await task.save();

    return task;
  }

  public deleteTask = async (taskId, userId) => {
    const task = await Task.findOne({ _id: taskId, owner: userId });

    if (!task){
      throw new HttpException(404, "Task not found");
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

  private getSortObject = (query: any) => {
    const sort = {};

    if (query.sortBy){
      const parts = query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    return sort;
  }
}

export default TaskService;
