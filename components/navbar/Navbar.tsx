import DarkMode from './DarkMode'
import LinkDropdown from './LinkDropdown'
import Logo from './Logo'
import NavSearch from './NavSearch'

function Navbar() {
  return (
    <nav className='border-b'>
      <div className='container flex flex-col flex-wrap gap-4 py-8 sm:flex-row sm:items-center sm:justify-between'>
        <Logo />
        <NavSearch />
        <div className='flex items-center gap-4'>
          <DarkMode />
          <LinkDropdown />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
