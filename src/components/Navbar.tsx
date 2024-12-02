import muizzle from '../assets/muizzle.png'
import '../styles/Navbar.css'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img className='navbar-logo' alt='muizzle-navbar-logo' src={muizzle} />
        <p className='navbar-title'>Muizzle</p>
        <p className='navbar-badge'>TA</p>
    </div>
  )
}

export default Navbar