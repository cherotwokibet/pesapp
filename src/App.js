import React from 'react'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import './App.css';

import SendMoney from './pages/SendMoney'
import Deposit from './pages/Deposit'
import MyAccount from './pages/MyAccount';
import Layout from './components/Layout';
import Transactions from './pages/Transactions';
import SignUp from './auth/Signup';
import Login from './auth/Login'
import ForgotPassword from './auth/ForgotPassword'
import { UserProvider } from './contexts/UserContext';
import PrivateRoute from './components/PrivateRoute';


function App() {
    
  return (
    <UserProvider>
      <div className='App'>
        <Router>
          <Layout>
            <Routes>
              <Route
                path='/'
                element={
                  <PrivateRoute>
                    <MyAccount/>
                  </PrivateRoute>
                }  
              />
              <Route
                path='/send'
                element={
                  <PrivateRoute>
                    <SendMoney />
                  </PrivateRoute>
                }  
              />
              <Route
                path='/deposit'
                element={
                  <PrivateRoute>
                    <Deposit />
                  </PrivateRoute>
                }  
              />
              <Route
                path='/transactions'
                element={
                  <PrivateRoute>
                    <Transactions />
                  </PrivateRoute>
                }  
              />
              <Route path='/signup' element={<SignUp />}/>
              <Route path='/login' element={<Login/>}/>
              <Route path='/forgot' element={<ForgotPassword/>}/>
            </Routes>
          </Layout>
        </Router>

      </div>
    </UserProvider>
    
  );
}

export default App;
