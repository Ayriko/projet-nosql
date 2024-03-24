import mongoose from '../db/conn';

const CommentSchema = new mongoose.Schema({
    author: String,
    postId : String,
    content : String,
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;