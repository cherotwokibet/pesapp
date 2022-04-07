
import React,{useState} from 'react'
import { 
    Typography,
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    AppBar,
    Toolbar,
    Divider,
    IconButton,
    Box,
    CssBaseline,
} from '@mui/material'

import {  
    AccountBox,
    Menu,
    Logout,
    Send,
    AddCard,
    Receipt
} from '@mui/icons-material'

import { 
    useNavigate,
    useLocation 
} from 'react-router-dom'

import {format} from 'date-fns'

import { signOut } from "firebase/auth";
import {auth} from '../firebaseConfig'

const drawerWidth = 240


export default function Layout({children}) {

    const navigate = useNavigate();
    const location = useLocation();
    // const {} = useContext(UserContext)
    const menuItems = [
        {
            text:'My Account',
            icon:<AccountBox color='secondary'/>,
            path:'/'
        },
        {
            text:'Deposit',
            icon:<AddCard color='secondary'/>,
            path:'/deposit'
        },
        {
            text:'Send',
            icon:<Send color='secondary'/>,
            path:'/send'   
        },
        {
            text:'Transactions',
            icon:<Receipt color='secondary'/>,
            path:'/transactions'
        }
    ]

    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    const handleSignOut = () => {
        signOut(auth)
        .then(() => {
            // Sign-out successful.
            // console.log('Sign out')
            navigate('/login')
        })
        .catch((error) => {
            console.error(error.code)
        });
          
    }

    const drawer = (
        <div>
            <div>
                <Typography variant='h5' sx={{padding:2}}>
                    Pesa App
                </Typography>
            </div>

            {/* list / links*/}
            <Divider/>

            <List>
                {menuItems.map(item => (
                    <ListItemButton
                        
                        key={item.text}
                        onClick={()=>navigate(item.path)}
                        sx={{background: location.pathname === item.path ? '#e1e1e7':null}}
                    >
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItemButton>
                ))}
            </List>
        </div>
    );


    return (
        
        <div style={{display:'flex'}}>
            <CssBaseline/>
            {/* app bar */}
            <AppBar 
                position='fixed'
                color='primary'
                elevation={0} 
                sx={{
                    background:'#f9f9f9',
                    width:{sm: `calc(100% - ${drawerWidth}px)`},
                    ml: { sm : `${drawerWidth}px` },
                }}
                
            >
                <Toolbar>
                    <IconButton
                        color='secondary'
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <Menu />
                    </IconButton>

                    <Typography color='textSecondary' noWrap sx={{flexGrow:1}}>
                        Today is the  {format (new Date(), 'do MMMM Y')}
                    </Typography>
                    
                    <IconButton
                        onClick={handleSignOut}
                        title='Sign Out'
                        color='secondary'
                        size='small'
                        disabled={location.pathname === '/' ? false : true }
                    >
                        <Typography>
                            Sign Out
                        </Typography>
                        <Logout sx={{marginLeft:0.5}}/>

                    </IconButton>
                    {/* <Typography color='textSecondary'>
                        Mario
                    </Typography>
                    <Avatar 
                        alt="prof_pic" 
                        src={mario}
                        sx={{
                            marginLeft:2
                        }}
                    /> */}
                </Toolbar>
            </AppBar>
            
            {/* side drawer*/}
            <Box
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { 
                            xs: 'block', 
                            sm: 'none'
                        },
                        '& .MuiDrawer-paper': { 
                            boxSizing: 'border-box',
                            width: drawerWidth 
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    sx={{
                        width:drawerWidth,
                        display:{
                            xs: 'none', 
                            sm: 'block'
                        },
                        flexShrink:0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        }
                    }}
                    
                    open
                    variant='permanent'
                    
                >
                    {drawer} 
                </Drawer>

            </Box>

            {/*Main Content*/}

            <div 
                style={{
                    background:'#f9f9f9',
                    marginTop:'60px',
                    width:'100%',
                    padding:24}}
            >
                {children}
            </div>
        </div>
        
    )
}

