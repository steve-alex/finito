import User from '../models/user';
import HttpException from '../exceptions/error';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
      throw new HttpException(400, "Invalid Updates");
    }

    updates.forEach((update) => currentUser[update] = updatedUser[update]);
    await currentUser.save();
    return currentUser;
  }

  private findByCredentials = async (email: string, password: string) => {
    const user = await User.findOne({ email });

    if (!user){
      throw new Error('User not found');
      //TODO - Create a new error for this
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch){
      throw new Error('Unable to login');
      //TODO - Create a new error for this
    }
  
    return user;
  }

  private generateAuthToken = async (user) => {    
    const token = jwt.sign({ _id: user._id.toString() }, 'temp')
    // TODO - put this into env variable
    user.tokens = user.tokens.concat({ token })
    await user.save();

    return token;
  }

  public refreshTokenAndLogout = async (user:any, currentSessionToken: any) => {
    //TODO - This function needs a better name
    user.tokens = user.tokens.filter(token => {
      return token.token !== currentSessionToken;
    })

    user.save()
  }
}

module.exports = UserService;