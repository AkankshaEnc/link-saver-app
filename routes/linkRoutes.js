const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Link = require('../models/Link');

// @desc    Save a new link
// @route   POST /api/links
// @access  Private
router.post('/', auth, async (req, res) => {
  const { url, title } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    const newLink = new Link({
      user: req.user.id,
      url,
      title: title || ''
    });

    const savedLink = await newLink.save();
    res.json(savedLink);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all links for logged-in user
// @route   GET /api/links
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const links = await Link.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(links);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a link by ID
// @route   DELETE /api/links/:id
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);

    if (!link) {
      return res.status(404).json({ message: 'Link not found' });
    }

    if (link.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await link.deleteOne();
    res.json({ message: 'Link removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
