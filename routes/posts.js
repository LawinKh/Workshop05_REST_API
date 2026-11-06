const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');

const router = express.Router();

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// CREATE: Create a new post
router.post('/', async (req, res, next) => {
  try {
    const { title, content, author } = req.body || {};
    const post = new Post({ title, content, author });
    await post.save();
    return res.status(201).json(post);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

// READ: Get all posts
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find();
    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
});

// READ: Get one post
router.get('/:id', async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
});

// UPDATE: Update all editable fields
router.put('/:id', async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const { title, content, author } = req.body || {};
    post.title = title;
    post.content = content;
    post.author = author;
    await post.save();
    return res.status(200).json(post);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    next(error);
  }
});

// DELETE: Delete a post
router.delete('/:id', async (req, res, next) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid post id' });
  }
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;