import './App.css'
import { useState } from 'react';

function App() {
  
  const [nom, setNom] = useState('');

  const handleChange = (e) => {
    setNom(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nom.trim() !== '') {
      localStorage.setItem('joueur', nom);
      alert(`Bienvenue ${nom} !`);
      window.location.href = '/quiz';
    } else {
      alert('Veuillez entrer votre nom avant de jouer.');
    }
  };

  return(
    <>
      <h2>Quiz</h2>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Votre nom' value={nom} onChange={handleChange}/>
        <button type='submit'>Commencer</button> 
      </form>
    </>
  )
}

export default App
