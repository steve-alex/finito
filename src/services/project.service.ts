import Project, { IProject } from "../models/project";
import HttpException from "../exceptions/error";

class ProjectService {
  public createProject = async (projectDetails: IProject, userId: string) =>  {
    const project = new Project({
      ...projectDetails,
      owner: userId
    })
    
    await project.save();

    return project;
  }

  public getProjectById = async (projectId: string, userId: string) => {
    const project = await Project.findOne({ _id: projectId, owner: userId });

    if (!project){
      throw new HttpException(404, 'Unable to find project');
    }

    return project;
  }

  public updateProject = async (updatedProject: IProject, projectId: string, userId: string) => {
    const updates = Object.keys(updatedProject);
    const allowedUpdates = ['name', 'area'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation){
      throw new HttpException(405, "Invalid updates");
    }
  
    const project = await Project.findOne({ _id: projectId, owner: userId });

    if (!project){
      throw new HttpException(404, 'Unable to find project');
    }

    updates.forEach((update) => project[update] = updatedProject[update]);

    await project.save();

    return project;
  }

  public deleteProject = async (projectId: string, userId: string) => {
    const project = await Project.findOne({ _id: projectId, owner: userId });

    if (!project){
      throw new HttpException(404, 'Unable to find project');
    }

    project.deleteOne();
  }
}

export default ProjectService;