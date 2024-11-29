const { Posts } = require('../Models/Posts');
const { User } = require('../Models/User'); // Assuming you have a User model

const post = async (req, res) => {
  try {
    const { discription } = req.body;
    const picture = req.file ? req.file.filename : null;

    const newPost = new Posts({
      userId: req.user.id,
      picture: picture,
      discription: discription,
      likes: 0, // Initial likes count
      likedBy: []
    });

    const savedPost = await newPost.save();
    const io = req.app.get('socketio');

    const postWithUser = await Posts.findById(savedPost._id).populate('userId', 'username profilePicture'); // Adjust fields as needed

    io.emit('newPost', postWithUser);
    res.status(201).json({ message: "Data stored successfully" });

  } catch (err) {
    console.log("Error in storing the data to the news cluster", err);
    res.status(500).json({ message: err });
  }
};

// Other functions remain the same


const getPost = async (req, res) => {
    try {
        const allPost = await Posts.find();
        if (!allPost)
            return res.status(400).json({ message: "Cannot fetch the data" });

        return res.status(200).json({ allPost });
    } catch (err) {
        console.log("Error in fetching the data", err);
        return res.status(500).json({ message: "Try catch block error" });
    }
};

const handleLikes = async (req, res) => {
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        // Find the post and check if it exists
        const post = await Posts.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const hasLiked = post.likedBy.includes(userId);
       
        const updateFields = hasLiked
            ? { $inc: { likes: -1 }, $pull: { likedBy: userId } }
            : { $inc: { likes: 1 }, $addToSet: { likedBy: userId } };

        await Posts.findByIdAndUpdate(postId, updateFields, { new: true });

        // Fetch the updated post
        const updatedPost = await Posts.findById(postId);

        return res.status(200).json({ likes: updatedPost.likes, message: 'Post liked successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Error liking the post', error: err.message });
    }
};



const  sharedPost = async (req, res) => {
    try
    {
        const {postId} = req.params;
        
        const post = await Posts.findById(postId);
        if(!post)
            return res.status(400).json({message:"not able to get the post"})
        
        return res.status(200).json({post})
    }catch(err)
    {
        return res.status(500).json({message:err});
    }
};


module.exports = { post, getPost, handleLikes ,sharedPost};
