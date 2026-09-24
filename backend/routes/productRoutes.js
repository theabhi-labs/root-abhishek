import express from 'express';
import { dbStore } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// 1. GET ALL PRODUCTS (Public)
router.get('/', (req, res) => {
  try {
    const products = dbStore.get('products');
    return res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching products.' });
  }
});

// 2. UPDATE PRODUCT (Protected Admin)
router.put('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { title, tagline, description, liveUrl, status, badge, highlights, techStack } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (tagline !== undefined) updates.tagline = tagline.trim();
    if (description !== undefined) updates.description = description.trim();
    if (liveUrl !== undefined) updates.liveUrl = liveUrl.trim();
    if (status !== undefined) updates.status = status.trim();
    if (badge !== undefined) updates.badge = badge.trim();
    if (highlights !== undefined) updates.highlights = Array.isArray(highlights) ? highlights : [highlights];
    if (techStack !== undefined) updates.techStack = Array.isArray(techStack) ? techStack : [techStack];

    const updated = dbStore.update('products', id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.json({ success: true, message: 'Product updated successfully!', data: updated });
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

export default router;
