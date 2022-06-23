const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');

<<<<<<< HEAD
=======
// a constructor we require to store cookies
>>>>>>> 55b90d34d1eb40cd7b0fe4a945e6d8465c7762a9
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({ helpers });

<<<<<<< HEAD
=======
// Declare a session and its properties for use later in our middleware
>>>>>>> 55b90d34d1eb40cd7b0fe4a945e6d8465c7762a9
const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

<<<<<<< HEAD
=======
// Middleware for creating a user session
>>>>>>> 55b90d34d1eb40cd7b0fe4a945e6d8465c7762a9
app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
