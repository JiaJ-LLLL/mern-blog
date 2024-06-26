import { Alert, Button, Modal, TextInput } from 'flowbite-react';
import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import { app } from '../firebase';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { HiOutlineExclamationCircle } from "react-icons/hi";

import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function DashProfile() {
  const {currentUser, error} = useSelector(state => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const imageRef = useRef();
  const [imageUploadingProgress, setImageUploadingProgress] = useState(null);
  const [imageUploadingError, setImageUploadingError] = useState(null);

  const [formData, setFormData] = useState({});

  const [imageIsUploading, setImageIsUploading] = useState(false);

  const dispatch = useDispatch();

  const [updateProfileSuccess, setUpdateProfileSuccess] = useState(null);
  const [updateProfileFail, setUpdateProfileFail] = useState(null);

  // console.log(imageUploadingProgress, imageUploadingError);
  const [showModal, setShowModal] = useState(false);

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
    setImageIsUploading(true);
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
        setImageIsUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
          setFormData({...formData, profilePicture: downloadUrl});
          setImageIsUploading(false);
        });
      }
    );
  }

  const handleChange = (e) => {
    setUpdateProfileSuccess(null);
    setUpdateProfileFail(null);
    setFormData({...formData, [e.target.id]: e.target.value});
  }

  const handleClick = async(e) => {
    e.preventDefault();
    setUpdateProfileFail(null);
    setUpdateProfileSuccess(null);
    if (!formData) {
      setUpdateProfileFail("No changes made")
      return;
    }
    if (imageIsUploading) {
      setUpdateProfileFail("Please wait for image to upload")
      return;
    }
    try {
      // udpate the redux 
      dispatch(updateStart());
      // update the database
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(updateSuccess(data));
        setUpdateProfileSuccess("User's profile updated succesfully");
      } else {
        dispatch(updateFailure(data.message));
        setUpdateProfileFail(data.message);
      }
    } catch (error) {
      dispatch(updateFailure());
    }

  }

  const handleDeleteUser = async(e) => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(deleteUserSuccess(data));
      } else {
        dispatch(deleteUserFailure(data.message))
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
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
        {updateProfileSuccess && <Alert color='success'>{updateProfileSuccess}</Alert>}
        {updateProfileFail && <Alert color='failure'>{updateProfileFail}</Alert>}
        {error && <Alert color='failure'>{error}</Alert>}
        <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}/>
        <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
        <TextInput type='password' id='password' placeholder='password' onChange={handleChange}/>
        <Button onClick={handleClick} type='submit' gradientDuoTone='purpleToBlue' outline> 
          Update
        </Button>
      </form>
      <div className='text-red-500 flex justify-between mt-5'>
        <span className='cursor-pointer' onClick={()=> {setShowModal(true)}}> Delete Acount</span>
        <span className='cursor-pointer'> Sign Out</span>
      </div>
      <Modal show={showModal} onClose={()=>{setShowModal(false)}} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteUser}>
                "Yes, I'm sure"
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
