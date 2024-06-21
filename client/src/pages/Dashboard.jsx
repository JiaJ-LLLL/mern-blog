import React, { useState } from 'react'

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashProfile from '../components/DashProfile';
import DashSidebar from '../components/DashSidebar.jsx';
export default function Dashboard() {
  const [tab, setTab] = useState('');
  const location = useLocation();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    console.log(tabFromUrl);
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
    </div>
  )
}
