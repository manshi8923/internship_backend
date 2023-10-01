const express = require('express');
const axios = require('axios');
const _ = require('lodash');

const app = express();
const port = 9089;

// Middleware for fetching and analyzing blog data
app.get('/',(req,res)=>{
    res.send("api is working!");
})
app.get('/api/blog-stats', async (req, res) => {
  try {
    // Fetch data from the third-party API
    const response = await axios.get('https://intent-kit-16.hasura.app/api/rest/blogs', {
      headers: {
        'x-hasura-admin-secret': '32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6',
      },
    });
    
    const blogs = response.data;

    // Calculate the total number of blogs fetched
    const totalBlogs = blogs.length;

    // Find the blog with the longest title
    const longestBlog = _.maxBy(blogs, 'title.length').title;

    // Determine the number of blogs with titles containing the word "privacy"
    const privacyBlogs = blogs.filter(blog => blog.title.toLowerCase().includes('privacy')).length;

    // Create an array of unique blog titles (no duplicates)
    const uniqueTitles = _.uniqBy(blogs, 'title').map(blog => blog.title);

    // Respond with the statistics
    res.json({
      totalBlogs,
      longestBlog,
      privacyBlogs,
      uniqueTitles,
    });
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Blog search endpoint
app.get('/api/blog-search', (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter "query" is required' });
  }

  try {
    // Filter blogs based on the provided query string (case-insensitive)
    const filteredBlogs = blogs.filter(blog => blog.title.toLowerCase().includes(query.toLowerCase()));

    // Respond with the filtered blogs
    res.json(filteredBlogs);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});