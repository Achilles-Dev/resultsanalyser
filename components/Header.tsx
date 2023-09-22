import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarItem,
} from '@nextui-org/react'
import Link from 'next/link'
import React from 'react'
import { IconContext } from 'react-icons'
import { FaBars, FaArrowDown } from 'react-icons/fa'

const Header = () => {
  const logoutDispay = () => {}
  return (
    <Navbar className='bg-[#2096ffe6] flex justify-between text-[#05ffa3e6]'>
      <NavbarItem>
        <Link href='#'>
          <IconContext.Provider value={{ color: '#05ffa3e6', size: '24px' }}>
            <FaBars />
          </IconContext.Provider>
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Link href='/dashboard' className='uppercase text-[20px]'>
          Results Analyser
        </Link>
      </NavbarItem>
      <NavbarItem>
        <Dropdown>
          <DropdownTrigger>
            <div className='flex justify-center items-center gap-1'>
              <p>Admin</p> <FaArrowDown />
            </div>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>
              <Link href='https://solomonhagan.netlify.app' target='_blank'>
                Achilles-Dev
              </Link>
            </DropdownItem>
            <DropdownItem>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarItem>
    </Navbar>
  )
}

export default Header
