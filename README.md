# Link Saver + Auto-Summary

A full-stack application that allows users to save bookmarks with automatic page summaries using a free summarization API.

---

## Tech Stack

- **Frontend:** React, Tailwind CSS  
- **Backend:** Node.js, Express, MongoDB Atlas, bcrypt, JWT  
- **APIs:** Jina AI summarization API (public free endpoint)  

---

## Features

- User signup and login with secure authentication (bcrypt + JWT)  
- Save bookmarks by pasting URLs  
- Automatic fetching of page title and favicon  
- Generate and save page summary using Jina AI API  
- View list/grid of saved bookmarks with summaries  
- Tag bookmarks and filter by tags  
- Delete bookmarks  
- Drag-and-drop reorder bookmarks  
- Responsive design, styled with Tailwind CSS  

---

## Backend

The backend is built with Node.js and Express, connected to MongoDB Atlas for data persistence. It includes:

- Secure user authentication using bcrypt for password hashing and JWT for token-based sessions  
- RESTful API routes to create, read, update, delete, and reorder bookmarks  
- Automatic metadata fetching (title and favicon) for saved URLs  
- Integration with the Jina AI public summarization API to generate link summaries  
- Tagging functionality with filtering support  
- Protected routes with JWT middleware to secure user data  

---

## Frontend

The frontend is developed using React and styled with Tailwind CSS. Key aspects include:

- User-friendly forms for signup and login with client-side validation  
- Dashboard to add new bookmarks by pasting URLs and optionally tagging them  
- Display of saved bookmarks in a responsive grid or list view, showing title, favicon, and summary  
- Ability to delete bookmarks or reorder them using drag-and-drop  
- Filtering bookmarks by tags to quickly find saved content  
- State management for authentication and bookmark data  
- Responsive and accessible design optimized for desktop and mobile  

---
