const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const MongoStore = require("connect-mongo");
const cron = require("node-cron");
const cors = require("cors");


const donorController = require("./controllers/donor");


const Auth = require("./models/Auth");


const userRoutes = require("./routes/user");
const hospitalRoutes = require("./routes/hospital");
const donorRoutes = require("./routes/donor");
const bloodCampRoutes = require("./routes/bloodcamp");

const dbUrl = "mongodb://127.0.0.1:27017/BloodShare";


async function main() {
  await mongoose.connect(dbUrl);
}


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });


app.set("view engine", "ejs");
app.engine('ejs', ejsMate);


app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-client']
}));



const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,

});

store.on("error", (err) => {
  console.log("ERROR in MONGO SESSION STORE", err);
});



const sessionOptions = {
  store,
  secret: "mysecretoption",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,

  },
};



app.use(session(sessionOptions));

app.use(methodOverride("_method"));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'email' }, Auth.authenticate()));


passport.serializeUser(Auth.serializeUser());
passport.deserializeUser(Auth.deserializeUser());


app.use((req, res, next) => {
  res.locals.currentUser = req.user;

  next();
});


app.use("/", userRoutes);
app.use("/hospital", hospitalRoutes);
app.use("/donor", donorRoutes);
app.use("/camps", bloodCampRoutes);


// run every day at 8 PM
// cron.schedule("* * * * *", async () => {
//   console.log("Running daily notification job...");
//   await donorController.generateNotifications();
// });

app.listen(1000, () => {
  console.log("server started at port 1000");
});
