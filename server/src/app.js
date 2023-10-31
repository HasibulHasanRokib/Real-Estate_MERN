const bodyParser = require("body-parser");
const express=require("express");
const authRouter = require("./router/authRouter");
const cors=require("cors")
const cookieParser=require("cookie-parser");
const listingRouter = require("./router/listingRouter");


const app=express()

app.use(cors({credentials:true,origin:"http://localhost:5173"}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())


app.use("/api/auth",authRouter)
app.use("/api/listing",listingRouter)

app.get("/",(req,res)=>{
    res.status(200).send("Welcome to the real estate mern server.")
})

app.use((err,req,res,next)=>{
    const statusCode=err.statusCode||500;
    const message=err.message||"Internal error";
    return res.status(statusCode).json({
        success:false,
        statusCode,
        message

    })
})


module.exports=app;