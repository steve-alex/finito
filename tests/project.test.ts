const request = require('supertest');
import appContainer from '../src/app';
import User from '../src/models/user';
import Area from '../src/models/area';
import Project from '../src/models/project';

const app = appContainer.app;

const userOne = {
  name: 'Steveo',
  email: 'steve@gmail.com',
  password: 'password',
}

const areaOne = {
  name: 'Technology',
}

const projectOne = {
  name: 'Build finito-api',
}

beforeAll(async () => {
  await User.deleteMany();
  await Area.deleteMany();
  await Project.deleteMany();

  const user = await new User(userOne).save();

  const area = await new Area({
    ...areaOne,
    owner: user._id,
  }).save();

  const project = await new Project({
      ...projectOne,
      area: area._id,
      owner: user._id
  }).save();

  console.log("Before all.......");
})

afterAll(async () => {
  await User.deleteMany();
  await Area.deleteMany();
  await Project.deleteMany();

  console.log("After all........");
})

test('Should create a new project', async() => {
  const user = await User.find({ email: userOne.email });
  const response = await request(appContainer.app).post('/projects').send({
    name: projectOne.name,
    owner: user._id
  }).expect(200);

  const project = await Project.findById(response.body.project._id);

  expect(project).not.toBeNull();

  expect(response.body).toMatchObject({
    project: {
      name: projectOne.name,
      owner: user._id
    }
  });
})

test('Should update project', async() => {
  const user = await User.find({ email: userOne.email });
  const project = await Project.find({ header: projectOne.name });

  const response = await request(app).patch(`/projects/${project._id}`).send({
    name: 'Home'
  }).expect(200)

  expect(response.body).toMatchObject({
    project: {
      name: 'Home',
      owner: user._id
    }
  })
})

test('Should not allow invalid updates', async() => {
  const project = await Project.find({ name: 'Home'});

  await request(app).patch(`/tasks/${project._id}`).send({
    name: 'Home',
    time: '45'
  }).response(405)
})
