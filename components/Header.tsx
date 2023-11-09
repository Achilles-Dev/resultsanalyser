import {
  Accordion,
  AccordionItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from '@nextui-org/react'
import { deleteCookie } from 'cookies-next'
import { signOut as signOutNextAuth } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { FaArrowDown } from 'react-icons/fa'

const menuItems = ['Dashboard', 'Courses', 'Students', 'Subjects', 'Results']

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const router = useRouter()

  const signOut = async () => {
    deleteCookie('year')
    await signOutNextAuth()
    router.push('/')
  }

  return (
    <Navbar
      className='bg-[#2096ffe6] flex text-[#05ffa3e6]'
      onMenuOpenChange={setIsMenuOpen}
      isMenuOpen={isMenuOpen}
    >
      <NavbarItem className='md:hidden'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className='sm:hidden'
        />
      </NavbarItem>
      <NavbarItem>
        <Link href='/dashboard' className='uppercase text-[20px]'>
          Results Analyser
        </Link>
      </NavbarItem>
      <NavbarContent
        className='hidden md:flex gap-7 lg:gap-10'
        justify='center'
      >
        <NavbarItem>
          <Link href='/courses' className='text-white'>
            Courses
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href='/students' className='text-white'>
            Students
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href='/subjects' className='text-white'>
            Subjects
          </Link>
        </NavbarItem>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                className='p-0 bg-transparent data-[hover=true]:bg-transparent text-[16px] text-white'
                endContent={<FaArrowDown />}
                variant='light'
              >
                Results
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu aria-label='Results & Results analysis pages'>
            <DropdownItem>
              <Link href='/results' className=''>
                Student Results
              </Link>
            </DropdownItem>
            <DropdownItem>
              <Link href='/results/analyse'>Results Analysis</Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
      <NavbarItem>
        <Dropdown>
          <DropdownTrigger>
            <Button
              className='p-0 bg-transparent data-[hover=true]:bg-transparent text-[16px] text-[#05ffa3e6] md:flex justify-center items-center gap-1 hidden'
              endContent={<FaArrowDown />}
              variant='light'
            >
              Admin
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label='User & Logout'>
            <DropdownItem>
              <Link href='https://solomonhagan.netlify.app' target='_blank'>
                Achilles-Dev
              </Link>
            </DropdownItem>
            <DropdownItem onPress={signOut}>Logout</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarItem>
      <NavbarMenu className='flex flex-col gap-5 py-5'>
        <NavbarMenuItem>
          <div className='flex justify-between'>
            <Link
              href='https://solomonhagan.netlify.app'
              target='_blank'
              onClick={() => setIsMenuOpen(false)}
            >
              Achilles-Dev
            </Link>
            <Button color='primary' onPress={signOut}>
              Logout
            </Button>
          </div>
        </NavbarMenuItem>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            {item === 'Results' ? (
              <Accordion className='p-0'>
                <AccordionItem title='Results' classNames={{ trigger: 'p-0' }}>
                  <div className='flex flex-col px-4 gap-3'>
                    <Link
                      className='w-full'
                      href='/results'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Student Results
                    </Link>
                    <Link
                      className='w-full'
                      href='/results/analyse'
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Results Analysis
                    </Link>
                  </div>
                </AccordionItem>
              </Accordion>
            ) : (
              <Link
                color={
                  index === 2
                    ? 'primary'
                    : index === menuItems.length - 1
                    ? 'danger'
                    : 'foreground'
                }
                className='w-full'
                href={`/${item.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </Link>
            )}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  )
}

export default Header
