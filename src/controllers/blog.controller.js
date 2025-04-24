
//-------------------------------------BLOGS CONTROLLERS-------------------------------------//

// 1. Create a new blog
// 2. Get all blogs
// 3. Get a single blog by ID

import Blog from '../models/blog.model.js';


// 1. Creating a new blog

// POST - {baseurl}/blogs

export async function createBlog(req, res, next) {
  try {

    // Fetching the blog content and user from the request

    const { title, description, createdBy } = req.body;
    if (!title || !description || !createdBy) {
      return res.status(400).json({ status: 400, message: 'Missing required fields' });
    }

    // Creating a new blog document and saving it in the database

    const blog = await Blog.create({ 
      title, 
      description, 
      createdBy
     });

     // Returning the created blog with its ID and other relevant details

    return res.status(201).json({
      status: 201,
      message: 'Blog created successfully',
      data: {
        id: blog._id.toString(),
        title: blog.title,
        description: blog.description,
        createdBy: blog.createdBy,
        createdDate: blog.createdDate
      }
    });
  } catch (err) {
    next(err);
  }
}


// 2. Getting all blogs with pagination

// GET - {baseurl}/blogs/all?pageNumber=1&offset=10

export async function listBlogs(req, res, next) {
  try {

    // Fetching the page number and offset from the request query parameters

    let { pageNumber = 1, offset = 10 } = req.query;
    pageNumber = parseInt(pageNumber);
    offset     = parseInt(offset);


    // Fetching the total number of blogs and the paginated blogs from the database

    const total = await Blog.countDocuments();
    const blogs = await Blog.find()
      .sort({ createdDate: -1 })
      .skip((pageNumber - 1) * offset)
      .limit(offset)
      .lean();

      // Mapping the paginated blogs to include the year of creation
      // and sending the response with the total, page number, offset, and paginated blogs
      // as well as the total number of blogs

    const data = blogs.map(b => ({
      id:          b._id.toString(),
      title:       b.title,
      description: b.description,
      createdBy:   b.createdBy,
      createdDate: b.createdDate.toISOString().replace('T',' ').slice(0,19),
      year:        b.createdDate.getFullYear()
    }));

    return res.json({
      status: 200,
      data: {
        total,
        pageNumber,
        offset,
        blogs: data
      }
    });
  } catch (err) {
    next(err);
  }
}


// 3. Getting a single blog by ID

// GET - {baseurl}/blogs/:id

export async function getBlog(req, res, next) {
  try {

    // Fetching the blog by its ID from the database

    const blog = await Blog.findById(req.params.id).lean();
    if (!blog) {
      return res.status(404).json({ status: 404, message: 'Blog not found' });
    }

    // Returning the blog with its ID and other relevant details if found
    return res.json({
      status: 200,
      data: {
        id:          blog._id.toString(),
        title:       blog.title,
        description: blog.description,
        createdBy:   blog.createdBy,
        createdDate: blog.createdDate.toISOString().replace('T',' ').slice(0,19)
      }
    });
  } catch (err) {
    next(err);
  }
}