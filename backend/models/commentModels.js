import mongoose from 'mongoose';


const commentModels = new mongoose.Schema({

        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, required: true }
        },
    {timestamps: true}
    
);


export const Comment = mongoose.model('Comment', commentModels);