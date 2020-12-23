import AreaService from './area.service';
import ProjectService from './project.service';
import TaskService from './task.service';
import UserService from './user.service';
import { RedisClient }  from './cache.service';

export const areaService = new AreaService();
export const projectService = new ProjectService();
export const taskService = new TaskService(RedisClient);
export const userService = new UserService();

module.exports = {
  areaService,
  projectService,
  taskService,
  userService,
}
