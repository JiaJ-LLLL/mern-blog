import { async } from '@firebase/util';
import { Alert, Button, TextInput, Textarea } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import {useSelector} from  'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';
export default function CommentSection(props) {
  const postId = props.postId;
  const {currentUser} = useSelector((state) => state.user);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(null);

  const [comments, setComments] = useState([]);

  const handleClick = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }

    try {
      const res = await fetch('/api/comment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({content: comment, postId, userId: currentUser._id}),
      });
  
      // const data = await res.json();
      if (res.ok) {
        setComment('');
        setCommentError(null);
        setComments([data, ...comments]);
      }
    } catch (error) {
      setCommentError(error.message);
    }
  }

  const commentArray = comments.map((comment, index) => {
    return <CommentItem comment={comment} key={index}/>
  })

  console.log(comments);
  useEffect(()=> {
    const getComments = async () => {
      try {
        const res = await fetch( `/api/comment/getPostComments/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setComments(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    getComments();
  }, [postId])

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ? 
      (<div className='flex items-center gap-1 my-5 text-grey-500 text-sm'> 
        <p>
          Signed in as 
        </p> 
        <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt={currentUser.username}/>
        <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-500 hover:underline'>
          @{currentUser.username}
        </Link>
      </div>) :
      (<div className='text-sm text-teal-500 my-5 flex gap-1'>
        You must be signed in to comment. 
        <Link className='text-blue-500 hover:underline' to={'/sign-in'}>
          Sign in
        </Link>
      </div>)}

      {currentUser && (
        <form className='border border-teal-500 rounded-md p-3'>
          <Textarea 
            placeholder='Add a comment...'
            rows='3'
            maxLength='200'
            className='flex justify-between items-center mt-5'
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className='text-gray-500 text-xs'>
            <p>{200 - comment.length} characters remaining</p>
            <Button onClick={handleClick} outline gradientDuoTone='purpleToBlue' type='submit'>
              Submit
            </Button>
          </div>
          {commentError && <Alert color='failure' className='mt-5'>commentError</Alert>}
        </form>
      )}
      {comments.length == 1 ? (
          <p className='text-sm my-5'>No comments yet</p>
        ) : (
          <>
            <div className='text-sm my-5 flex items-center gap-1'>
              <p>Comments</p>
              <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                <p>{comments.length}</p>
              </div>
            </div>
            {commentArray}
          </>
        )}
    </div>
  )
}

function CommentItem (props) {
  const comment = props.comment;
  const [user, setUser] = useState({});
  useEffect(()=> {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/user/${comment.userId}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    getUser();
  }, [comment])
  
  return (
    <div className='flex p-4 border-b dark:border-gray-600 text-sm'>
      <div className='flex-shrink-0 mr-3'>
        <img className='w-10 h-10 rounded-full bg-bray-200' src={user.profilePicture} alt={user.username}/>
      </div>

      <div className='flex-1'>
        <div className='flex items-center mb-1'>
          <span className='font-bold mr-1 text-xs truncate'>
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className='text-gray-500 text-xs '>
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        <p className='text-gray-500 pb-2'>{comment.content}</p>
      </div>
    </div>
  )
}
