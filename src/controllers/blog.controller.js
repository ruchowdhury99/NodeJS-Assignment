import Blog from '../models/blog.model.js';

/**
 * POST /blogs
 * Body: { title, description, createdBy }
 */
export async function createBlog(req, res, next) {
  try {
    const { title, description, createdBy } = req.body;
    if (!title || !description || !createdBy) {
      return res.status(400).json({ status: 400, message: 'Missing required fields' });
    }
    const blog = await Blog.create({ title, description, createdBy });
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

/**
 * GET /blogs/all?pageNumber=1&offset=10
 */
export async function listBlogs(req, res, next) {
  try {
    let { pageNumber = 1, offset = 10 } = req.query;
    pageNumber = parseInt(pageNumber);
    offset     = parseInt(offset);

    const total = await Blog.countDocuments();
    const blogs = await Blog.find()
      .sort({ createdDate: -1 })
      .skip((pageNumber - 1) * offset)
      .limit(offset)
      .lean();

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

/**
 * GET /blog/:id
 */
export async function getBlog(req, res, next) {
  try {
    const blog = await Blog.findById(req.params.id).lean();
    if (!blog) {
      return res.status(404).json({ status: 404, message: 'Blog not found' });
    }
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