import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DynamicColumnForm from './components/AddDocumentForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <DynamicColumnForm />
  )
}

export default App
