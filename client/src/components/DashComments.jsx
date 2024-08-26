import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Modal, Button} from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashComments() {
  const {currentUser} = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [isShowMore, setIsShowMore] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch('/api/comment/getComments');
        const data = await res.json();

        if (res.ok) {
          if (data.comments.length < 9) {
            setIsShowMore(false);
          }
          setComments(data.comments);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    if (currentUser.isAdmin) {
        fetchComments();
    }
  }, [currentUser._id]);


  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments]);
        if (data.comments.length < 9) {
          setIsShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const commentItems = comments.map((comment) => (
      <Table.Body key={comment._id} className='divide-y'>
        <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
          <Table.Cell>
            {new Date(comment.updatedAt).toLocaleDateString()}
          </Table.Cell>

          <Table.Cell>
            {comment.content}
          </Table.Cell>

          <Table.Cell>
            {comment.numberOfLikes}
          </Table.Cell>

          <Table.Cell>
            {comment.postId}
          </Table.Cell>

          <Table.Cell>
            {comment.userId}
          </Table.Cell>

          <Table.Cell >
            <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={()=>{setShowModal(true); setCommentIdToDelete(comment._id)}}>Delete</span>
          </Table.Cell>

        </Table.Row>
      </Table.Body>
    )
  )

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && comments.length > 0 ? (
        <div>
          <Table hoverable className='shadow-md'>
          <Table.Head>
            <Table.HeadCell>Date Updated</Table.HeadCell>
            <Table.HeadCell>Comment content</Table.HeadCell>
            <Table.HeadCell>Number of likes</Table.HeadCell>
            <Table.HeadCell>PostId</Table.HeadCell>
            <Table.HeadCell>UserId</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          { commentItems }
        </Table>
        {isShowMore && (
          <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
            Show More
          </button>
        )}
        </div>
      ) : (
        <p> There is no comments exit!</p>
      )}
      <Modal show={showModal} onClose={()=>{setShowModal(false)}} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteComment}>
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

