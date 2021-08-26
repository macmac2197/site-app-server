import express from 'express';
import { getAllPosts, createPost, updatePost, deletePost, likePost, getPostsBySearch, getPost, commentPost } from '../controllers/posts.js';
import auth from '../middleware/auth.js';

const router = express.Router();


router.get('/', getAllPosts);
router.get('/search', getPostsBySearch);
router.get('/:id', getPost);


router.post('/', auth, createPost);

router.put('/:id', auth, updatePost);
router.put('/:id/likePost', auth, likePost);
router.put('/:id/commentPost', auth, commentPost);

router.delete('/:id', auth, deletePost);


export default router;