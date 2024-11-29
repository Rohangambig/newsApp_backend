const User = require('../Models/User');

const  getUserById = async (req,res) =>{
    const userId = req.params.userId;

    try{
        const user = await User.findById(userId);
        if(!user)
            return res.status(400).json({message:"User not found"})
        
        return res.status(200).json({userName:user.name,userPicture:user.picture});
    }catch(err)
    {
        return res.status(500).json({message:err})
    }

};

module.exports = {getUserById}