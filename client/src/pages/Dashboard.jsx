import React, { useState } from 'react'

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashProfile from '../components/DashProfile';
import DashSidebar from '../components/DashSidebar.jsx';
import DashPosts from '../components/DashPosts.jsx';
import DashUsers from '../components/DashUsers';
import DashComments from '../components/DashComments';
import Statistics from '../components/Statistics';
export default function Dashboard() {
  const [tab, setTab] = useState('');
  const location = useLocation();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search])
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* Side Bar */}
        <DashSidebar tab={tab}/>
      </div>
      {/* Profile */}
      {tab === 'profile' && <DashProfile/> }
      {tab === 'posts' && <DashPosts /> }
      {tab === 'users' && <DashUsers /> }
      {tab === 'comments' && <DashComments /> }
      {tab === 'stat' && <Statistics /> }
    </div>
  )
}
