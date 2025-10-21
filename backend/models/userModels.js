import mongoose from 'mongoose';


const userModels = new mongoose.Schema({

        fullname: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        gmail: { type: String, required: true, unique: true },
        password: { type: String},
        bio: { type: String, default: '' },
        avatar: { type: String, default: '' }, 
        followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
        },
    { timestamps: true}
);


export const User = mongoose.model('User', userModels);