import { Alert, Button, TextInput } from 'flowbite-react';
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function DashProfile() {
  const {currentUser} = useSelector(state => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const imageRef = useRef();
  const [imageUploadingProgress, setImageUploadingProgress] = useState(null);
  const [imageUploadingError, setImageUploadingError] = useState(null);

  console.log(imageUploadingProgress, imageUploadingError);

  const handleImageChange = (event) => {
  
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  
  }
  
  useEffect(()=>{
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  // use firebase to store images because integrating with CDN (allows faster deliver of files), only authenticated users to upload and access their profile pictures. 
  const uploadImage = async () => {
    setImageUploadingError(null);
    const storage = getStorage(app);
    // add Date to make the image name unique for preventing duplicate image
    const fileName = new Date().getTime() + imageFile.name;
    // create a refernece to the specif storage or file in the firebase
    const storageRef = ref(storage, fileName);
    // function that actually upload the image
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    // used for getting the uploading progress
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // toFixed: remove decimal
        setImageUploadingProgress(progress.toFixed(0));

      },
      (error) => {
        setImageUploadingError("Could not upload image (File must be less than 2mb)");
        setImageUploadingProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
        });
      }
    );
  }


  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
      <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-4'>
        <input type='file' accept='image/*' onChange={handleImageChange} ref={imageRef} hidden/>
        <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={() => {imageRef.current.click()}}>
          {imageUploadingProgress && (<CircularProgressbar value={imageUploadingProgress || 0} 
          text={`${imageUploadingProgress}%`} strokeWidth={5} styles={{root:{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
          }, 
          path:{
            stroke: `rgba(62, 152, 199, ${imageUploadingProgress / 100})`
          }}}/>)}
          <img src = {imageFileUrl || currentUser.profilePicture} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageUploadingProgress && imageUploadingProgress < 100 && 'opacity-60'}`} />
        </div>
        {imageUploadingError && <Alert color='failure'>{imageUploadingError}</Alert>}
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username}/>
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email}/>
        <TextInput type='password' id='password' placeholder='password' />
        <Button type='submit' gradientDuoTone='purpleToBlue' outline> 
          Update
        </Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer'> Delete Acount</span>
        <span className='cursor-pointer'> Sign Out</span>
      </div>
    </div>
  )
}
