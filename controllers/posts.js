import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

export const getPost = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if id is valid from mongoose
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).send('Post not found!')
        }

        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(404).json(error);
    }
}

export const getAllPosts = async (req, res) => {
    const { page } = req.query;

    try {
        const POST_LIMIT = 5; // Limit of posts to fetch and display by default 5
        const startIndex = (Number(page) - 1) * POST_LIMIT; // get the starting of every page
        const total = await PostMessage.countDocuments({});

        const posts = await PostMessage.find().sort({ _id: -1}).limit(POST_LIMIT).skip(startIndex); // sort list of posts to newest to oldest

        res.status(200).json({ posts: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / POST_LIMIT) });
    } catch (error) {
        res.status(404).json(error);
    }
};

export const getPostsBySearch = async (req, res) => {

    const { searchQuery, tags } = req.query;
    try {
        const title = new RegExp(searchQuery, 'i'); // to be equal all evalue like: Test, TEST, test
        const posts = await PostMessage.find({ $or: [ { title }, { tags: { $in: tags.split(',') } }] }); // find all posts either title or tags

        res.status(200).json({ data: posts });
    } catch (error) {
        res.status(404).json(error);
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString()});

    try {
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(409).json(error);
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params;
    const updatePostData = req.body;

    // Check if id is valid from mongoose
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send('Post not found!')
    
    try {
        const newUpdatePost = await PostMessage.findByIdAndUpdate(id, updatePostData, { new: true});
        
        res.status(201).json(newUpdatePost);
    } catch (error) {
        res.status(404).send(error)
    }
}

export const deletePost = async (req, res) => {
    const { id } = req.params;

    // Check if id is valid from mongoose
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).send('Post not found!')

    try {
        await PostMessage.findByIdAndDelete(id);
        
        res.json({ message: 'Post successfully deleted!'});
    } catch (error) {
        res.status(404).send('Post not found!')
    }
}

export const likePost = async (req, res) => {
    const { id } = req.params;
    const { type } = req.body;

    // Check if user is authenticated
    if (!req.userId) {
        return res.json({ message: 'User Unauthenticated.'});
    }

    // Check if id is valid from mongoose
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).send(error)
    }
        
    try {
        const post = await PostMessage.findById(id);

        switch (type) {
            case 'like':
                // Find user if like or unlike
                const indexLikes = post.likes.findIndex((id) => id === String(req.userId));

                if (indexLikes === -1) {
                    // like the post
                    post.likes.push(req.userId);
                    post.disLikes = post.disLikes.filter((id) => id !== String(req.userId));
                } else {
                    // dislike the post
                    post.likes = post.likes.filter((id) => id !== String(req.userId));
                }
                const updateLikePost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

                res.status(201).json(updateLikePost);
                break;

            case 'dislike':
                // Find user if already dislike this post
                const indexDisLIkes = post.disLikes.findIndex((id) => id === String(req.userId));
                
                if (indexDisLIkes === -1) {
                    post.disLikes.push(req.userId);
                    post.likes = post.likes.filter((id) => id !== String(req.userId));
                } else {
                    post.disLikes = post.disLikes.filter((id) => id !== String(req.userId));
                }

                const updateDisLikePost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

                res.status(201).json(updateDisLikePost);
                break;
                
            default:
                res.status(201).json(post);
                break;
        }
    } catch (error) {
        res.status(404).send(error)
    }
}

export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;

    try {
        const post = await PostMessage.findById(id);

        post.comments.push(comment);

        const updatePost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

        res.status(201).json(updatePost);
    } catch (error) {
        res.status(404).send(error);
    }
}