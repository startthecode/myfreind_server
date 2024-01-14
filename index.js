import "dotenv/config";
import Express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import session from "express-session";
import MySQLStoreImport from "express-mysql-session";
import { allRoutes } from "./routes/allroutes.js";
import { db_Credentials, sequelize } from "./database/db.js";
import { passportLoginInit } from "./auth/passport.js";
import { initSocket } from "./sockets/socket.js";
let server = Express();

//init socket
initSocket();

// chk database connection
try {
  await sequelize.authenticate();
  await sequelize.sync({ force: false });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

server.use(Express.json());
server.use(Express.urlencoded({ extended: true }));
// intialize Express session
let mysqlStore = MySQLStoreImport(session);
let sessionStore = new mysqlStore(db_Credentials);
server.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);

// initalize Cors
server.use(
  cors({
    origin: process.env.CLIENT_URL, // Replace with your frontend URL
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // Enable credentials (cookies, authorization headers)
    optionsSuccessStatus: 204, // No content response for preflight requests
  })
);

// static file path
let __fileName = fileURLToPath(import.meta.url);
let __dirname = dirname(__fileName);
server.use(Express.static(join(__dirname, "/")));

// initalize possport
passportLoginInit(server);

// initailize routes
allRoutes(server);

// start the server
server.listen(process.env.PORT, () => {
  console.log(
    "Starting Express server " + `${process.env.CLIENT_URL}/${process.env.PORT}`
  );
});
