const express = require('express')
const cors = require('cors')
const app = express();
const bodyParser = require('body-parser');
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use('/storage', express.static('storage/'))

const db = require('./models');
// route Application
const UserRoute = require('./routes/Users');
const AuthRoute = require('./routes/Auth');
const MentorRoute = require('./routes/Mentor');
app.use('/users', UserRoute);
app.use('/auth', AuthRoute);
app.use('/mentor', MentorRoute);

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log('Server Is Running http://localhost:3001');
    });
})