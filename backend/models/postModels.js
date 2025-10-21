import mongoose from 'mongoose';


const postModels = new mongoose.Schema({
    
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        caption: { type: String, default: '' },
        media: [{ 
                 url: { type: String}, 
                 type: { type: String, enum: ['image', 'video'], default: 'image' }
                 }],
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
        },
   {timestamps: true}
);

export const Post = mongoose.model('Post', postModels);