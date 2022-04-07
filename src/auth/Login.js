import React,{useState} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {useNavigate} from 'react-router-dom';
import { signInWithEmailAndPassword } from "firebase/auth";


import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    FormControlLabel,
    Checkbox,
    Link,
    Grid,
    Box,
    Typography,
    Container,
    Alert
} from '@mui/material'

import {LockOutlined } from '@mui/icons-material'
import { auth } from '../firebaseConfig';



export default function Login() {

    const [error,setError] = useState()
    const [loading,setLoading] = useState(false)
   
    const navigate = useNavigate();
    
    

    const formik = useFormik({
        initialValues : { 
            email: '',
            password:'' 
        },
        validationSchema : Yup.object({
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('No password provided.').min(8, 'Password is too short - should be 8 chars minimum.')
        }),
        onSubmit : (values, { resetForm,setSubmitting }) => {

            setError('')
            setLoading(true)


            signInWithEmailAndPassword(auth, values.email, values.password)
                .then(user => {
                    // console.log(user.user.displayName)
                    // navigate('/')
                })
                .catch((err) => {
                    if(err.code === 'auth/user-not-found') {
                        setError('User does not exist')
                    }
                    if(err.code === 'auth/wrong-password') {
                        setError('Wrong Password')
                    }
                    console.error(err.code)
                })
                .finally(()=>{
                    setTimeout(()=>{
                        setLoading(false)
                        setSubmitting(false)
                        resetForm()
                        navigate('/')
                    },2000)
            })
        }
    })

    return (
        
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlined />
            </Avatar>
            <Typography component="h1" variant="h5">
                Sign in
            </Typography>
            { error && <Alert severity='error' sx={{color:'red',background:'inherit'}}>{error}</Alert>}
            
            <Box component="form" noValidate sx={{ mt: 1 }}  onSubmit={formik.handleSubmit} >
                <TextField
                    margin="normal"
                    // required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    // autoFocus
                    {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email ? (
                    <Alert severity='error' sx={{color:'red',background:'inherit'}}>{formik.errors.email}</Alert>
                ) : null}

                <TextField
                    margin="normal"
                    // required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    {...formik.getFieldProps('password')}
                />
                {formik.touched.password && formik.errors.password ? (
                    <Alert severity='error' sx={{color:'red',background:'inherit'}}>{formik.errors.password}</Alert>
                ) : null}
                
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    color='secondary'
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Sign In
                </Button>
                <Grid container>
                    <Grid item xs>
                        <Link href="/forgot" variant="body2" >
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <Link href="/signup" variant="body2">
                            {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                </Grid>
            </Box>

            
            </Box>
        </Container>

    );
}