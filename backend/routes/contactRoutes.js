import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';
import { processContactEmails } from '../utils/emailService.js';

const router = express.Router();

// 1. PUBLIC CONTACT FORM SUBMISSION
router.post('/', async (req, res) => {
  try {
    const { name, email, message, isDeveloper, devData } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Please provide your name, email, and message.' });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const newMessage = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
      isDeveloper: Boolean(isDeveloper),
      devData: isDeveloper && devData ? {
        linkedin: devData.linkedin || '',
        github: devData.github || '',
        discord: devData.discord || ''
      } : null,
      read: false,
      ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown',
      createdAt: new Date().toISOString()
    };

    // Save message to store
    const saved = dbStore.insert('contactMessages', newMessage);

    // Trigger async email sending in background (Admin alert + Auto-reply welcome template)
    let emailStatus = { adminSent: false, welcomeSent: false, simulated: true };
    try {
      emailStatus = await processContactEmails({
        name: newMessage.name,
        email: newMessage.email,
        message: newMessage.message,
        isDeveloper: newMessage.isDeveloper,
        devData: newMessage.devData
      });
    } catch (emailErr) {
      console.error('Email sending error:', emailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: isDeveloper
        ? 'Digital coordinates received! A welcome message has been dispatched to your email.'
        : 'Thank you for your message! An acknowledgment email has been sent to your inbox.',
      data: {
        id: saved.id,
        name: saved.name,
        email: saved.email,
        emailStatus
      }
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    return res.status(500).json({ success: false, message: 'Server error processing your message. Please try again.' });
  }
});

// 2. GET ALL CONTACT MESSAGES (Protected Admin)
router.get('/messages', requireAuth, (req, res) => {
  try {
    const messages = dbStore.get('contactMessages');
    const unreadCount = messages.filter(m => !m.read).length;
    const clientCount = messages.filter(m => !m.isDeveloper).length;
    const devCount = messages.filter(m => m.isDeveloper).length;

    return res.json({
      success: true,
      total: messages.length,
      unreadCount,
      clientCount,
      devCount,
      data: messages
    });
  } catch (err) {
    console.error('Error fetching contact messages:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching messages.' });
  }
});

// 3. TOGGLE MESSAGE READ STATUS (Protected Admin)
router.patch('/messages/:id/read', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;
    const updated = dbStore.update('contactMessages', id, { read: read !== undefined ? Boolean(read) : true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    return res.json({ success: true, message: 'Message status updated.', data: updated });
  } catch (err) {
    console.error('Error updating message status:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// 4. DELETE CONTACT MESSAGE (Protected Admin)
router.delete('/messages/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = dbStore.delete('contactMessages', id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Message not found.' });
    }
    return res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (err) {
    console.error('Error deleting message:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

export default router;
