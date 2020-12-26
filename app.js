var express = require("express/app");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var app = express();

const sequelize = require("./sequelize");
const { config } = require("process");
const databaseHost = "esportsdemo.mysql.database.azure.com";
const databasePort = "3306";
const PORT = 8080;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

const Sequelize = new Sequelize(
  "esports",
  "cfaison@esportsdemo",
  "R3dhouseserver01",
  {
    host: config.databaseHost,
    port: config.databasePort,
    dialect: "mssql",
    driver: "tedious",
    options: {
      encrypt: true,
      database: "esports"
    },

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  }
);

async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.authenticate();
    console.log("Database connection OK!");
  } catch (error) {
    console.log("Unable to connect to the database:");
    console.log(error.message);
    process.exit(1);
  }
}

async function init() {
  await assertDatabaseConnectionOk();

  console.log(`Starting Sequelize + Express example on port ${PORT}...`);

  app.listen(PORT, () => {
    console.log(
      `Express server started on port ${PORT}. Try some routes, such as '/api/users'.`
    );
  });
}

init();

var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
