import './App.css'

function Quiz() {

  const nom = localStorage.getItem('joueur');

  return (
    <div>
      <h3>Joueur : {nom}</h3>
    </div>
  );
}

export default Quiz;
