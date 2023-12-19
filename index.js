const express = require('express')
const cors = require('cors')
const app = express();
app.use(express.json());
app.use(cors());

const db = require('./models');
// route Application
const UserRoute = require('./routes/Users')
app.use('/users', UserRoute);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('Server Is Running http://localhost:3000');
    });
})