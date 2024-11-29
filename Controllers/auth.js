const bcrypt = require('bcrypt');
const User = require('../Models/User');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
    try {
        const { name, email, password, location } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        // Handle file upload
        let picture = "";
        if (req.file) {
            picture = req.file.filename; 
        }

        // Create new user
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            location,
            picture
        });

        // Save the new user
        const savedUser = await newUser.save();
        
        // Respond with the saved user
        res.status(201).json(savedUser);
    } catch (err) {
        console.error('Signup error:', err);  // Log error with a label
        res.status(500).json({ error: err.message });  // Use status 500 for server errors
    }
};

const login = async (req,res) =>{
    try{
        const {email,password} = req.body;
        console.log(req.body);

        const user = await User.findOne({email})
        
        console.log(user);
        if(!user)
            return res.status(400).json({message:"Invalid email"})

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch)
            return res.status(400).json({message:"Invalid password"})

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        return res.status(200).json({ token, user });
    }catch(err){
        console.log("Error message : ",err);
        return res.status(500).json({message:"Server error"});
    }
}

const userinfo = async (req, res) => {
    try {
        const userId = req.user.id; 
        
        const user = await User.findById(userId); // Use findById for fetching user by id
        if (!user)
            return res.status(400).json({ message: "User not found" });

        return res.status(200).json({ user });
    } catch (err) {
        console.error('Error fetching user info:', err);
        res.status(500).json({ message: err.message });
    }
};


module.exports = { signup ,login,userinfo};
