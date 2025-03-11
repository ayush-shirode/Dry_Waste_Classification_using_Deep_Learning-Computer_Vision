function valid(){
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
                }
            });
        });
}