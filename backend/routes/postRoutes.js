import express from 'express';
import multer from 'multer';
import { createPostImages, createPostVideo, deletePost, getAllPostOfRandomUsers, getAllPostsOfAnotherUser, getAllPostsOfLoggedInUser, getAllVideosOfRandomUsers, getPostImages, getPostVideo } from '../controllers/postControllers.js';
import protectedRoutes from '../middlewares/protectedRoutes.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

//post images
router.post('/createImages',protectedRoutes ,upload.array('images', 10) , createPostImages);
//post a video
router.post('/createVideo',protectedRoutes ,upload.single('video') , createPostVideo);
//get images of one post
router.get('/getImages/:postId', getPostImages);
//get video of one post
router.get('/getVideo/:postId', getPostVideo);
//get all loggedInUser posts images and videos both
router.get('/getAllPostsOfLoggedInUser',protectedRoutes , getAllPostsOfLoggedInUser);
//get all posts of another user 
router.get('/getAllPostsOfAnotherUser/:id', getAllPostsOfAnotherUser);
//get all videos of random users
router.get('/getAllVideosOfRandomUsers', getAllVideosOfRandomUsers);
//get all posts of random users
router.get('/getAllPostsOfRandomUsers', getAllPostOfRandomUsers);
//delete a post
router.delete('/deletePost/:postId', protectedRoutes, deletePost);



export default router;

