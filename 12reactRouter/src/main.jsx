import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom'
import { RouterProvider } from 'react-router'
import { About, Home, Contact, User } from '../components/index.js'
import Layout from './Layout.jsx'
import App from './App.jsx'
import './index.css'
import Github, { githubInfoLoader } from '../components/GitHub/Github.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path='home' element={<Home />} />
      <Route path='about' element={<About />} />
      <Route path='contact' element={<Contact />} />
      <Route path='user/' element={<User />}>
        <Route path=':userId' element={<User />} />
      </Route>
      <Route
        loader={githubInfoLoader}
        path="github/"
        element={<Github />} />
      <Route path="*" element={<div className='h-60 p-50 text-center'>Not Found</div>} />
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
