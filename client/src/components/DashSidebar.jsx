
import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { singoutSuccess } from '../redux/user/userSlice';
import { useSelector, useDispatch} from 'react-redux';

export default function DashSidebar(props) {
  const dispatch = useDispatch();
  const handleSignout = async(e) => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(singoutSuccess());
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message);
    }
}
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={props.tab === 'profile'}
              icon={HiUser}
              label={'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}