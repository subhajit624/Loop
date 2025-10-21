import mongoose from 'mongoose';

const messageModels = new mongoose.Schema({
    
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String},
        media: { 
                 url: { type: String}, 
                 type: { type: String, enum: ['image', 'video'], default: 'image' }
                 },
    },
    {timestamps: true}
);

export const Message = mongoose.model('Message', messageModels);