import React,{useState} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
    Avatar,
    Button,
    CssBaseline,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Checkbox,
    Link,
    Grid,
    Box,
    Typography,
    Container,
    Alert
} from '@mui/material'
import {LockOutlined } from '@mui/icons-material'

import { createUserWithEmailAndPassword } from "firebase/auth"

import { setDoc ,doc } from "firebase/firestore";


import { useNavigate } from 'react-router-dom';
import { auth,db } from '../firebaseConfig';


export default function SignUp() {

    const [error,setError] = useState('')
    const [loading,setLoading] = useState(false)
    const [gender,setGender] = useState('male')
    const [acceptTerms,setAcceptTerms] = useState(false)
    // const [nav,setNav] = useState(false)

    // const {signup} = useAuth()
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues : {
            firstName:'',
            lastName:'',
            phone:'', 
            email: '',
            password:'',
            passwordConfirm:'' 
        },
        validationSchema : Yup.object({
            firstName: Yup.string().required('Required'),
            lastName: Yup.string().required('Required'),
            phone: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('No password provided.').min(8, 'Password is too short - should be 8 chars minimum.'),
            passwordConfirm: Yup.string().required('No password provided.').min(8, 'Password is too short - should be 8 chars minimum.')
        }),
        onSubmit : (values, { resetForm,setSubmitting }) => {

            setError('')

            setLoading(true)

            if(values.password !== values.passwordConfirm) {
                window.scrollTo(0,0)
                setLoading(false)
                setSubmitting(false)
                return setError('Passwords do not match')
            }

            createUserWithEmailAndPassword(auth, values.email, values.password)
                .then(user => {
                    // console.log(user.user.uid)
                    const userId =user.user.uid
                
                    setDoc(doc(db, "users",userId), {
                        userId,
                        name:`${values.firstName} ${values.lastName}`,
                        gender:gender,
                        email:values.email,
                        phone:values.phone
                    });
                     
                    setDoc(doc(db, "money",userId), {
                        userId,
                        netMoney:1000,
                        totalSent:0
                    });

                                      
                    // console.log(nav)
                })
                .catch((err) => {
                    if(err.code === 'auth/user-not-found') {
                        setError('User does not exist')
                        return
                    }
                    if(err.code === 'auth/wrong-password') {
                        setError('Wrong Password')
                        return
                    }
                    if(err.code === 'auth/email-already-in-use') {
                        setError('User Exists, Login Instead')
                        return
                    }
                    
                    console.error(err.code)
                    setError(err.code)
                })
                .finally(()=>{
                    // console.log(nav)
                    
                    window.scrollTo(0,0)
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
                    marginTop: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlined />
                </Avatar>
            
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                { error && <Alert severity='error'>{error}</Alert>}
                <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                // autoComplete="given-name"
                                name="firstName"
                                autoFocus
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                {...formik.getFieldProps('firstName')}
                            />
                            {formik.touched.firstName && formik.errors.firstName ? (
                                <Alert severity='error' sx={{color:'red',background:'inherit'}}>{formik.errors.firstName}</Alert>
                            ) : null}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                {...formik.getFieldProps('lastName')}
                            />
                            {formik.touched.lastName && formik.errors.lastName ? (
                                <Alert severity='error' sx={{color:'red',background:'inherit'}}>{formik.errors.lastName}</Alert>
                            ) : null}
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="phone"
                                label="Phone"
                                name="phone"
                                {...formik.getFieldProps('phone')}
                            />
                            {formik.touched.phone && formik.errors.phone ? (
                                <Alert severity='error' sx={{color:'red',background:'inherit'}}>{formik.errors.phone}</Alert>
                            ) : null}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                {...formik.getFieldProps('email')}
                                
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <Alert severity='error' sx={{color:'red',background:'inherit'}}>{formik.errors.email}</Alert>
                            ) : null}
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
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
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                name="passwordConfirm"
                                label="Confirm Password"
                                type="password"
                                id="passwordConfirm"
                                {...formik.getFieldProps('passwordConfirm')}  
                            />
                            {formik.touched.passwordConfirm && formik.errors.passwordConfirm ? (
                                <Alert severity='error' sx={{color:'red',background:'inherit'}}>{formik.errors.passwordConfirm}</Alert>
                            ) : null}

                        </Grid>

                        <Grid item xs={12}>
                            <FormControl sx={{
                                    marginTop:'20px',
                                    marginBottom:'5px',
                                    display:'block'
                                }}
                            >
                                
                                <FormLabel sx={{
                                    '&.Mui-focused':{color:'#666666'},
                                    }} 
                                > 
                                    Gender 
                                </FormLabel>

                                <RadioGroup 
                                    value={gender} 
                                    onChange={(e)=> setGender(e.target.value)}
                                >
                                    <FormControlLabel value='male' control={<Radio color='secondary' />} label='Male' />
                                    <FormControlLabel value='female' control={<Radio color='secondary'/>} label='Female' />
                                    
                                </RadioGroup>
                            </FormControl>

                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                // value={acceptTerms}
                                control={<Checkbox defaultChecked value={acceptTerms} color="primary" onChange={(e) => setAcceptTerms(!acceptTerms)} />}
                                label="Recieve regular updates and promotions."
                            />
                            {acceptTerms && <Alert severity='warning' sx={{color:'#ff5c00',background:'inherit'}}>You won't recieve updates</Alert>}
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        disabled={loading}
                        color='secondary'
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                        <Link href="/login" variant="body2">
                            Already have an account? Sign in
                        </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>   
    );
}