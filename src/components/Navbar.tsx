import { useNavigate, useSearchParams } from 'react-router-dom';
import muizzle from '../assets/muizzle.png'
import '../styles/Navbar.css'

const Navbar = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lang = searchParams.get("lang") || "TA";

  return (
    <div className='navbar'>
      <div className='navbar-head' onClick={() => { navigate('/') }}>
        <img className='navbar-logo' alt='muizzle-navbar-logo' src={muizzle} />
        <p className='navbar-title'>Muizzle</p>
        <p className='navbar-badge' style={{ background: lang === 'TA' ? 'green' : lang === 'HI' ? 'blue' : 'purple' }}>{lang}</p>
      </div>
    </div>
  )
}

export default Navbar