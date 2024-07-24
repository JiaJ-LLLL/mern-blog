import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Modal, Button} from "flowbite-react";
import {Link} from 'react-router-dom'
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashPosts() {
  const {currentUser} = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [isShowMore, setIsShowMore] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();

        if (res.ok) {
          if (data.posts.length < 9) {
            setIsShowMore(false);
          }
          setUserPosts(data.posts);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id])

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setIsShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const postItems = userPosts.map((post) => (
      <Table.Body key={post._id} className='divide-y'>
        <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
          <Table.Cell>
            {new Date(post.updatedAt).toLocaleDateString()}
          </Table.Cell>

          <Table.Cell>
            <Link to={`/post/${post.slug}`}>
              <img src={post.image} alt={post.title} className='w-20 h-10 object-cover bg-gray-500'/>
            </Link>
          </Table.Cell>

          <Table.Cell>
            <Link to={`/post/${post.slug}`} className='font-medium text-gray-900 dark:text-white'>
                {post.title}
            </Link>
          </Table.Cell>

          <Table.Cell>
            {post.category}
          </Table.Cell>

          <Table.Cell >
            <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={()=>{setShowModal(true); setPostIdToDelete(post._id)}}>Delete</span>
          </Table.Cell>

          <Table.Cell>
            <Link to={`/update-post/${post._id}`} className='text-teal-500'>
              <span>Edit</span>
            </Link>
          </Table.Cell>

        </Table.Row>
      </Table.Body>
    )
  )

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <div>
          <Table hoverable className='shadow-md'>
          <Table.Head>
            <Table.HeadCell>Date Updated</Table.HeadCell>
            <Table.HeadCell>Post Image</Table.HeadCell>
            <Table.HeadCell>Post Title</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>
              <span>Edit</span>
            </Table.HeadCell>
          </Table.Head>
          {postItems }
        </Table>
        {isShowMore && (
          <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
            Show More
          </button>
        )}
        </div>
      ) : (
        <p> You have no posts yet!</p>
      )}
      <Modal show={showModal} onClose={()=>{setShowModal(false)}} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
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

