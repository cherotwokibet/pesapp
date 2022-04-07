
import { Container, Grid, Typography } from '@mui/material';
import React, {useState,useEffect, useRef,useContext} from 'react';
import { 
    collection, 
    getDocs, 
    doc,
    query,
    where, 
    deleteDoc 
} from "firebase/firestore"; 



import { db } from '../firebaseConfig';
import { UserContext } from '../contexts/UserContext'
import TransactionsCard from '../components/TransactionsCard';



export default function Transactions() {
    const [transactions,setTransactions] = useState([])
    const {currentUser} = useContext(UserContext)
    const isMounted = useRef(false);

    const fetchData = () => {
        getDocs(collection(db, "transactions"))
            .then((querySnapshot)=> {
                let transactions_fire = []
                querySnapshot.forEach((doc)=>{
                    let data = doc.data()
                    if(currentUser.uid === data.actorId) {
                        transactions_fire.push(data)
                    }
                })
                if(isMounted.current){
                    setTransactions(transactions_fire)
                }
                // console.log(transactions_fire)
            })
            .catch((e)=>{
                isMounted.current && console.error(e)
            })
    }
    
    useEffect(()=>{
        isMounted.current = true;
        fetchData()
        return () => (isMounted.current = false);
    })

    const handleDelete = async (id) => {
        const transactionsRef = collection(db, "transactions")
        const q = query(transactionsRef, where("id", "==", id));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((data) => {
            const id = data.id
            // console.log(data.id)
            // deleteDoc(doc)
            deleteDoc(doc(db, "transactions", id))
        });
        
    }


    return (
        <Container>
            <Grid container flex={1} flexDirection='column'  alignItems='center'>
                <Grid item>
                    <Typography 
                        component="h1" 
                        variant="h5"
                        color='textSecondary'
                        gutterBottom
                        sx={{
                            marginBottom:'30px',
                        }}
                    >
                        Recent Transactions
                    </Typography>

                </Grid>
            </Grid>
            <Grid container spacing={3}>
                {transactions.map(transaction => (
                    <Grid item key={transaction.id} xs={12} md={6} lg={4}>
                        <TransactionsCard transaction={transaction} handleDelete={handleDelete} />

                    </Grid>

                ))}
            </Grid>

        </Container>
    )
}

