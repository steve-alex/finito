import User, { IUser } from '../models/user';
import HttpException from '../exceptions/error';
import { IArea } from '../models/area';
import { IProject } from '../models/project';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class UserService {
  public authenticateUserCredentials = async (email: string, password: string) => {
    const user: IUser = await this.findByCredentials(email, password);
    const token: string = await this.generateAuthToken(user);
    return { user, token }
  }

  public createUser = async (userDetails: IUser) => {
    const user = new User(userDetails);

    try {
      await user.save()
    } catch (err){
      if (err.code == 11000) {
        throw new HttpException(404, "User already exists for username and/or email");
      } else {
        throw err
      }
    }

    const token: string = await this.generateAuthToken(user);

    return { user, token }
  }

  public updateUser = async (updatedUser: IUser, currentUser: typeof User) => { 
    const updates = Object.keys(updatedUser);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation){
      throw new HttpException(405, "Invalid Updates");
    }

    updates.forEach((update) => currentUser[update] = updatedUser[update]);

    await currentUser.save();

    return currentUser;
  }

  public getNavigationItems = async (user: typeof User) => {
    const populatedUser = await user.populate('areas').populate('projects').execPopulate();
    const areas: IArea[] = populatedUser["areas"];
    const projects: IProject[] = populatedUser["projects"];
    const navigationItems = this.createNavigationItemsObject(areas, projects);
    return navigationItems;
  }

  private createNavigationItemsObject(areas: IArea[], projects: IProject[]){
    const navigationItems = {
      projects: [],
      areas: this.getModifiedAreasObject(areas)
    };
    
    projects.forEach(project => {
      if (project.area === undefined){
        navigationItems.projects.push(project);
      } else {
        navigationItems.areas[project.area]['projects'].push(project);
      }
    })

    return navigationItems
  }

  private getModifiedAreasObject(areas: any) {
    // [{ _id: { name: "name", owner: "owner": projects: ["project1", "project2"] }}]
    let modifiedAreas = {};
    areas.forEach(area => {
      let _id = area._id
      modifiedAreas[_id] = {
        name: area.name,
        owner: area.owner,
        projects: []
      }
    })
      
    return modifiedAreas;
  }

  private findByCredentials = async (email: string, password: string) => {
    const user = await User.findOne({ email })

    if (!user){
      throw new HttpException(404, "User not found");
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch){
      throw new HttpException(403, "Unable to login");
    }
  
    return user;
  }

  private generateAuthToken = async (user: typeof User) => {
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SIGNATURE)
    user.tokens = user.tokens.concat({ token })
    await user.save();

    return token;
  }
t
  public refreshCurrentSessionToken = async (user: typeof User, currentSessionToken: string) => {
    user.tokens = user.tokens.filter(token => {
      return token.token !== currentSessionToken;
    })

    user.save()
  }
}

export default UserService;
