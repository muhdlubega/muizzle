import './App.css'
import Game from './components/Game';
import Navbar from './components/Navbar';

function App({isFadingOut, isRootLoading}: {isFadingOut: boolean, isRootLoading: boolean}) {
  return (
    <div className="App">
      <Navbar />
      <Game isFadingOut={isFadingOut} isRootLoading={isRootLoading} />
    </div>
  );
 }
 

export default App
