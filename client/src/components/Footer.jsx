import { Footer } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom';
import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";


export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
        <div className='w-full max-x-7xl mx-auto'> 
            <div className='grid w-full justify-between sm:flex sm:justify-between md:grid-cols-1'>
                <div className='mt-5'>
                    <Link to="/" className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Jiajun's</span>
                        Blog
                    </Link>
                </div>
                <div className='grid grid-cols-2 gap-8 sm: mt-4 sm:grid-cols-3 sm:gap-6'>
                    <div>
                        <Footer.Title title="about" />
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href='https://www.100jsprojects.com'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                100 JS Projects
                            </Footer.Link>

                            <Footer.Link
                                href='/about'
                                target='_blank'
                                rel='noopener noreferrer'
                                >
                                Jiajun's Blog
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>

                    <div>
                        <Footer.Title title="Follow Us" />
                        <Footer.LinkGroup col>
                            <Footer.Link
                                href='https://www.github.com/JiaJ-LLLL'
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                Github
                            </Footer.Link>

                            <Footer.Link
                                href='https://www.linkedin.com/in/jiajun-li-b3280424b/'
                                target='_blank'
                                rel='noopener noreferrer'
                                >
                                Linkedin
                            </Footer.Link>
                        </Footer.LinkGroup>
                    </div>

                    <div>
                        <Footer.Title title='Legal' />
                        <Footer.LinkGroup col>
                            <Footer.Link href='#'>Privacy Policy</Footer.Link>
                            <Footer.Link href='#'>Terms &amp; Conditions</Footer.Link>
                        </Footer.LinkGroup>
                    </div>

                </div>
            </div>


            <Footer.Divider />
            <div className="w-full sm:flex sm:items-center sm:justify-between">
                <Footer.Copyright href="#" by="Jiajun's blog" year={new Date().getFullYear()} />
                <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
                    <Footer.Icon href="#" icon={BsFacebook} />
                    <Footer.Icon href="#" icon={BsInstagram} />
                    <Footer.Icon href="#" icon={BsTwitter} />
                    <Footer.Icon href="https://www.github.com/JiaJ-LLLL" icon={BsGithub} />
                    <Footer.Icon href="#" icon={BsDribbble} />
                </div>
            </div>
        </div>
    </Footer>
  );
}
