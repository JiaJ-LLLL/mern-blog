import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun} from 'react-icons/fa'
import { useSelector, useDispatch} from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice'
import { signoutSuccess } from '../redux/user/userSlice';

/**
 * 
 */
export default function Header () {
    const path = useLocation().pathname;
    const {currentUser} = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const {theme} = useSelector((state) => state.theme);
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    const handleSignout = async(e) => {
        try {
          const res = await fetch(`/api/user/signout`, {
            method: 'POST'
          });
          const data = await res.json();
          if (res.ok) {
            dispatch(signoutSuccess());
          } else {
            console.log(data.message);
          }
        } catch (error) {
          console.log(error.message);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };


    return (
        <Navbar className='border-b-2'>
            <Link to="/" className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'>
                <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Jiajun's</span>
                Blog
            </Link>
            <form onSubmit={handleSubmit}>
                <TextInput 
                    type="text"
                    placeholder='Search...'
                    icon={ AiOutlineSearch }
                    className='hidden lg:inline'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value) }
                />
            </form>
            <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                <AiOutlineSearch />
            </Button>

            <div className='flex gap-2 md:order-2'>
                {/* show up as the viewpage is small size or larger */}
                <Button className='w-12 h-12 hidden sm:inline' color='gray' pill onClick={() => dispatch(toggleTheme())}>
                    {theme === 'light' ? <FaSun /> : <FaMoon/> }
                </Button>
                {currentUser ? (
                    <Dropdown 
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar alt='user' img={currentUser.profilePicture} rounded/>
                        }
                        rounded
                    >
                        <Dropdown.Header>
                            <span className="block text-sm">@{currentUser.username}</span>
                            <span className="block truncate text-sm font-medium">{currentUser.email}</span>
                        </Dropdown.Header>
                        <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>
                                Profile
                            </Dropdown.Item>
                        </Link>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleSignout}>
                            Sign out
                        </Dropdown.Item>

                    </Dropdown>
                ): 
                (
                    <Link to='/sign-in'>
                        <Button gradientDuoTone='purpleToBlue' outline>
                            Sign In
                        </Button>
                    </Link>
                )
                }
                <Navbar.Toggle></Navbar.Toggle>
            </div>
            <Navbar.Collapse>
                <Navbar.Link href="/" active={path == '/'}>Home</Navbar.Link>
                <Navbar.Link href="/about" active={path == '/about'}>About</Navbar.Link>
                <Navbar.Link href="/projects" active={path == '/projects'}>Projects</Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
}

// #endregion
