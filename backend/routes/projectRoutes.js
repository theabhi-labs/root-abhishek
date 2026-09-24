import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbStore } from '../config/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// 1. GET ALL PROJECTS (Public)
router.get('/', (req, res) => {
  try {
    const projects = dbStore.get('projects');
    const sorted = [...projects].sort((a, b) => (a.order || 0) - (b.order || 0));
    return res.json({ success: true, count: sorted.length, data: sorted });
  } catch (err) {
    console.error('Error fetching projects:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching projects.' });
  }
});

// 2. CREATE PROJECT (Protected Admin)
router.post('/', requireAuth, (req, res) => {
  try {
    const { title, description, image, live, githubRepo, githubURL, tech, order, fileTree } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Project title and description are required.' });
    }

    const currentProjects = dbStore.get('projects');

    const newProject = {
      id: uuidv4(),
      title: title.trim(),
      description: description.trim(),
      image: image || './smartbin.png',
      live: live || '',
      githubRepo: githubRepo ? githubRepo.trim() : 'theabhi-labs/portfolio',
      githubURL: githubURL ? githubURL.trim() : `https://github.com/${githubRepo || 'theabhi-labs'}`,
      tech: Array.isArray(tech) ? tech : typeof tech === 'string' ? tech.split(',').map(t => t.trim()).filter(Boolean) : ['React', 'Node.js'],
      order: order !== undefined ? Number(order) : currentProjects.length + 1,
      fileTree: fileTree || null,
      createdAt: new Date().toISOString()
    };

    const saved = dbStore.insert('projects', newProject);
    return res.status(201).json({ success: true, message: 'Project added successfully!', data: saved });
  } catch (err) {
    console.error('Error creating project:', err);
    return res.status(500).json({ success: false, message: 'Server error creating project.' });
  }
});

// 3. UPDATE PROJECT (Protected Admin)
router.put('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image, live, githubRepo, githubURL, tech, order, fileTree } = req.body;

    const updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (image !== undefined) updates.image = image;
    if (live !== undefined) updates.live = live.trim();
    if (githubRepo !== undefined) updates.githubRepo = githubRepo.trim();
    if (githubURL !== undefined) updates.githubURL = githubURL.trim();
    if (order !== undefined) updates.order = Number(order);
    if (fileTree !== undefined) updates.fileTree = fileTree;

    if (tech !== undefined) {
      updates.tech = Array.isArray(tech) ? tech : typeof tech === 'string' ? tech.split(',').map(t => t.trim()).filter(Boolean) : [];
    }

    const updated = dbStore.update('projects', id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    return res.json({ success: true, message: 'Project updated successfully!', data: updated });
  } catch (err) {
    console.error('Error updating project:', err);
    return res.status(500).json({ success: false, message: 'Server error updating project.' });
  }
});

// 4. DELETE PROJECT (Protected Admin)
router.delete('/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = dbStore.delete('projects', id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }
    return res.json({ success: true, message: 'Project deleted successfully!' });
  } catch (err) {
    console.error('Error deleting project:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting project.' });
  }
});

export default router;
