import React from 'react';
import { Button, TextareaAutosize, Divider } from '@mui/material';

function TextEditor(): React.JSX.Element {
    function handleSubmit(e) {
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);

        // You can pass formData as a fetch body directly:
        // modifier le fetch pour notre server + ajouter user
        fetch('/some-api', { method: form.method, body: formData });

        // Or you can work with it as a plain object:
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
    }

    return (
        <form method="post" onSubmit={handleSubmit}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
                New post:
            </label>
            <TextareaAutosize
                name="postContent"
                defaultValue=""
                minRows={4}
                style={{ width: '100%', minWidth: '300px', height: '15px', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <Divider sx={{ margin: '10px 0' }} />
            <Button type="reset" variant="outlined" sx={{ marginRight: '10px' }}>Reset edits</Button>
            <Button type="submit" variant="contained" color="primary">Save post</Button>
        </form>
    );
}

export default TextEditor;
