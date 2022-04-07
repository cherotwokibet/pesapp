import React, { useState ,useEffect, useRef,useContext } from 'react'
import { Chart } from "react-google-charts";

import {
    Avatar,
    Card,
    Chip,
    Container,
    Rating,
    createTheme,
    Grid,
    Typography,
    CssBaseline,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Paper
} from '@mui/material'

import { 
    AccountBalanceWallet,
    AccountCircle,
    Email,
    Female,
    Male,
    PhoneAndroid,

} from '@mui/icons-material'

import { doc, getDoc } from "firebase/firestore"; 
import {db } from '../firebaseConfig'
import { UserContext } from '../contexts/UserContext'

import malePhoto from '../images/male.png'
import femalePhoto from '../images/female.png'


const theme = createTheme()


export default function MyAccount() {

    const isMounted = useRef(false);
    const [user,setUser] = useState();
    const {totalSent,netMoney,setNetMoney,setTotalSent,currentUser} = useContext(UserContext);


    const fetchUser = async () => {
        await getDoc(doc(db,"users",currentUser.uid))
            .then((docSnap)=>{
                const user_fire = docSnap.data()
                if(isMounted.current) {
                    setUser(user_fire)
                }
                // console.log(user_fire)
            })
            .then( async()=> {
                await getDoc(doc(db, "money", currentUser.uid))
                .then((docSnap) => {
                    const moneydata = docSnap.data()
                    if(isMounted.current) {
                        // console.log(moneydata.totalSent)
                        // console.log(moneydata.netMoney)
                        setTotalSent(moneydata.totalSent)
                        setNetMoney(moneydata.netMoney)
                    }
                })
            })
            
            .catch((e)=>{
                isMounted.current && console.error(e)
            })
        // getDocs(collection(db,'users'))
        //     .then((querySnapshot) => {
        //         let user_fire = {}
        //         querySnapshot.forEach((doc)=>{
        //             let data = doc.data()
        //             if(data.email === auth.currentUser.email) {
        //                 user_fire = {...data}
        //             }
        //             // console.log(data)
        //         })
        //         if(isMounted.current) {
        //             setUser(user_fire)

        //         }
        //         console.log(user_fire)
        //     })
        //     .catch((e) => {
        //         isMounted.current && console.error(e)
        //     })

    }

    useEffect (()=>{
        isMounted.current = true
        fetchUser()
        return () => (isMounted.current = false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const chartData = [
        ["Money", "Spending"],
        ["Net Money", netMoney],
        ["Total Sent", totalSent]
    ];


    return (

        <div style={{display:'flex'}}>
            <Container >
                <CssBaseline/>
                <Grid container flex={1}>
                    <Grid item xs={12}>
                        <Card sx={{
                            width:'100%',
                            marginTop:'20px',
                            height: "200px",
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            filter: "contrast(75%)",
                            backgroundImage:"url(/wallpaper.jpeg)"
                        }} 
                        />
                    </Grid>

                </Grid>

                {/*header*/}

                <Grid container sx={{
                    position: "relative",
                    width: "calc(100%)",
                    top: "-60px",
                    alignItems: "flex-end",
                    "& .MuiGrid-item": {
                        margin: theme.spacing(1),
                    },
                }} flex={1} >
                    
                    <Grid item xs={6} md={3} >
                        <Avatar
                            alt='prof_pic'
                            src={user && user.gender === 'male' ? malePhoto : femalePhoto }
                            sx={{
                                border: `3px solid white`,
                                width: theme.spacing(13),
                                height: theme.spacing(13),
                                boxShadow: theme.shadows[3],
                            }}
                        />
                    </Grid>
                    
                    <Grid item xs={12} md={3} >
                        <Typography noWrap sx={{flexGrow:1 }} variant='h5'> {user && user.name} </Typography>
                    </Grid>

                    <Grid item >
                        <Chip variant='outlined' icon={<AccountBalanceWallet/>} label='Account'/>

                    </Grid>

                    <Grid item>
                        <Rating name='read-only' value={4.3} readOnly/>

                    </Grid>

                </Grid>

                <Grid container alignItems='center' justifyContent='center'>
                    <Grid item >
                        <Typography>Account Details</Typography>
                    </Grid>
                </Grid>

                <Divider/>

                {/*user details*/}
                
                <Grid container flex={1}>
                    <Grid item xs={12} sx={{backgroundColor:'#f9f9f9'}}>
                            
                        <List>
                            <ListItem>
                                <ListItemIcon>{<AccountCircle/>}</ListItemIcon>
                                <ListItemText>{user && user.name}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon> { user && user.gender === 'male' ? <Male/> : <Female/>} </ListItemIcon>
                                <ListItemText>{user && user.gender}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>{<Email/>}</ListItemIcon>
                                <ListItemText>{user && user.email}</ListItemText>
                            </ListItem>
                            <ListItem>
                                <ListItemIcon>{<PhoneAndroid/>}</ListItemIcon>
                                <ListItemText>{user && user.phone}</ListItemText>
                            </ListItem>
                        </List>
                        

                    </Grid>
                </Grid>


                <Divider/>

                {/*Chart*/}

                <Grid container flex={1}>
                    <Grid item xs={12}>
                        
                        <Paper >

                            <Chart
                                chartType="PieChart"
                                data={chartData}
                                options={{
                                    backgroundColor:'#f9f9f9',
                                    pieHole: 0.4,
                                    is3D: false,
                                }}
                            />
                        </Paper>

                        
                    </Grid>

                </Grid>

                
            </Container>
        </div>
    )
}

