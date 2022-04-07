import React, { createContext, useEffect, useState } from 'react'
// import { doc, updateDoc,increment,onSnapshot, getDoc } from "firebase/firestore";
import { auth } from '../firebaseConfig';


export const UserContext = createContext();

export const UserProvider = ({children}) => {
    
    const [currentUser,setCurrentUser] = useState(null)
    const [loading,setLoading] = useState(true)
    const[netMoney,setNetMoney] = useState(0)
    const[totalSent,setTotalSent] = useState(0)

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged(user =>{
            setCurrentUser(user)
            setLoading(false)
        })
        return unsubscribe
    },[])
    
    // const fetchMoney = () => {
 
    //     getDoc(doc(db, "money", currentUser.uid),(docs) => {
    //         const moneydata = docs.data()
    //         // console.log(moneydata.totalSent)
    //         // console.log(moneydata.netMoney)
           
    //         setTotalSent(moneydata.totalSent)
    //         setNetMoney(moneydata.netMoney)

            
    //     })
    // }

    

    // const send = async (money,userId) => {
    //     const moneyRef = doc(db, "money", currentUser.uid);
    //     const userRef = doc(db,"money",userId)
    //     // update money collection
    //     await updateDoc(moneyRef, {
    //         totalSent: increment(money),
    //         netMoney:increment(-money)
    //     })
    //     await updateDoc(userRef,{
    //         netMoney:increment(money)
    //     })
    // }

    

    // const deposit = async (money) => {
    //     const moneyRef = doc(db, "money", currentUser.uid);
    //     // update money collection
    //     await updateDoc(moneyRef, {
    //         netMoney:increment(money)
    //     })
    // }


    const value = {
        currentUser,
        netMoney:netMoney,
        setNetMoney:netMoney => setNetMoney(netMoney),
        totalSent:totalSent,
        setTotalSent: totalSent => setTotalSent(totalSent)
    }
    
    return (
        <UserContext.Provider value={value}>
            {!loading && children}
        </UserContext.Provider>
    )
}

