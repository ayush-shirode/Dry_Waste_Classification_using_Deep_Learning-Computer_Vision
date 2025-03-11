const express=require("express");
const mysql=require("mysql");
const dotenv=require("dotenv");
const path=require('path');
const cookieParser = require('cookie-parser'); 
const publicDirectory= path.join(__dirname, './public');



dotenv.config({
    path: './.env'
});
const app=express();
//view engine for html
app.set('view engine','hbs');
app.use(cookieParser()); 


app.use(express.static(publicDirectory))
const con=mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});
con.connect((error)=>{
    if(error){
        console.log("not so good");
        console.log(error);
    }else{
        console.log("Good job");
    }
});



app.use(express.urlencoded({ extended : false}))
app.use(express.json());
//defines routers
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


app.listen(5000,() =>{
    console.log("Server started on port 5000");
});
