import mongoose from '../db/conn';

const PostSchema = new mongoose.Schema({
    authorId: String,
    date : String,
    content : String,
    likes : Number,
    comments: [String]
});

const Post = mongoose.model('Post', PostSchema);

export default Post;
