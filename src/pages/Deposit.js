import React, { useState,useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {v4 as uuidv4} from 'uuid'

import {
    Typography,
    Avatar,
    CssBaseline,
    Button,
    Grid,
    Radio,
    Container,
    TextField,
    RadioGroup,
    FormControlLabel,
    FormLabel,
    FormControl,
    Alert,
} from '@mui/material';

import {
    KeyboardDoubleArrowRight,
    MonetizationOnOutlined
} from '@mui/icons-material';
import {format} from 'date-fns'

import { collection, addDoc , doc, updateDoc,increment } from "firebase/firestore"; 
import {db} from '../firebaseConfig';
import { UserContext } from '../contexts/UserContext'

export default function Deposit() {
    const {currentUser} = useContext(UserContext)
    const navigate = useNavigate()
    const [error,setError] = useState()
    const [loading,setLoading] = useState(false)
    const [mpesa,setMpesa] = useState('Mpesa')
 
    const formik = useFormik({
        initialValues : { 
            amount:5
        },
        validationSchema : Yup.object({
            amount: Yup.number().positive().nullable(false).min(5,'Minimum amount you can deposit is 5').required('Required'),
        }),
        onSubmit : (values, { resetForm,setSubmitting }) => {
            
            setError('')
            setLoading(true)

            const toUpdate = {...values, name:mpesa,type:'deposit'}

            addDoc(collection(db,"transactions"),{
                ...toUpdate,
                actorId: currentUser.uid,
                id: uuidv4(),
                currency: 'USD',
                created_At: format(new Date(),'do MMM yyyy, HH:mm'),
                updated_At: format(new Date(),'do MMM yyyy, HH:mm')
            })
            .then( async ()=>{
                const moneyRef = doc(db, "money", currentUser.uid);
                // update money collection
                await updateDoc(moneyRef, {
                    netMoney:increment(values.amount)
                })
                // console.log("Doc written ")
                // deposit(values.amount)
            })
            .catch((e)=>{
                setError('Failed To Deposit')
                console.error("Error adding doc",e)
            })
            .finally(()=>{
                setTimeout(()=>{
                    setLoading(false)
                    setSubmitting(false)
                    resetForm()
                    navigate('/transactions')
                },2000)
            })

        }
    })

    

    return (
        
        <Container component='main' >
            <CssBaseline />

            {/* Header*/}

            <Grid container flex={1} flexDirection='column'  alignItems='center' >
                <Grid item>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <MonetizationOnOutlined />
                    </Avatar>

                </Grid>

                <Grid item>
                    <Typography 
                        component="h1" 
                        variant="h5"
                        color='textSecondary'
                        gutterBottom
                        sx={{
                            marginBottom:'20px',
                        }}
                    >
                            Deposit Money
                    </Typography>
                    { error && <Alert severity='error' sx={{color:'red',background:'inherit'}}>{error}</Alert>}
                    
                </Grid>

                
            </Grid>

            {/*form*/}

            <Grid container flex={1} flexDirection='column' alignItems='center'>
                <Grid item>
                    <form onSubmit={formik.handleSubmit} >
                        
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
                                Mpesa / Card 
                            </FormLabel>

                            <RadioGroup 
                                value={mpesa} 
                                onChange={(e)=> setMpesa(e.target.value)}
                            >
                                <FormControlLabel value='Mpesa' control={<Radio color='secondary' />} label='Mpesa' />
                                <FormControlLabel value='Card' control={<Radio color='secondary'/>} label='Card' />
                                
                            </RadioGroup>
                        </FormControl>


                        {/*Amount*/}

                        <TextField
                            label='amount'
                            id='amount'
                            name='amount'
                            variant= 'outlined'
                            color='secondary'
                            type='number'
                            fullWidth
                            required
                            sx={{
                                marginTop:'20px',
                                marginBottom:'20px',
                                display:'block'
                            }}
                            {...formik.getFieldProps('amount')}
                        />
                        {formik.touched.amount && formik.errors.amount ? (
                            <Alert severity='error' sx={{color:'red',background:'inherit'}}>{formik.errors.amount}</Alert>
                        ) : null}

                        <br/>
                        {/**/}

                        <Button
                            type="submit"
                            disabled={loading}
                            color='secondary'
                            variant="contained"
                            endIcon={<KeyboardDoubleArrowRight />}
                        >
                            DEPOSIT
                        </Button>
                        
                    </form>
                </Grid>

            </Grid>
            
        </Container>

    )

}
