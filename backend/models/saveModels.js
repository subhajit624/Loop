import mongoose from 'mongoose';

const saveModels = new mongoose.Schema({

    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }
},
{timestamps: true}
);

export const Save = mongoose.model('Save', saveModels);