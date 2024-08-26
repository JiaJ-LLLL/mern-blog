import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";


export const createPost = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'You are not allowed to create a post!'));
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(403, 'Please fill out all required fileds!'));
    }
    const slug = req.body.title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id,
    });
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        next(error);
    }
}

export const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        // in mongoDB, 1 represents ascending order and -1 represent descending order
        const sortDirection = req.query.order === 'asc' ? 1 : -1;
        

        // $regex: returns document that where title or content contains searchTerm
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId}),
            ...(req.query.category && { category: req.query.category}),
            ...(req.query.slug && { slug: req.query.slug}),
            ...(req.query.postId && { _id: req.query.postId}),
            ...(req.query.searchTerm && {
                $or:[
                    {title: {$regex: req.query.searchTerm, $options: 'i'}},
                    {content: {$regex: req.query.searchTerm, $options: 'i'}}
                ]
            }),
        }).sort({updatedAt: sortDirection}).skip(startIndex).limit(limit);

        // get the total number of docuemnts
        const totalDoc = await Post.countDocuments();
        
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        );

        const lastMonthPosts = await Post.countDocuments({createdAt: {$gte: oneMonthAgo}});
        res.status(200).json({
            posts,
            totalDoc,
            lastMonthPosts
        });
    } catch (error) {
        next(error);
    }
}

export const deletePost = async (req, res, next) => {
    if (!req.user.isAdmin || req.params.userId != req.user.id) {
        return next(errorHandler(403, 'You are not allowed to delete this post!'));
    }

    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('The post has been deleted');
    } catch (error) {
        next(error);
    }
}


export const updatePost = async (req, res, next) => {
    if (!req.user.isAdmin || req.params.userId != req.user.id) {
        return next(errorHandler(403, 'You are not allowed to delete this post!'));
    }

    try {
        const param = req.params;
        const newPost = req.body;

        const updatedPost = await Post.findByIdAndUpdate(param.postId, {
            $set: {
                title: newPost.title,
                content: newPost.content,
                category: newPost.category,
                image: newPost.image
            }
        }, {new: true});
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error)
    }
}
