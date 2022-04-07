import React, { useState,useEffect,useRef,useContext } from 'react';
import {useNavigate} from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {v4 as uuidv4} from 'uuid'
import {format} from 'date-fns'

import {
    Typography,
    Autocomplete,
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
    Chip,
} from '@mui/material';

import {
    KeyboardArrowRight,
    MonetizationOnOutlined
} from '@mui/icons-material';

import { collection, addDoc, getDocs ,doc,updateDoc,increment} from "firebase/firestore"; 
import { db,auth} from '../firebaseConfig';
import { UserContext } from '../contexts/UserContext'


export default function SendMoney() {
    
    const navigate = useNavigate()
    const [error,setError] = useState()
    const [loading,setLoading] = useState(false)
    const [ep,setEp] = useState('name')
    const [sencurrency,setSenCurrency] = useState('USD')
    const [reccurrency,setRecCurrency] = useState('USD')
    const [choosen,setChoosen] = useState()
    const isMounted = useRef(false);
    const [users,setUsers] = useState([])
    const [current,setCurrent] = useState()
    const [recamount,setRecAmount] = useState(0)
    const [senamount,setSenAmount] = useState(0)
    const {netMoney } = useContext(UserContext)


    const fetchUsers = () => {
        getDocs(collection(db,'users'))
            .then((querySnapshot) => {
                let users_fire = []
                let curr =[] ;
                querySnapshot.forEach((doc)=>{
                    let data = doc.data()
                    if(data.email !== auth.currentUser.email) {
                        users_fire.push(data)
                    }

                    if(data.email === auth.currentUser.email) {
                        curr.push(data)
                    }
                    
                    // console.log(data)
                })
                if(isMounted.current) {
                    setUsers(users_fire)
                    setCurrent(curr[0].name)
                    // console.log(curr[0].name)
                }
                // console.log(curr[0].name)
            })
            .catch((e) => {
                isMounted.current && console.error(e)
            })

    }

    useEffect (()=>{
        isMounted.current = true
        fetchUsers()
        return () => (isMounted.current = false)
    },[])

    useEffect(()=>{
        if(reccurrency === 'USD') {
            if(sencurrency === 'USD' ) {
                setRecAmount(senamount)
            } else if (sencurrency === 'NGN') {
                setRecAmount(senamount / 415 )
    
            } else {
                setRecAmount(senamount * 1.13);
            }
        } else if(reccurrency === 'NGN') {
            if(sencurrency === 'USD' ) {
                setRecAmount(senamount * 415)
            } else if (sencurrency === 'NGN') {
                setRecAmount(senamount )
            } else {
                setRecAmount(senamount * 470)
            }
    
        } else {
            if(sencurrency === 'USD' ) {
                setRecAmount(senamount * 0.88)
            } else if (sencurrency === 'NGN') {
                setRecAmount(senamount / 470)
    
            } else {
                setRecAmount(senamount)
            }
            
        }
    },[reccurrency,sencurrency,senamount])

    const handleChange = (e) => {
        e.preventDefault()
        const onlyNums = e.target.value.replace(/[^0-9]/g, '');
        if(onlyNums) {
            setSenAmount(onlyNums)
            formik.setFieldValue('amount', onlyNums)
        }

    }

 
    const formik = useFormik({
        initialValues : { 
            amount:5
        },
        validationSchema : Yup.object({
            amount: Yup.number().positive().nullable(false).min(5,'Minimum amount you can send is 5').required('Required'),
        }),
        onSubmit : (values, { resetForm,setSubmitting }) => {
            
            setError('')
            setLoading(true)
            // console.log(values.amount)
            
            const amt = {
                amount : parseInt(values.amount)
            }
            
            if (sencurrency === 'EUR') {
                values.amount = Math.floor(values.amount * 1.13)
            } 
            if (sencurrency === 'NGN') {
                values.amount = Math.floor(values.amount / 415)
            }

            // console.log(values)
            // console.log(amt)

            if(values.amount >= netMoney ) {
                setError(`Your balance is Ksh.  ${netMoney} LOWER AMOUNT !!!`)
                setLoading(false)
                return
            }

            const toUpdate = {...choosen,...amt}

            addDoc(collection(db,"transactions"),{
                ...toUpdate,
                actorId: auth.currentUser.uid,
                id: uuidv4(),
                type:'send',
                currency: sencurrency,
                created_At: format(new Date(),'do MMM yyyy, HH:mm'),
                updated_At: format(new Date(),'do MMM yyyy, HH:mm')
                
            }).then(()=>{
                addDoc(collection(db, "transactions"), {
                    ...amt,
                    actorId: choosen.userId,
                    name: current,
                    id: uuidv4(),
                    type:'recieved',
                    currency: sencurrency,
                    created_At: format(new Date(),'do MMM yyyy, HH:mm'),
                    updated_At: format(new Date(),'do MMM yyyy, HH:mm')
                }).then(async ()=>{
                    const moneyRef = doc(db, "money", auth.currentUser.uid);
                    const userRef = doc(db,"money",choosen.userId)
                    // update money collection
                    await updateDoc(moneyRef, {
                        totalSent: increment(values.amount),
                        netMoney:increment(-values.amount)
                    })
                    await updateDoc(userRef,{
                        netMoney:increment(values.amount)
                    })
                })
                // console.log("Doc written ") 
                // send(values.amount,choosen.userId)

            })
            .catch((e)=>{
                setError('Failed To Send')
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
                            Send Money
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
                                Name / Email 
                            </FormLabel>

                            <RadioGroup
                                row 
                                value={ep} 
                                onChange={(e)=> setEp(e.target.value)}
                            >
                                <FormControlLabel value='name' control={<Radio color='secondary' />} label='Name' />
                                <FormControlLabel value='email' control={<Radio color='secondary'/>} label='Email' />
                                
                            </RadioGroup>
                        </FormControl>

                        {/* Autocomplete*/}

                        <Autocomplete
                            disablePortal
                            id="combo-box-demo"
                            options={users}
                            getOptionLabel={(option) => ( 
                                ep === 'email' ? option.email : option.name 
                            )}
                            sx={{ width: 300 }}
                            onChange={(e,v)=>{
                                setChoosen(v)
                            }}
                            disableClearable
                            limitTags={2}
                            renderInput={(params) => (
                                <TextField 
                                    {...params} 
                                    label={ep} 
                                />
                            )}
                        />

                        {/*Sender Control Currencies*/}

                        
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
                                Source Currency
                            </FormLabel>

                            <RadioGroup
                                row 
                                value={sencurrency} 
                                onChange={(e)=> setSenCurrency(e.target.value)}
                            >
                                <FormControlLabel value='USD' control={<Radio color='secondary' />} label='USD' />
                                <FormControlLabel value='NGN' control={<Radio color='secondary'/>} label='NGN' />
                                <FormControlLabel value='EUR' control={<Radio color='secondary'/>} label='EUR' />
                                
                            </RadioGroup>
                        </FormControl>

                        {/*Amount*/}

                        <TextField
                            label='amount'
                            id='amount'
                            name='amount'
                            type='number'
                            variant= 'outlined'
                            color='secondary'
                            fullWidth
                            required
                            onChange={handleChange}
                            sx={{
                                marginTop:'20px',
                                marginBottom:'1px',
                                display:'block'
                            }}
                            
                            error={formik.touched.amount && Boolean(formik.errors.amount)}
                            helperText={formik.touched.amount && formik.errors.amount}
                            // {...formik.getFieldProps('amount')}
                        />
                        
                        {/* {formik.touched.amount && formik.errors.amount ? (
                            <Alert severity='error' sx={{color:'red',background:'inherit'}}>{formik.errors.amount}</Alert>
                        ) : null} */}
                        
                       

                        {/* Receiver Control Currencies*/}

                        <FormControl sx={{
                                marginTop:'10px',
                                marginBottom:'5px',
                                display:'block'
                            }}
                        >
                            
                            <FormLabel sx={{
                                '&.Mui-focused':{color:'#666666'},
                                }} 
                            > 
                                Target Currency
                            </FormLabel>

                            <RadioGroup
                                row 
                                value={reccurrency} 
                                onChange={(e)=> setRecCurrency(e.target.value)}
                            >
                                <FormControlLabel value='USD' control={<Radio color='secondary' />} label='USD' />
                                <FormControlLabel value='NGN' control={<Radio color='secondary'/>} label='NGN' />
                                <FormControlLabel value='EUR' control={<Radio color='secondary'/>} label='EUR' />
                                
                            </RadioGroup>
                        </FormControl>


                        {/*Amount*/}

                        <Chip label={recamount && Math.floor(recamount)} variant="outlined" sx={{paddingLeft:'20px',paddingRight:'20px', marginBottom:'20px', borderWidth:'2px'}}/>

                        {/* <Typography>{recamount}</Typography> */}

                        <br/>

                        {/* */}

                        <Button
                            type="submit"
                            disabled={loading}
                            color='secondary'
                            variant="contained"
                            endIcon={<KeyboardArrowRight/>}
                        >
                            SEND
                        </Button>
                        
                    </form>
                </Grid>

            </Grid>
            
        </Container>

    )
}

