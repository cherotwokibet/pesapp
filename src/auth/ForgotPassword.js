
import React, {useState} from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { sendPasswordResetEmail } from "firebase/auth";


import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Link,
    Grid,
    Box,
    Typography,
    Container,
    Alert
} from '@mui/material'

import {LockOutlined } from '@mui/icons-material'
import { auth } from '../firebaseConfig';




export default function ForgotPassword() {
    
    const [error,setError] = useState()
    const [loading,setLoading] = useState(false)
    const [message,setMessage] = useState()
  

    
    const formik = useFormik({
        initialValues : { 
            email: ''
        },
        validationSchema : Yup.object({
            email: Yup.string().email('Invalid email address').required('Required')
        }),
        onSubmit : (values, { resetForm,setSubmitting }) => {

            setMessage('')
            setError('')
            setLoading(true)

            sendPasswordResetEmail(auth, values.email)
                .then(() => {
                    setMessage('Check your inbox for further instructions')
                })
                .catch((err) => {
                    if(err.code === 'auth/user-not-found') {
                        setError('User does not exist')
                    }
                    if(err.code === 'auth/wrong-password') {
                        setError('Wrong Password')
                    }
                    setError('Failed to reset password')
                    console.error(err.code)
                })
                .finally(()=>{
                    setLoading(false)
                    setTimeout(()=>{
                        setSubmitting(false)
                        resetForm()
                    },1000)
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
                Password Reset
            </Typography>
            { error && <Alert severity='error' sx={{color:'red',background:'inherit'}}>{error}</Alert>}
            { message && <Alert severity='success' sx={{color:'green',background:'inherit'}}>{message}</Alert>}
            
            <Box component="form" noValidate sx={{ mt: 1 }}  onSubmit={formik.handleSubmit} >

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoFocus
                    {...formik.getFieldProps('email')}
                />
                {formik.touched.email && formik.errors.email ? (
                    <Alert severity='error' sx={{color:'red',background:'inherit'}}>{formik.errors.email}</Alert>
                ) : null}

                <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    color='secondary'
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Reset Password
                </Button>
                <Grid container justifyContent='center' alignItems='center'  >
                    <Grid item >
                        <Link href="/login" variant="body2" sx={{fontSize:20}} >
                            Login
                        </Link>
                    </Grid>
                
                </Grid>
            </Box>

            
            </Box>
        </Container>
        
    )
}
