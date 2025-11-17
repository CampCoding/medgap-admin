"use client";
import React from 'react'
import { Provider } from 'react-redux'
import { store } from '../../store'
import { ToastContainer } from 'react-toastify';

export default function ProviderComponents({children}) {
  return (
    <Provider store={store}>{children}
    <ToastContainer />
    </Provider>
  )
}
