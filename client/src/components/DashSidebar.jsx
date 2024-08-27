
import { Sidebar } from 'flowbite-react';
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiAnnotation, HiChartPie } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useSelector, useDispatch} from 'react-redux';

export default function DashSidebar(props) {
  const dispatch = useDispatch();
  const {currentUser} = useSelector(state => state.user);
  const handleSignout = async(e) => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        dispatch(signoutSuccess());
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
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={props.tab === 'profile'}
              icon={HiUser}
              label={currentUser.isAdmin ? 'Admin' : 'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser.isAdmin &&           
          (<Link to='/dashboard?tab=posts'>
            <Sidebar.Item active={props.tab === 'posts'} icon={HiDocumentText} as='div'>
              Posts
            </Sidebar.Item>
          </Link>)}

          {currentUser.isAdmin &&           
          (<>
            <Link to='/dashboard?tab=users'>
              <Sidebar.Item active={props.tab === 'users'} icon={HiOutlineUserGroup} as='div'>
                Users
              </Sidebar.Item>
            </Link>

            <Link to='/dashboard?tab=comments'>
              <Sidebar.Item active={props.tab === 'comments'} icon={HiAnnotation} as='div'>
                Comments
              </Sidebar.Item>
            </Link>

            <Link to='/dashboard?tab=stat'>
              <Sidebar.Item active={props.tab === 'stat' || !props.tab} icon={HiChartPie} as='div'>
                Statistics
              </Sidebar.Item>
            </Link>
          </>)}
          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}