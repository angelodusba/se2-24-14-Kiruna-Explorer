import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

/*API*/
import API from './API/Api'

/*DATA MODELS*/
import { Document } from './dataModels/Document'
/*REACT COMPONENTS*/
import DynamicColumnForm from './components/AddDocumentForm'

function App() {
  const [count, setCount] = useState(0)


  return (
    <DynamicColumnForm sendDocument={API.sendDocument} />
  )
}

export default App
