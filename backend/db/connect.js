import mongoose from 'mongoose';

const connectDB = async () => {
    try {
         await mongoose.connect(process.env.MONGODB_URI).then(() => {
            console.log('MongoDB connected successfully');
        });
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
}

export default connectDB;