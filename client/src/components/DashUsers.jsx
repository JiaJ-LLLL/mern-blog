import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Modal, Button} from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function DashUsers() {
  const {currentUser} = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [isShowMore, setIsShowMore] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/user/getusers');
        const data = await res.json();

        if (res.ok) {
          if (data.users.length < 9) {
            setIsShowMore(false);
          }
          setUsers(data.users);
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    if (currentUser.isAdmin) {
        fetchUsers();
    }
  }, [currentUser._id])

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/users/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setIsShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  const userItems = users.map((user) => (
      <Table.Body key={user._id} className='divide-y'>
        <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
          <Table.Cell>
            {new Date(user.createdAt).toLocaleDateString()}
          </Table.Cell>

          <Table.Cell>
              <img src={user.profilePicture} alt={user.username} className='w-20 h-10 object-cover bg-gray-500 rounded-full'/>
          </Table.Cell>

          <Table.Cell>
            {user.username}
          </Table.Cell>

          <Table.Cell>
            {user.email}
          </Table.Cell>

          <Table.Cell>
            {user.isAdmin ? <FaCheck className='text-green-500'/> : <FaTimes className='text-red-500'/>}
          </Table.Cell>

          <Table.Cell >
            <span className='font-medium text-red-500 hover:underline cursor-pointer' onClick={()=>{setShowModal(true); setUserIdToDelete(user._id)}}>Delete</span>
          </Table.Cell>

        </Table.Row>
      </Table.Body>
    )
  )

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <div>
          <Table hoverable className='shadow-md'>
          <Table.Head>
            <Table.HeadCell>Date Created</Table.HeadCell>
            <Table.HeadCell>User Image</Table.HeadCell>
            <Table.HeadCell>User Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Admin</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          { userItems }
        </Table>
        {isShowMore && (
          <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>
            Show More
          </button>
        )}
        </div>
      ) : (
        <p> There is no user exit!</p>
      )}
      <Modal show={showModal} onClose={()=>{setShowModal(false)}} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this user?
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

