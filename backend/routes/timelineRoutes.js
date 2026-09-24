import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// 1. GET ALL TIMELINE MILESTONES (Public)
router.get('/', (req, res) => {
  try {
    const timeline = dbStore.get('timeline');
    const sorted = [...timeline].sort((a, b) => (a.order || 0) - (b.order || 0));
    return res.json({ success: true, count: sorted.length, data: sorted });
  } catch (err) {
    console.error('Error fetching timeline:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching timeline.' });
  }
});

// 2. CREATE TIMELINE MILESTONE (Protected Admin)
router.post('/', requireAuth, (req, res) => {
  try {
    const { year, title, description, icon, side, order } = req.body;

    if (!year || !title || !description) {
      return res.status(400).json({ success: false, message: 'Year, Title, and Description are required.' });
    }

    const currentTimeline = dbStore.get('timeline');

    const newMilestone = {
      id: uuidv4(),
      year: year.trim(),
      title: title.trim(),
      description: description.trim(),
      icon: icon || 'code',
      side: side === 'right' ? 'right' : 'left',
      order: order !== undefined ? Number(order) : currentTimeline.length + 1,
      createdAt: new Date().toISOString()
    };

    const saved = dbStore.insert('timeline', newMilestone);
    return res.status(201).json({ success: true, message: 'Milestone added successfully!', data: saved });
  } catch (err) {
    console.error('Error adding timeline milestone:', err);
    return res.status(500).json({ success: false, message: 'Server error adding milestone.' });
  }
});

// 3. UPDATE TIMELINE MILESTONE (Protected Admin)
router.put('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { year, title, description, icon, side, order } = req.body;

    const updates = {};
    if (year !== undefined) updates.year = year.trim();
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (icon !== undefined) updates.icon = icon;
    if (side !== undefined) updates.side = side;
    if (order !== undefined) updates.order = Number(order);

    const updated = dbStore.update('timeline', id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Milestone not found.' });
    }

    return res.json({ success: true, message: 'Milestone updated successfully!', data: updated });
  } catch (err) {
    console.error('Error updating milestone:', err);
    return res.status(500).json({ success: false, message: 'Server error updating milestone.' });
  }
});

// 4. DELETE TIMELINE MILESTONE (Protected Admin)
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = dbStore.delete('timeline', id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Milestone not found.' });
    }
    return res.json({ success: true, message: 'Milestone deleted successfully!' });
  } catch (err) {
    console.error('Error deleting milestone:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting milestone.' });
  }
});

export default router;
