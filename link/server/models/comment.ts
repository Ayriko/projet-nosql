import mongoose from '../db/conn';
import User from './user';

const CommentSchema = new mongoose.Schema({
    user: User,
    date : String,
    content : String,
});

const Comment = mongoose.model('Post', CommentSchema);

export default Comment;