const request = require('supertest');
import appContainer from '../src/app';
import User from '../src/models/user';
import Task from '../src/models/task';

const app = appContainer.app;
const userOne = {
  name: 'Steveo',
  email: 'steve@gmail.com',
  password: 'password',
}

const taskOne = {
  header: 'Make an app',
  description: '',
  date: new Date(),
  completed: false,
}

beforeAll(async () => {
  await User.deleteMany();
  await Task.deleteMany();
  const user = await new User(userOne).save();

  await new Task({
    ...taskOne,
    owner: user._id
  }).save();

  console.log("Before all.......")
})

afterAll(async () => {
  await User.deleteMany()
  await Task.deleteMany()
  console.log("After all........")
})

beforeEach(async () => {
})

afterEach(async () => {
})

test('Should create a new task', async() => {
  const user = await User.find({ email: userOne.email })
  const response = await request(appContainer.app).post('/tasks').send({
    header: 'Make an app',
    description: '',
    date: new Date(),
    completed: false,
    owner: user._id,
  }).expect(200)

  const task = await Task.findById(response.body.task._id);

  expect(task).not.toBeNull();

  expect(response.body).toMatchObject({
    task: {
      header: 'Make an app',
      description: '',
      date: new Date(),
      completed: false,
      owner: user._id,
    }
  })
})

test('Should update task', async() => {
  const user = await User.find({ email: userOne.email });
  const task = await Task.find({ header: 'Make an app' });

  const response = await request(app).patch(`/tasks/${task._id}`).send({
    header: 'Finish the App!',
    description: 'Get this app done and dusted.',
    date: new Date(100000),
    completed: true
  }).expect(200)

  expect(response.body).toMatchObject({
    task: {
      header: 'Finish the App!',
      description: 'Get this app done and dusted.',
      date: new Date(100000),
      completed: true,
      owner: user._id
    }
  })
})

test('Should not allow invalid updates', async() => {
  const task = await Task.find({ header: 'Finish the App!'});

  await request(app).patch(`/tasks/${task._id}`).send({
    description: 12345,
    completed: 'sorta',
    difficulty: 'Hard'
  }).response(405)
})
