const request = require('supertest');
import appContainer from '../src/app';
import User from '../src/models/user';

const app = appContainer.app;
const userOne = {
  name: 'Steveo',
  email: 'steve@gmail.com',
  password: 'password',
}

beforeAll(async () => {
  await User.deleteMany()
  console.log("Before all.......")
})

afterAll(async () => {
  await User.deleteMany()
  console.log("After all........")
})

beforeEach(async () => {
  await new User(userOne).save();
})

afterEach(async () => {
  await User.deleteMany()
})

test('Should signup a new user', async () => {
  await request(appContainer.app).post('/users').send({
    name: 'James',
    email: 'testing@email.com',
    password: 'heresapassword'
  }).expect(201)
})

test('Should login existing user', async () => {
  const response = await request(app).post('/users/login').send({
    email: userOne.email,
    password: userOne.password
  }).expect(200)

  const user = await User.findById(response.body.user._id);

  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      name: userOne.name,
      email: userOne.email
    }
  })

  expect(user.password).not.toBe('password');
})


test('Should update existing user', async () => {
  const userId = await User.find({email: 'steve@gmail.com'})._id;

  const response = await request(app).patch(`/users/${userId}`).send({
    email: userOne.email,
    password: userOne.password,
    name: 'Steve',
    age: '100'
  }).expect(200)

  const user = await User.findById(response.body.user._id);

  expect(user).not.toBeNull();

  expect(response.body).toMatchObject({
    user: {
      email: userOne.email,
      name: 'Steve',
      age: '100'
    }
  })
})

test('Should not allow invalid updates', async () => {
  const userId = await User.find({email: 'steve@gmail.com'})._id;

  const response = await request(app).patch(`/users/${userId}`).send({
    email: userOne.email,
    password: userOne.password,
    name: 'Steve',
    height: '100'
  }).expect(405)
})

test('Should not authenticate user in with wrong password', async () => {
  await request(app).post('/users/login').send({
    email: userOne.email,
    password: 'wrongpassword'
  }).expect(403)
})

test('Should not authenticate nonexisting user', async () => {
  await request(app).post('/users/login').send({
    email: 'dsifsdfiojds@asldjasdijasdo.asdoisadjoi',
    password: 'wrongpassword'
  }).expect(404)
})

