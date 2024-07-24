import React, { useState, useRef, useEffect } from 'react';
import {Alert, Button, FileInput, Select, TextInput} from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getDownloadURL, getStorage, uploadBytesResumable } from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { app } from '../firebase';
import { ref } from 'firebase/storage';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function UpdatePost() {
    const [imageFile, setImageFile] = useState(null);
    const [imageUploadingProgress, setImageUploadingProgress] = useState(null);
    const [imageUploadingError, setImageUploadingError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        category: 'uncategorized',
        content: '',
        image: ''
      });
    const [publishError, setPublishError] = useState(null);
    const navigate = useNavigate();
    const { postId } = useParams();

    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                
                const res = await fetch(`/api/post/getposts?postId=${postId}`);
                const data = await res.json();
                console.log(data);
                if (!res.ok) {
                    console.log(data.message);
                    setPublishError(data.message);
                    return;
                }
                if (res.ok) {
                    setPublishError(null);
                    setFormData(data.posts[0]);
                }
            } catch (error) {
                console.log(error.message);
            }
        }
        fetchPost();
    }, [postId])


    const handleUploadImage = async () => {
        try {
            if (!imageFile) {
                setImageUploadingError('Please select an image first');
                return; 
            }
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
                },
                () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                    setFormData({...formData, imageFile: downloadUrl});
                    setImageUploadingProgress(null);
                    setImageUploadingError(null);
                });
                }
            );
        } catch (error) {
            setImageUploadingError("Image upload failed");
            setImageUploadingProgress(null);
            console.log(error);
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setImageUploadingError(null);
        try {
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            console.log(data);
            console.log(res);
            if (res.ok) {
                setPublishError(null);
                navigate(`/post/${data.slug}`)
            } else {
                setPublishError(data.message);
            }

        } catch (error) {
            setPublishError('Something went wrong when updating the post');
        }
    }

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Update post</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-4 sm:flex-row justify-between'>
                <TextInput value={formData.title} onChange={(e) => {setFormData({...formData, title: e.target.value})}} type='text' placeholder='Title' required id='title' className='flex-1'/>
                <Select value={formData.category} onChange={(e) => {setFormData({...formData, category: e.target.value})}}>
                    <option value='uncategorized'>Select a category</option>
                    <option value='javascript'>JavaScript</option>
                    <option value='react'>React.js</option>
                </Select>
            </div>
            <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
                <FileInput type='file' accept='image/*' onChange={(e) => {setImageFile(e.target.files[0])}}/>
                <Button gradientDuoTone='purpleToBlue' size='sm' outline onClick={handleUploadImage} disabled={imageUploadingProgress}>
                    {imageUploadingProgress ? 
                    (<div className='w-16 h-16'> 
                        <CircularProgressbar value={imageUploadingProgress} text={`${imageUploadingProgress || 0}%`}/>
                    </div>) : ('Update Image')}
                </Button>
            </div>
            {imageUploadingError && <Alert color='failure'>{imageUploadingError}</Alert>}
            {formData.image && (<img src={formData.image} alt='upload' className='w-full h-72 object-cover'/>)}
            {publishError && <Alert color='failure'> {publishError} </Alert>}
            <ReactQuill value={formData.content} theme="snow" placeholder='Write something...' className='h-72 mb-12' onChange={(value) => {setFormData({...formData, content: value})}} />
            <Button type='submit' gradientDuoTone='purpleToPink'>
                Update
            </Button>
        </form>
    </div>
  );
}
