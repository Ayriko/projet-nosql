import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Link as RLink, useNavigate} from "react-router-dom";
import {useEffect} from "react";

// Define custom theme
const theme = createTheme({
    palette: {
        primary: {
            main: '#ffffff', // white color
        },
        background: {
            default: '#000000', // black color
        },
        text: {
            primary: '#ffffff', // white color
        },
    },
});

const linkStyle = {
    textDecoration: "none",
    color: 'white'
};

export default function SignUp() {
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('Authentification'))
            navigate('/')
    }, [navigate]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        const formData = new FormData(event.currentTarget);
        const data = JSON.stringify({
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        })
        const res = fetch('http://localhost:3000/createUser', {
            method: 'post',
            headers: {'Content-Type':'application/json;charset=utf-8'},
            body: data
        });
        res.then( async (response: Response) => {
            const token = await response.json()
            console.log(token.token)
            localStorage.setItem('Authentification', token.token)
        })
        navigate('/')
        event.preventDefault();
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs"
                       sx={{
                           boxShadow: '0px 0px 0px 2px white',
                           borderRadius: '10px',
                           padding: '30px',
                           marginTop: '10%'
                       }}
            >
                <CssBaseline />
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        color: 'text.primary',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="userName"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    autoFocus
                                    InputProps={{
                                        style: {
                                            color: 'white',
                                            borderColor: 'white',
                                        },
                                        sx: {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'white !important',
                                            },
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    InputProps={{
                                        style: {
                                            color: 'white',
                                            borderColor: 'white',
                                        },
                                        sx: {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'white !important',
                                            },
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    InputProps={{
                                        style: {
                                            color: 'white',
                                            borderColor: 'white',
                                        },
                                        sx: {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: 'white !important',
                                            },
                                        },
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <RLink to={"/login"}>
                                        Already have an account? Sign in
                                </RLink>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
