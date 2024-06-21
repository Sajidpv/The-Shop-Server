import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Define the Notification schema
const notificationSchema = new Schema({
    notificationId: {
        type: String,
        required: [true, 'Notification ID is required'],
        unique: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
}, { timestamps: true });

// Create the Notification model
const Notification = model('Notification', notificationSchema);

export default Notification;
