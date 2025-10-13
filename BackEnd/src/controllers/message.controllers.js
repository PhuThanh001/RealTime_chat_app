import Message from "../models/Message"
import User from "../models/User";
import cloudinary from "../lib/cloudinary.js";


export const GetAllContacts = async (req , res) => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id : { $ne: loggedInUserId}}).select("-password");
        
        res.status(200).json(filteredUsers);
    }catch(error) {
        console.error("Error from message controller" , error)
        res.status(500).json({message:"Server Error"})
    }    
}
export const GetMessageByUserId = async(req , res) => {
    try{    const myId = req.user._id
    const {id : userToChatId}  = req.params

    const message = await Message.FindByUserIdToFindMessage
    ({
        $or: [
            {senderId: myId , receiverId: userToChatId},
            {senderId: userToChatId , receiverId: myId}
        ]
    })
        res.status(200).json(message)}
 catch(error) {
    console.error("Error from message Controller: " , error.message)
    res.status(500).json({message: "Internal Server Error"})
}
}
export const GetChatPartner = async(req , res) => {
    try {
        const loggedInUserId = req.user_id;
        const message = await Message.Find({
            $or: [{ senderId: loggedInUserId} , {receiverId : loggedInUserId}]
        })
        const ChatParner = [
            ...new Set(
                message.map((msg) => 
                    msg.senderId.toString() === loggedInUserId.toString()
                ? msg.receiverId.toString()
                : msg.senderId.toString()
            )
        ),
        ]
    }catch(error) {
        console.log("Error in message controller: "  , error)
    }
} ;

export const sendMessage = async(req , res) => {
    try
    {
        const {text , image} = req.body;
        const {id : receiverId} = req.params;
        const senderId = req.User._id;

        if(!text && !image) {
            res.status(400).json({message: "text or Image is required"})
        }
        if(senderId.equal(receiverId)) {
            res.status(400).json({message: "you cannot send message to yourself"})
        }
        const receiverExist = await User.exists({_id: receiverId})
        if(!receiverExist) {
            return res.status(400).json({message: "Receiver is not exist"})
        }

        let imageUrl;
        if(image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            let imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })
        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    }catch(error){
        console.error("Error from in messageController:" , error)
        res.status(500).json({message:"Internal Server Error"})
    }
};