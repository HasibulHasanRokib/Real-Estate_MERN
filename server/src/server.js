const app=require("./app");
const connectedDB = require("./db");

const PORT=process.env.PORT || 3000;

app.listen(PORT,async()=>{
    console.log(`server is running at http://localhost:${PORT}`)
    await connectedDB()
})