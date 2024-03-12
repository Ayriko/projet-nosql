interface PostType {
    _id: string;
    author : string;
    date : string;
    content: string;
    likes: number;
    comments: string[];
}


export default PostType;