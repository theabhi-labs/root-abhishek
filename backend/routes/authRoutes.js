import express from 'express';
import bcrypt from 'bcryptjs';
import { dbStore } from '../config/db.js';
import { generateToken, requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const admin = dbStore.getAdmin();
    if (admin.username !== username) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const isEnvMatch = password === (process.env.ADMIN_PASSWORD || 'admin123');
    let isBcryptMatch = false;
    try {
      if (admin.passwordHash) {
        isBcryptMatch = await bcrypt.compare(password, admin.passwordHash);
      }
    } catch (e) {
      isBcryptMatch = false;
    }

    if (!isEnvMatch && !isBcryptMatch) {
      return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
    }

    const token = generateToken({ username: admin.username, email: admin.email, name: admin.name });

    return res.json({
      success: true,
      message: 'Authentication successful!',
      token,
      user: {
        username: admin.username,
        email: admin.email,
        name: admin.name
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
});

// Verify Current Token
router.get('/verify', requireAuth, (req, res) => {
  const admin = dbStore.getAdmin();
  return res.json({
    success: true,
    user: {
      username: admin.username,
      email: admin.email,
      name: admin.name
    }
  });
});

// Update Password or Admin Profile
router.put('/update-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword, newUsername, newEmail, newName } = req.body;
    const admin = dbStore.getAdmin();

    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password does not match.' });
      }
    }

    const updates = {};
    if (newPassword) {
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
      }
      updates.passwordHash = await bcrypt.hash(newPassword, 10);
    }
    if (newUsername) updates.username = newUsername.trim();
    if (newEmail) updates.email = newEmail.trim();
    if (newName) updates.name = newName.trim();

    const updated = dbStore.updateAdmin(updates);

    return res.json({
      success: true,
      message: 'Admin profile updated successfully!',
      user: {
        username: updated.username,
        email: updated.email,
        name: updated.name
      }
    });
  } catch (err) {
    console.error('Update password error:', err);
    return res.status(500).json({ success: false, message: 'Failed to update credentials.' });
  }
});

export default router;
