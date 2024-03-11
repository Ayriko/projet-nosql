import React from 'react';
import Navbar from "../components/Navbar.tsx";
import {Stack} from "@mui/material";
import Post from '../components/Post.tsx';
import TextEditor from '../components/TextEditor.tsx';

function Homepage(): React.JSX.Element {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const fetchedUsers = await getUsers();
                setUsers(fetchedUsers);
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs :", error);
            }
        };
        fetchUsers();
    }, []);


    return (
        <>
            <Navbar/>
            <Stack
                direction="column"
                justifyContent="flex-start"
                alignItems="center"
                spacing={3}
                sx={{ marginTop: '2rem' }}
            >
                <TextEditor />
                <Post />
                <Post />
                <Post />
            </Stack>
        </>
    );
}

export default Homepage;