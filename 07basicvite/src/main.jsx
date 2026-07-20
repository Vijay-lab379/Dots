import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import React from 'react'

const reactCompo = {
    type: 'input',
    attributes: {
        type: "text",
        placeholder: 'Enter Your text',
        style: "font-family :serif"
    },
    children: 'this is inner html, which may contain child'
}

function MyVite() {
    return (
        <div>
            <h1>This is a MyVite func returned Div</h1>
        </div>
    )
}

const AnotherEle = (
    <h1>This literal constatnt</h1>
)

const areactCompo = React.createElement(
    'input',
    {
        type: "text",
        placeholder: 'Enter Your text'
    }
)

const anAnotherreactCompo = React.createElement(
    'a',
    {
        href: "https://google.com",
        target: '_blank'
    },
    "Click to visit google"
)

createRoot(document.getElementById('root')).render(
    // MyVite()
    // <MyVite/>

    // AnotherEle
    // AnotherEle()
    
    anAnotherreactCompo
)
