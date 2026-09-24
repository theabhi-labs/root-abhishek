import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// 1. GET ALL ARTICLES (Public)
router.get('/', (req, res) => {
  try {
    const articles = dbStore.get('articles');
    return res.json({ success: true, count: articles.length, data: articles });
  } catch (err) {
    console.error('Error fetching articles:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching articles.' });
  }
});

// 2. GET SINGLE ARTICLE (Public)
router.get('/:id', (req, res) => {
  try {
    const articles = dbStore.get('articles');
    const article = articles.find(a => a.id === req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }
    return res.json({ success: true, data: article });
  } catch (err) {
    console.error('Error fetching article:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// 3. CREATE ARTICLE (Protected Admin)
router.post('/', requireAuth, (req, res) => {
  try {
    const { topic, subtopic, title, summary, content, tags } = req.body;

    if (!topic || !subtopic || !title || !content) {
      return res.status(400).json({ success: false, message: 'Topic, Subtopic, Title, and Content are required.' });
    }

    const processedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const newArticle = {
      id: uuidv4(),
      topic: topic.trim().toLowerCase(),
      subtopic: subtopic.trim().toLowerCase(),
      title: title.trim(),
      summary: summary ? summary.trim() : title.trim(),
      content: content,
      tags: processedTags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = dbStore.insert('articles', newArticle);
    return res.status(201).json({ success: true, message: 'Article published successfully!', data: saved });
  } catch (err) {
    console.error('Error creating article:', err);
    return res.status(500).json({ success: false, message: 'Server error creating article.' });
  }
});

// 4. UPDATE ARTICLE (Protected Admin)
router.put('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { topic, subtopic, title, summary, content, tags } = req.body;

    const updates = {};
    if (topic !== undefined) updates.topic = topic.trim().toLowerCase();
    if (subtopic !== undefined) updates.subtopic = subtopic.trim().toLowerCase();
    if (title !== undefined) updates.title = title.trim();
    if (summary !== undefined) updates.summary = summary.trim();
    if (content !== undefined) updates.content = content;
    if (tags !== undefined) {
      updates.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map(t => t.trim()).filter(Boolean)
        : [];
    }

    const updated = dbStore.update('articles', id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    return res.json({ success: true, message: 'Article updated successfully!', data: updated });
  } catch (err) {
    console.error('Error updating article:', err);
    return res.status(500).json({ success: false, message: 'Server error updating article.' });
  }
});

// 5. DELETE ARTICLE (Protected Admin)
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = dbStore.delete('articles', id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }
    return res.json({ success: true, message: 'Article deleted successfully!' });
  } catch (err) {
    console.error('Error deleting article:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting article.' });
  }
});

export default router;
