import { useNavigate } from 'react-router-dom';
import muizzle from '../assets/muizzle.png'
import '../styles/Navbar.css'

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className='navbar'>
      <div className='navbar-head' onClick={() => {navigate('/')}}>
        <img className='navbar-logo' alt='muizzle-navbar-logo' src={muizzle} />
        <p className='navbar-title'>Muizzle</p>
        <p className='navbar-badge'>TA</p>
      </div>
    </div>
  )
}

export default Navbar