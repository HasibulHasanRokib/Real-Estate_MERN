require("dotenv").config()

const DB_URL=process.env.DB_URL;
const JWT_KEY=process.env.JWT_ACCESS_KEY;

module.exports={DB_URL,JWT_KEY}