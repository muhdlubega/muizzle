import muizzle from '../../public/muizzle.png'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img className='navbar-logo' alt='logo' src={muizzle} />
        <p className='navbar-title'>Muizzle</p>
    </div>
  )
}

export default Navbar