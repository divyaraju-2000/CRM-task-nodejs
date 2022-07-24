import {MongoClient} from 'mongodb';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import auth from './auth.js'
import dotenv from "dotenv"
import{createLeads,createContacts,createServiceRequest,updateLeads,updateContact,updateServiceRequest,createUser,Login} from './Function.js'

dotenv.config();
const app = express();
// const secret_key = "my_secret";
const expressJson = express.json();
const bodyParser  = express.urlencoded({extended: true});
app.use([expressJson, bodyParser])
app.use(cors());



async function createConnection(){
    const client = new MongoClient(process.env.MONGO_URL);
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
export const client = await createConnection();
app.get("/",  function(request,response){
     response.send("Hi");
})

app.post("/register",async function(request,response){

    const password1 = await request.body.password.toString();
    const hashedPassword = await generateHashedPassword(password1)
    
    const  result = await createUser(request, hashedPassword);
    console.log(result);
    response.send(result);
})

app.post("/createContacts", async function(request,response){
    const result = await createContacts(request, response)
    response.send(result);
})

app.post("/createLeads/auth", async function(request,response){
    const result = await createLeads(request, response)
    response.send(result);
})

app.post("/createServicerequest/auth", async function(request,response){
    const service = await createServiceRequest(request)
    response.send(service);
})

app.get("/updateContact/:id",async function(request,response){
    const {id} = request.params;
    const data =request.body;
    const  result = await updateContact(id, data);
    response.send(result);
})

app.get("/updateLeads/:id",async function(request,response){
    const {id} = request.params;
    const data =request.body;
    const  result = await updateLeads(id, data);
    response.send(result);
})


app.get("/updateServicerequest/:id",async function(request,response){
    const {id} = request.params;
    const data =request.body;
    const  result = await updateServiceRequest(id, data);
    response.send(result);
})




app.post("/login/auth", async function(request,response){
    const{username,password}=request.body
    const userDB = await Login(username)
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


app.listen(process.env.PORT,()=>console.log(`App is running at ${process.env.PORT}`));


