const request = require('supertest');
import appContainer from '../src/app';
import User from '../src/models/user';
import Area from '../src/models/area';

const app = appContainer.app;

const userOne = {
  name: 'Steveo',
  email: 'steve@gmail.com',
  password: 'password',
}

const areaOne = {
  name: 'Personal',
}

beforeAll(async () => {
  await User.deleteMany();
  await Area.deleteMany();

  const user = await new User(userOne).save();

  const area = await new Area({
    ...areaOne,
    owner: user._id,
  }).save();

  console.log("Before all.......");
})

afterAll(async () => {
  await User.deleteMany();
  await Area.deleteMany();

  console.log("After all........");
})

test('Should create a new area', async() => {
  const user = await User.find({ email: userOne.email });
  const response = await request(app).post('/areas').send({
    name: areaOne.name,
    owner: user._id
  }).expect(200);

  const area = await Area.findById(response.body.area._id);

  expect(area).not.toBeNull();

  expect(response.body).toMatchObject({
    area: {
      name: areaOne.name,
      owner: user._id
    }
  });
})

test('Should update area', async() => {
  const user = await User.find({ email: userOne.email });
  const area = await Area.find({ header: areaOne.name });

  const response = await request(app).patch(`/area/${area._id}`).send({
    name: 'Home'
  }).expect(200)

  expect(response.body).toMatchObject({
    area: {
      name: 'Home',
      owner: user._id
    }
  })
})

test('Should not allow invalid updates', async() => {
  const area = await Area.find({ name: 'Home'});

  await request(app).patch(`/tasks/${area._id}`).send({
    name: 'Home',
    time: '45'
  }).response(405)
})
