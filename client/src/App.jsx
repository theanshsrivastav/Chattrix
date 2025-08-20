import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from "react-hot-toast";
import { AuthContext } from '../context/AuthContext';
import { connectSocket } from './socket';

function App() {
    const {authUser} = useContext(AuthContext);

    useEffect(() => {
        if (authUser?._id) {
            connectSocket(authUser._id);
        }
    }, [authUser]);

    return (
        <Router>
            <div className='bg-gradient-to-br from-blue-300 via-orange-50 to-purple-200'>
                <Toaster/>
                <Routes>
                    <Route path="/" element={authUser ? <HomePage/> : <Navigate to="/login"/>} />
                    <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/"/>} />
                    <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login"/>} />
                </Routes>
            </div>
            
        </Router>
    );
}

export default App;
