import React from 'react'
import 'flowbite'
import { Toaster } from 'react-hot-toast';

import AppRoutes from './routes'
import AuthProvider from './context/authContext';
import LoadingProvider from './context/loadingContext';
import axiosConfig from './config/axios';

export default function App() {

  return (
    <LoadingProvider>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </LoadingProvider>
  )
}
