const prisma = require('../../dbConfig');

exports.createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { userId } = req.user;
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userId,
      },
    });
    res.status(201).json({
      message: 'Post created successfully',
      post: newPost,
    });
  } catch (error) {
    console.log('Error is: ', error);
    res.status(500).json({ error: 'Error creating post' });
  }
};

exports.editPost = async (req, res) => {
  const { postId, title, content } = req.body;
  const { userId } = req.user;
  try {
    const postExist = await prisma.post.findUnique({
      where: {
        id: postId,
        authorId: userId,
      },
    });
    if (!postExist) {
      return res.status(404).json({ error: 'Post does not exist or author unauthorized' });
    }

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title: title ?? postExist.title,
        content: content ?? postExist.content,
      },
    });
    res.status(201).json({
      message: 'Post updated successfully',
      success: true,
      updatedPost,
    });
  } catch (error) {
    console.log('Error is: ', error);
    res.status(500).json({ error: 'Error updating post', success: false });
  }
};

exports.readPost = async (req, res) => {
  const { postId, title, content } = req.body;
  const { userId } = req.user;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        authorId: userId,
      },
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    if (post.authorId !== userId) {
      return res.status(403).json({error: 'You are not authorised to view this post'})
    }

    const postRead = await prisma.read.findUnique({
      where: {
        userId_authorId: {
          userId: userId,
          postId: postId,
        },
      },
    })
    if (postRead) {
      return res.status(404).json({ error:'Post has been read'});
    }
  } catch (error) {
    console.log('Error fetching post: ', error);
    res.status(500).json({ error: 'An error occurred while fetching the post' });
  }
};


exports.deletePost = async (req, res) => {
  const { postId} = req.body;
  const { userId } = req.user;
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId
      },
    });

    if (post.authorId !== userId) {
      return res.status(403).json({error: 'You are not authorized to delete this post'});
    }
    await prisma.post.delete({
      where: {
        id: postId
      },
    })
    res.status(200).json({
      message: 'Post deleted successfully',
      success: true,
    });
  } catch (error) {
    console.log('Error deleting post ', error);
    res.status(500).json({ error: 'Error deleting post' });
  }
};

exports.deleteComment = async (req, res) => {
  const { commentId} = req.body;
  const { userId } = req.user;
  try {
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (comment.authorId !== userId) {
      return res.status(403).json({ error: 'You are not authorized to delete this comment' });
    }

    await prisma.comment.delete({
      where: {id: commentId},
    })

    res.status(200).json({
      message: 'comment deleted successfully',
    });
  } catch (error) {
    console.log('Error deleting comment ', error);
    res.status(500).json({ error: 'Error in server' });
  }
};
