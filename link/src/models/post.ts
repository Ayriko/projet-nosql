interface PostType {
    _id: string;
    authorId : string;
    date : string;
    content: string;
    likes: number;
    comments: string[];
}


export default PostType;
