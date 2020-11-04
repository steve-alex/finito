const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');
const projectRouter = require('./routers/project');
const areaRouter = require('/router/area');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
app.use(projectRouter);
app.use(areaRouter);

export default app;
