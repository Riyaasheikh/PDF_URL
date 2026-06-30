import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';

import Splash from '../pages/Splash';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import PublicPdfViewer from '../pages/PublicPdfViewer'; // Import the new public viewer component

const AppRouter = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>

                    <Route path="/" element={<Splash />} />
                    <Route path="/home" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />

                    <Route path="/v/:slug" element={<PublicPdfViewer />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default AppRouter;