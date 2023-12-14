import  express  from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
    user :"postgres",
    database:"studentdb",
    password: "deepanshu2711",
    host: "localhost" ,
    port :5432
})
db.connect();

const app = express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json());

app.get('/', (req,res)=>{
    res.send("working");
})



//All Students

app.get('/api/v1/students' , async(req,res)=>{
    const result =await db.query("select * from students" ,(err,results)=>{
        if(err){
            throw err;
        }else{
            res.status(200).json(results.rows);
        }
    })
    
    
})

// Student By ID


app.get('/api/v1/students/:id' , async(req,res)=>{

    const result =await db.query("select * from students where id = $1",[req.params.id] ,(err,results)=>{
        if(err){
            throw err;
        }else{
            res.status(200).json(results.rows);
        }
    })
    
    
})

//Add Students

app.post("/" , async(req,res)=>{
    const name =req.body['name'];
    const email =req.body['email'];
    const age =req.body['age'];
    const dob =req.body['dob'];

    const existingEmail = await db.query("select * from students where email = $1" ,[email] ,(err,results)=>{
        if(results.rows.length){
            res.send("Email already in use !")
        }else{
            db.query("insert into students (name , email , age , dob) values($1, $2, $3, $4)",[name,email,age,dob]);
            res.status(200).send("Added !")
        }
    });
});


//Delete Student By Id

app.delete('/delete/:id',async(req,res)=>{
    await db.query("select * from students where id =$1",[req.params.id],(err,results)=>{
        if(!results.rows.length){
            res.send("Student with given id doesn't exist !")
        } else{
            db.query("delete from students where id =$1",[req.params.id]);
            res.status(200).send("Deleted !")
        }
        
    })
})


//Update Student by id

app.put('/update/:id' , async(req,res)=>{
    const name =req.body['name'];
    const email =req.body['email'];
    const age =req.body['age'];
    const dob =req.body['dob'];
    await db.query("select * from students where id =$1"[req.params.id],(err,results)=>{
        if(!results.rows.length){
            res.send("Student with given id does not exist !")
        }else{
            db.query("update students set name = $1 ,email =$2 ,age  =$3, dob =$4 where id =$5",[name,email,age,dob,req.params.id]);
            res.status(200).send("updated !");
        }
    })
})

app.listen(3000 , ()=>{
    console.log("server listening at port 3000...");
})