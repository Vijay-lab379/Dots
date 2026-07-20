import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Card from './components/Card.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <div id='img'>
      <Card post="SDE-3" id="No. 234" username="Arvin c." imgUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzVRVcZrCYz6YguqgD_cLlssd3dr3ymolkJM1cHnWSwA&s=10' />
      <Card username="Lia" id='@948' post="HR manager" imgUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTWq3OzjkHLT3y72zSwWVKxGACGkR1Nt7eXCyf2Q1lFA&s=10' />
      <Card username='Sam' post="Product manager" id='2384' imgUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzh_gCvTvAANGdmGZqrWlXpqnnaNivbOJjkD2TTafF_w&s=10' />
      <Card username="Veena Lee" id='3423' post="Marketing lead" imgUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQInkOfQCC-IMsNpJdhzDNmOelumiinFNCkBBRxCLUNRg&s=10' />
    </div>
  </StrictMode>,
)
