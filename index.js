import {MongoClient} from 'mongodb';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import auth from './auth.js'
import dotenv from "dotenv"

dotenv.config();
const app = express();
// const secret_key = "my_secret";
const expressJson = express.json();
const bodyParser  = express.urlencoded({extended: true});
app.use([expressJson, bodyParser])
app.use(cors());
const PORT = 4000;
const MONGO_URL ='mongodb://localhost'
console.log(process.env)
console.log(process.env.secret_key);
async function createConnection(){
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("success");
    return client;
}

async function  generateHashedPassword(password) {
    const No_of_rounds =10;
    const salt = await bcrypt.genSalt(No_of_rounds);
    const hashed = await bcrypt.hash(password,salt)
    console.log(salt,hashed);
    return hashed;

}
const client = await createConnection();
app.get("/",  function(request,response){
     response.send("Hi");
})

app.post("/register",async function(request,response){
 
    const password1 = await request.body.password.toString();
    const hashedPassword = await generateHashedPassword(password1)
    console.log(password1);
    console.log(hashedPassword);
    const  result = await client.db("CRM").collection("users").insertOne({
        firstname:request.body.firstname,
        lastname:request.body.lastname,
        username:request.body.username,
        password:hashedPassword,
        role:request.body.role
        
    });
    console.log(result);
    response.send(result);
})

app.post("/createContacts", async function(request,response){
    const result = await client.db("CRM").collection("contacts").insertOne({
    name:request.body.name,
    email:request.body.email,
    phone:request.body.phone,
    city:request.body.city,
    street:request.body.street,
    country:response.body.country
    })
    response.send(result);
})

app.post("/login/auth", async function(request,response){
    const{username,password}=request.body
    const userDB = await client.db("CRM").collection("users").findOne({username:username})
    if(!userDB){
        response.send({"error":"Invalid credentials"})
    }
    else{
        const storedPassword = userDB.password;
        const isPasswordMatched = await bcrypt.compare(password.toString(),storedPassword);
        if(isPasswordMatched){
         
               const token = jwt.sign({id:userDB._id},process.env.secret_key);
               response.send({"message":"Logged in successfully","token":token})
               console.log("matched",token)
               console.log(userDB,storedPassword)
               
        }
        else{
            response.send("Invalid credentials");
            console.log("Invalid")
        }
    }
})


app.listen(PORT,()=>console.log(`App is running at ${PORT}`));