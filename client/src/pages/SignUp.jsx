import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import OAuth from '../components/OAuth';

/**
 * 
 */
const SignUp = () => {
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        setFormData({...formData, [event.target.id]: event.target.value.trim()});
    }
    console.log(formData);

    const handleSubmit = async(event) => {
        setIsLoading(true);
        setErrorMessage(null);
        // prevent the page from refreshing
        event.preventDefault();
        if (!formData.username || !formData.email || !formData.password) {
            return setErrorMessage('Please fill out all fields');
        }
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                return setErrorMessage(data.message);
            }
            setIsLoading(false);
            if (res.ok) {
                navigate('/sign-in');
            }
        } catch (error) {
            setErrorMessage(data.message);
            setIsLoading(false);
        }

    }

    return (
        <div className='min-h-screen mt-20'>
            <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
                {/* left side of the page */}
                <div className='flex-1'>
                    <Link to="/" className='font-bold dark:text-white text-4xl'>
                        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  rounded-lg text-white'>
                            Jiajun's
                        </span>
                        Blog
                    </Link>
                    <p className='text-sm mt-5'>
                        This is a demo page. You can sign up with your email and password
                        or with Google.
                    </p>
                </div>
                {/* right side of the page */}
                <div className='flex-1'>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                        <div>
                            <Label value='Your username'/>
                            <TextInput type='text' placeholder='Username' id='username' onChange={handleChange}/>
                        </div>
                        <div>
                            <Label value='Your email'/>
                            <TextInput type='email' placeholder='name@componany.com' id='email' onChange={handleChange}/>
                        </div>
                        <div>
                            <Label value='Your password'/>
                            <TextInput type='password' placeholder='Password' id='password' onChange={handleChange}/>
                        </div>
                        <Button gradientDuoTone='purpleToPink' type='submit' disabled={isLoading}>
                                {isLoading ? (
                                   <>
                                    <Spinner size='sm' />
                                    <span className='pl-3'>Loading...</span>
                                   </>
                                ) :'Sign Up'
                            }
                        </Button>
                        <OAuth />
                    </form>
                    
                    <div className='flex gap-2 text-sm mt-5'>
                        <span>Having an account?</span>
                        <Link to='/sign-in' className='text-blue-500'>
                            Sign In
                        </Link>
                    </div>
                    {
                        errorMessage && (
                            <Alert className='mt-5' color='failure'>
                                {errorMessage}
                            </Alert>
                        )
                    }
                </div>
            </div>
        </div>
    );
}


export default SignUp;