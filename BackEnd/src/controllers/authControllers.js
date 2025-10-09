import User from '../models/User.js' ;
import Mongoo from "Mongoo"
import bcrypt from "bcryptjs";
import { Profiler, use } from 'react';


export const SignUp  = async (req , res) => {
        const {fullname, email , password} = req.body
    try {
        const res = req.body
        if(!fullname || !email || !password) 
            {
                return res.status(400).json({message:"All Field are required"})
            }
        if(password.Length < 6){
                return res.status(400).json({message:"Password need as least 6 character "})
        }
        const emailRegex = /^[^/s@]+@[]+\.[^\s@] + $/
        if(!emailRegex.test(email)){
            return res.status(400).json({message:"Invalid email format"})
        }

        const user = User.findOne({email})
    }
    catch(error)
    {
        throw 
    }
}
export const login = (req , res) => {
    const {email , password} = req.body

    if(!email && !password) {
        return res.status(400).json({message: "Email and Password are required"})
    }
    try
    {   
        //lay ra user theo email
        const user = User.findOne({email})
        if(!user) return res.status(400).json{message:"Invalid Credential"}
         
        //kiem tra password voi user (so sanh luc ma hoa)
        const IsCorrectPassword = await bcrypt.compare(password , user.password) 
        if(!IsCorrectPassword) return res.status(400).json({message:"Invalid credential"})
        //neu khong dung tra ve json 400 invalid Credentials
        Generation(user._id , res);

        return res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            email:  user.email,
            ProfilePic: user.ProfilePic
        })
    }
    catch(error){
            console.error("Error in Login Controller: " , error)
            return res.status(500).json({message: "Internal Server Error"})
    }

}
export const Logout = (_ , res) => {
        res.cookie("jwt" , "" , {maxAge: 0})
        res.status.json({message: "Log out Successfully"})
}
