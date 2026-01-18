const express = require ('express');
const mongoose = require ('mongoose');
const bcrypt = require ('bcryptjs');
const user = require('./model');
const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://gyanasatyasai12_db_user:SAztmh5HcacByDBF@cluster0.x92qfuv.mongodb.net//').then(() => console.log('Connected to MongoDB')).catch(err => console.log(err));


app.post('/signup',async (req,res) =>{
    const {username} = req.body;
    const {email} = req.body;
    const {password} = req.body
    try{ 
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashed_password = await bcrypt.hash(password,salt)

        const newUser = new user({username,email,password:hashed_password});
        await newUser.save();
        return res.status(200).json("user signup successfully")
    }
    catch(err){
        console.log(err.message);
    }

})

app.post("/login", async (req,res)=> {
    try{
        const {email} = req.body
        const {password} = req.body
        const founduser = await user.findOne({ email });
        await bcrypt.compare(password,founduser.password)
        return res.json({
            message : "Login successful",
             user:{
                id: founduser._id,
                username: founduser.username,
                email: founduser.email
             }
        })
    }
    catch (err){
        console.log(err.message)
    }
    })



app.listen(3000, () => console.log('Server is running on http://localhost:3000'))