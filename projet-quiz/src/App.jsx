import './App.css'
import { useState } from 'react';

function App() {
  
  //Connecter
  const [nom, setNom] = useState('');

  const handleChange = (e) => {
    setNom(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nom.trim() !== '') {
      localStorage.setItem('joueur', nom);
      alert(`Bienvenue ${nom} !`);
    } else {
      alert('Veuillez entrer votre nom avant de jouer.');
    }
  };

  return(
    <>
      <h2>Quiz</h2>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='Votre nom' value={nom} onChange={handleChange}/>
      </form>
      <button type='submit'>Commencer</button>
    </>
  )
}

export default App
