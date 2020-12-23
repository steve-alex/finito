import App from './app';
require('dotenv').config();

const app = new App(parseInt(process.env.PORT || '5000'))
app.listen();
