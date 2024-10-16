
import ProfileInfo from './Cards/ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar/SearchBar';
import { useState } from 'react';


const Navbar = ({userInfo,onSearchTask,handleClearSearch}) => {

const [searchQuery, setSearchQuery] = useState("");


    const navigate = useNavigate();

    const onLogout= () => {
        localStorage.clear()
        navigate("/login");
    }

    const handleSearch = () =>{
      if(searchQuery){
        onSearchTask(searchQuery)
      }
    }

    const onClearSearch = () =>{
        setSearchQuery("")
        handleClearSearch()
    }

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
      <h2 className='text-xl font-medium text-black py-2'>Task Manager App</h2>
        <SearchBar
        value={searchQuery}
        onChange={({target})=>{
            setSearchQuery(target.value)
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}/>
        {userInfo ? (

          <ProfileInfo userInfo={userInfo} onLogout={onLogout}/>
        ):(
          <div>
          <button
            className='text-sm text-primary underline'
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
        )}
    </div>
  )
}

export default Navbar
