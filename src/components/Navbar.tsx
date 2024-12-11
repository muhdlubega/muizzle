import { useNavigate } from 'react-router-dom';
import muizzle from '../assets/muizzle.png'
import '../styles/Navbar.css'
import { Language } from '../types/types';

const languageMapping: Record<Language, string> = {
  tamil: 'TA',
  hindi: 'HI',
  english: 'EN',
  eastasian: 'EA'
};

const Navbar = ({language}: {language: Language}) => {
  const navigate = useNavigate();
  const lang = languageMapping[language];

  return (
    <div className='navbar'>
      <div className='navbar-head' onClick={() => { navigate('/') }}>
        <img className='navbar-logo' alt='muizzle-navbar-logo' src={muizzle} />
        <p className='navbar-title'>Muizzle</p>
        <p className='navbar-badge' style={{ background: lang === 'TA' ? 'orange' : lang === 'HI' ? 'green' : lang === 'EN' ? 'blue' : 'purple' }}>{lang}</p>
      </div>
    </div>
  )
}

export default Navbar