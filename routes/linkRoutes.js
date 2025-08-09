const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Link = require('../models/Link');
const fetch = require('node-fetch');

// Helper to fetch title and favicon from URL
async function fetchMetadata(url) {
  try {
    const res = await fetch(url);
    const html = await res.text();

    // Extract title
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : '';

    // Basic favicon detection (assumes favicon at root)
    const favicon = url.endsWith('/') ? url + 'favicon.ico' : url + '/favicon.ico';

    return { title, favicon };
  } catch (error) {
    return { title: '', favicon: '' };
  }
}

// POST /api/links - Save a new link with metadata, summary, tags
router.post('/', auth, async (req, res) => {
  const { url, title, tags } = req.body;

  if (!url) {
    return res.status(400).json({ message: 'URL is required' });
  }

  try {
    // Fetch metadata
    const { title: fetchedTitle, favicon } = await fetchMetadata(url);

    // Fetch summary from Jina AI
    const encodedUrl = encodeURIComponent(url);
    const summaryRes = await fetch(`https://r.jina.ai/http://${encodedUrl}`);
    const summary = await summaryRes.text();

    const newLink = new Link({
      user: req.user.id,
      url,
      title: title || fetchedTitle,
      favicon,
      summary,
      tags: Array.isArray(tags) ? tags : [],
    });

    const savedLink = await newLink.save();
    res.json(savedLink);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/links - Get all links for logged-in user, optionally filter by tag
router.get('/', auth, async (req, res) => {
  try {
    const filter = { user: req.user.id };
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }

    const links = await Link.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(links);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/links/:id - Delete a link
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

// PUT /api/links/reorder - Update order of links
router.put('/reorder', auth, async (req, res) => {
  try {
    const { orderedIds } = req.body; // expected: array of link IDs in new order

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ message: 'Invalid data' });
    }

    for (let i = 0; i < orderedIds.length; i++) {
      await Link.findByIdAndUpdate(orderedIds[i], { order: i });
    }

    res.json({ message: 'Order updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
