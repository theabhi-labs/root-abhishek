import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// 1. GET ALL ACTIVITIES (Public)
router.get('/', (req, res) => {
  try {
    const activities = dbStore.get('activities');
    return res.json({ success: true, count: activities.length, data: activities });
  } catch (err) {
    console.error('Error fetching activities:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching activities.' });
  }
});

// 2. GET SINGLE ACTIVITY BY ID (Public)
router.get('/:id', (req, res) => {
  try {
    const activities = dbStore.get('activities');
    const activity = activities.find(a => a.id === req.params.id);
    if (!activity) {
      return res.status(404).json({ success: false, message: 'Activity not found.' });
    }
    return res.json({ success: true, data: activity });
  } catch (err) {
    console.error('Error fetching activity:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// 3. CREATE ACTIVITY (Protected Admin)
router.post('/', requireAuth, (req, res) => {
  try {
    const { title, tag, author, date, location, images, shortDesc, fullDesc, highlights } = req.body;

    if (!title || !shortDesc) {
      return res.status(400).json({ success: false, message: 'Title and Short Description are required.' });
    }

    const processedAuthors = Array.isArray(author)
      ? author
      : typeof author === 'string'
      ? author.split(',').map(a => a.trim()).filter(Boolean)
      : ['Abhishek Yadav'];

    const processedHighlights = Array.isArray(highlights)
      ? highlights
      : typeof highlights === 'string'
      ? highlights.split(',').map(h => h.trim()).filter(Boolean)
      : [];

    const processedImages = Array.isArray(images) && images.length > 0
      ? images
      : ['/iitimage.png'];

    const newActivity = {
      id: uuidv4(),
      title: title.trim(),
      tag: (tag || 'ACTIVITY').trim().toUpperCase(),
      author: processedAuthors,
      date: date || new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      location: location || 'Online / Global',
      images: processedImages,
      shortDesc: shortDesc.trim(),
      fullDesc: fullDesc || shortDesc,
      highlights: processedHighlights,
      createdAt: new Date().toISOString()
    };

    const saved = dbStore.insert('activities', newActivity);
    return res.status(201).json({ success: true, message: 'Activity created successfully!', data: saved });
  } catch (err) {
    console.error('Error creating activity:', err);
    return res.status(500).json({ success: false, message: 'Server error creating activity.' });
  }
});

// 4. UPDATE ACTIVITY (Protected Admin)
router.put('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { title, tag, author, date, location, images, shortDesc, fullDesc, highlights } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (tag !== undefined) updates.tag = tag.trim().toUpperCase();
    if (date !== undefined) updates.date = date;
    if (location !== undefined) updates.location = location;
    if (shortDesc !== undefined) updates.shortDesc = shortDesc.trim();
    if (fullDesc !== undefined) updates.fullDesc = fullDesc;

    if (author !== undefined) {
      updates.author = Array.isArray(author)
        ? author
        : typeof author === 'string'
        ? author.split(',').map(a => a.trim()).filter(Boolean)
        : [];
    }

    if (highlights !== undefined) {
      updates.highlights = Array.isArray(highlights)
        ? highlights
        : typeof highlights === 'string'
        ? highlights.split(',').map(h => h.trim()).filter(Boolean)
        : [];
    }

    if (images !== undefined) {
      updates.images = Array.isArray(images) ? images : [images];
    }

    const updated = dbStore.update('activities', id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Activity not found.' });
    }

    return res.json({ success: true, message: 'Activity updated successfully!', data: updated });
  } catch (err) {
    console.error('Error updating activity:', err);
    return res.status(500).json({ success: false, message: 'Server error updating activity.' });
  }
});

// 5. DELETE ACTIVITY (Protected Admin)
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = dbStore.delete('activities', id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Activity not found.' });
    }
    return res.json({ success: true, message: 'Activity deleted successfully!' });
  } catch (err) {
    console.error('Error deleting activity:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting activity.' });
  }
});

export default router;
