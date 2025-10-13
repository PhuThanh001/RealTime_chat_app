//const express = require('express')
import dotenv from "dotenv";
import express from "express"
import authRouters from "./routers/auth.router.js"
import messageRouters from "./routers/message.router.js"

dotenv.config();
const app  = express();

const PORT = process.env.PORT || 3000 ;


app.use(express.json({limit :"5mb"})); //req.body
app.use(cors({origin: ENV.ClIENT_URL , credentials:true }))
app.use('/api/auth' , authRouters)
app.use('/api/message' , messageRouters)
app.use(cookieParers());

app.listen(PORT , () => console.log('server running on port 3000 ' + PORT));