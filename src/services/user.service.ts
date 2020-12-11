import User from '../models/user';
import HttpException from '../exceptions/error';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class UserService {
  constructor(){ }

  public authenticateUserCredentials = async (email: string, password: string) => {
    const user = await this.findByCredentials(email, password);
    const token = await this.generateAuthToken(user);
    return { user, token }
  }

  public createUser = async (userDetails: any) => {
    const user = new User(userDetails);
    await user.save();
    const token = await this.generateAuthToken(user);
    return { user, token }
  }

  public updateUser = async (updatedUser: any, currentUser: any) => { 
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

  public getNavigationItems = async (user: any) => {
    const populatedUser = await user.populate('areas').populate('projects').execPopulate();
    const areas = populatedUser["areas"];
    const projects = populatedUser["projects"];
    const navigationItems = this.createNavigationItemsObject(areas, projects);
    return navigationItems;
  }

  private createNavigationItemsObject(areas: any, projects: any){
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
    const user = await User.findOne({ email });

    if (!user){
      throw new HttpException(404, "User not found");
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch){
      throw new HttpException(403, "Unable to login");
    }
  
    return user;
  }

  private generateAuthToken = async (user) => {    
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SIGNATURE)
    user.tokens = user.tokens.concat({ token })
    await user.save();

    return token;
  }

  public refreshCurrentSessionToken = async (user:any, currentSessionToken: any) => {
    //TODO - This function needs a better name
    user.tokens = user.tokens.filter(token => {
      return token.token !== currentSessionToken;
    })

    user.save()
  }
}

export default UserService;
