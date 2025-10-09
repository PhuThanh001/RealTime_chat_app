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
        if(user) return res.status(400).json({message: "Email already exists"});
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);
        const newUser = new User({
            fullname,
            email,
            password: hashedPassword
        })
        if(newUser) {
            const SaveUser = await newUser.save();
            generateToken(SaveUser._id , res)

            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.ProfilePic
            })
            try{
                await sendWelcomeEmail(SaveUser.email, SaveUser.fullName , ENV.ClIENT_URL);
            }catch (error) {
                console.error("faile to send wellcome mail" , error);
            }}
            else {
                res.status(400).json({ message:"Invalid user Data"});
            }
    }
    catch(error)
    {
        console.error("Error in signup controller" , error)
        res.status(500).json({message: "Internal server error"}) 
    }
}
export const login = async (req , res) => {
    const {email , password} = req.body

    if(!email && !password) {
        return res.status(400).json({message: "Email and Password are required"})
    }
    try
    {   
        const user = User.findOne({email})
        if(!user) return res.status(400).json({message:"Invalid Credential"})
         
        const IsCorrectPassword = await bcrypt.compare(password , user.password) 
        if(!IsCorrectPassword) return res.status(400).json({message:"Invalid credential"})

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
export const UpdateProfile = async (req , res) => {
    try {
        const {ProfilePic} = req.body;
        if(!ProfilePic) return res.status(400).json({message: "Profile Pic is required"})

        const userId = req.user._id

        const uploadResponse = await clounddinary.uploader.upload(ProfilePic);

        const updateUser = await User.findByIdAndUpdate(
            userId,
            {ProfilePic: uploadResponse.secure.url} ,
            {new : true},
        )
        res.status(200).json(updateUser)

    }catch (error) {
        console.log("Error in Update Profile:" , error)
        res.status(500).json()
    }
}

