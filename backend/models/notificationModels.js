import mongoose from 'mongoose';


const notificationModels = new mongoose.Schema({
    
        receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
        sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        type: { type: String, enum: ['like','dislike', 'comment', 'follow'], required: true },
        read: { type: Boolean, default: false }
},
{ timestamps: true }
);


export const Notification = mongoose.model('Notification', notificationModels);