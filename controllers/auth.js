const mysql=require('mysql');
const url=require('url');
var id;
var message;
exports.register = (req,res) =>{
    console.log(req.body);
        const{Name,Email,City,Password,ConfirmPassword}=req.body;
    // res.send("Form Submitted");
    const con=mysql.createConnection({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    });con.query("SELECT max(id) FROM userdata",(error,results)=>{
        if(error){
            console.log(error);
        }
        id=(results[0]["max(id)"])+1;
    });
    con.query("select email from userdata where email=?", [Email] , (error, results)=>{
        if(error){
            console.log(error);
        }if(results.length > 0){
            message="That email is already in use";
            return res.redirect(url.format({
                pathname:"/login",
                query: {
                    message: "That email is already in use"
                 }
              }));
        }
            if(Password!==ConfirmPassword){
                message="Passwords do not match";
                return res.redirect(url.format({
                    pathname:"/login",
                    query: {
                        message: "Passwords do not match"
                     }
                  }));
            }
            let ver=0;           
            con.query('INSERT INTO userdata set ?', {id:id, name :Name, Area: City,Verification:ver, password : Password, email :Email} , (error,results)=>{
                
                    console.log(results);
                    res.cookie("userInfo", Email);
                    res.cookie("userLogged", 1);
                    res.cookie("userInfoid", id);
                    con.query('INSERT INTO usersegregationdata set ?',{dataid : id}, (error,results) =>{
                        console.log(results);
                        console.log(error)
                        return res.redirect('/index'),{};  
                    });
                    
                
            });       
    });
};
exports.login = (req,res) =>{
    console.log(req.body);
    const con=mysql.createConnection({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    });
    const{Email,password}=req.body;
    con.query("select password,id from userdata where email=?", [Email] , (error, results)=>{
        if(error){
            console.log(error);
        }console.log(results);
        if(results.length>0){
            console.log(results[0]["password"]);
            if(results[0]["password"]!==null){
            if(results[0]["password"]==password){
                var logged=1;
                var id;
                res.cookie("userLogged", logged);
                console.log();
                res.cookie("userInfo", Email);
                console.log("SELECT id FROM userdata where email =?", [Email]);
                id=results[0]["id"];
                console.log(id+"hello");
                res.cookie("userInfoid", id);
                // res.cookie("userInfoid", id);
                if(req.cookies.userInfo){
                    console.log("User has logged in successfully");
                    res.cookie("userInfoid", id);
                    console.log(id+"hello");
                }else{
                    console.log("User didnt get logged in due to an error");
                }     message= "User has been logged in";
                return res.redirect('/index'),{
                    
                };
            }else{
                console.log("Password was not correct");
                message="Password was not correct";
                return res.redirect(url.format({
                    pathname:"/login",
                    query: {
                        message: "Password was not correct"
                     }
                  }));
            }
            
        }else{
            console.log("Password not recieved");
            return res.redirect(url.format({
                pathname:"/login",
                query: {
                    message: "Password not recieved"
                 }
              }));
        }
        }else{
            console.log("That email is not registered");
            return res.redirect(url.format({
                pathname:"/login",
                query: {
                   "message":"That email is not registered"
                 }
              }));
        }       
    });
    
};exports.registerNGO = (req,res) =>{
    console.log(req.body);
        const{ngoName,Email,Area,Password,ConfirmPassword,phonenumber}=req.body;
        const con=mysql.createConnection({
        host: process.env.host,
        user: process.env.user,
        password: process.env.password,
        database: process.env.database
    });con.query("SELECT max(id) FROM ngo_data",(error,results)=>{
        if(error){
            console.log(error);
        }
        id=(results[0]["max(id)"])+1;
    });
    con.query("select email from ngo_data where email=?", [Email] , (error, results)=>{
        if(error){
            console.log(error);
        }if(results.length > 0){
            message="That email is already in use";
            return res.redirect(url.format({
                pathname:"/login",
                query: {
                    message: "That email is already in use"
                 }
              }));
        }
            if(Password!==ConfirmPassword){
                message="Passwords do not match";
                return res.redirect(url.format({
                    pathname:"/login",
                    query: {
                        message: "Passwords do not match"
                     }
                  }));
            }
            let ver=0;           
            con.query('INSERT INTO ngo_data SET ?', 
                { id: id, name: ngoName, Area :Area,password: Password, email: Email ,phonenumber : phonenumber}, 
                (error, results) => {
                    if (error) {
                        console.log(error);
                        return res.redirect(url.format({
                            pathname: "/login",
                            query: { message: "Database error occurred" }
                        }));
                    } else {
                        console.log(results);
                        res.cookie("ngoInfo", Email);
                        res.cookie("userInfoid", id);
                        return res.redirect('/ngo_list_page'),{
                    
                        };  // Redirecting to '/ngo_list_page' properly
                    }
                }
            );
                  
    });
};
exports.updateSegregate= (req,res)=>{
        console.log("wowie")
        const con=mysql.createConnection({
                host: process.env.host,
                user: process.env.user,
                password: process.env.password,
                database: process.env.database
            });id=req.cookies.userInfoid;
            var garbageamt;
            con.query("select garbageSegregationAmt from usersegregationdata where dataid = ? ",[id],(error,results)=>{
                console.log(results)
                if(error){
                    console.log(error);
                }garbageamt=results[0]["garbageSegregationAmt"];
                con.query("UPDATE `ayush`.`usersegregationdata` SET `garbageSegregationAmt` = ? WHERE (`dataid` = ?)",[garbageamt+1,id],(error,results)=>{
                    console.log(results)
                    if(error){
                        console.log(error);
                    }return res.redirect("/Segregation")
                });
            });
        
    };
