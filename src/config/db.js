import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });

const connectionCache = {};

const databaseConfig = (req, res, next) => {
  try {
    let dbname = "AttendancePro";
    if (!dbname) {
      return res.status(400).send("DB Name needed");
    }
    if (connectionCache[dbname]) {
      req.mysql = connectionCache[dbname].mysql;
    } else {
      const mysql = getSqlConnection(dbname);
      connectionCache[dbname] = { mysql };
      req.mysql = mysql;
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send("Database configuration error");
  }
};

export const getSqlConnection = (dbname) => {
  // let mysqlConnection = mysqlConnectionCache.get(dbname);
  let mysqlConnection = null;

  //IF NO EXISTING CONNECTION NEED TO CREATE DBCONNECTION
  if (!mysqlConnection) {
    mysqlConnection = mysql.createPool({
      host: process.env.HOST,
      port: 3306,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: dbname,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true,
    });
  }

  return mysqlConnection;
};

export default databaseConfig;
