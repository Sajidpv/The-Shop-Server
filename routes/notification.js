import express from 'express';
import asyncHandler from 'express-async-handler';
import Notification from '../model/notification.js';
import { Client } from 'onesignal-node';
import dotenv from 'dotenv';

const router = express.Router();
dotenv.config();

const client = new Client({
  app: { appId: process.env.ONE_SIGNAL_APP_ID },
  userAuthKey: process.env.ONE_SIGNAL_REST_API_KEY
});

router.post('/send-notification', asyncHandler(async (req, res) => {
    const { title, description, imageUrl } = req.body;

    const notificationBody = {
        contents: { 'en': description },
        headings: { 'en': title },
        included_segments: ['All'],
        ...(imageUrl && { big_picture: imageUrl })
    };

    const response = await client.createNotification(notificationBody);
    const notificationId = response.body.id;
    console.log('Notification sent to all users:', notificationId);
    const notification = new Notification({ notificationId, title, description, imageUrl });
    const newNotification = await notification.save();
    res.json({ success: true, message: 'Notification sent successfully', data: null });
}));

router.get('/track-notification/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;

    const response = await client.viewNotification(id);
    const androidStats = response.body.platform_delivery_stats;

    const result = {
        platform: 'Android',
        success_delivery: androidStats.android.successful,
        failed_delivery: androidStats.android.failed,
        errored_delivery: androidStats.android.errored,
        opened_notification: androidStats.android.converted
    };
    console.log('Notification details:', androidStats);
    res.json({ success: true, message: 'success', data: result });
}));

router.get('/all-notification', asyncHandler(async (req, res) => {
    try {
        const notifications = await Notification.find({}).sort({ _id: -1 });
        res.json({ success: true, message: "Notifications retrieved successfully.", data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

router.delete('/delete-notification/:id', asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const notification = await Notification.findByIdAndDelete(id);
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found." });
        }
        res.json({ success: true, message: "Notification deleted successfully.", data: null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

export default router;
