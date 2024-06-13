import React, { useEffect } from 'react'
import "./style.css"
import { auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import userImg from '../../assets/user.svg'

function Header() {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  useEffect(()=>{
    if(user){
      navigate("/dashboard")
    }
  },[user,loading])

  function logoutFnc(){
    try {
      signOut(auth)
      .then(() => {
        // Sign-out successful.
        toast.success("Logged Out Successfully!")
        navigate("/");
      }).catch((error) => {
        // An error happened.
        toast.error(error.message)
      });
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div className='navbar'>
      <p className='logo'>Gautam Financer</p>
      {user && (
          <div style={{display:"flex",alignItems:"center",gap:"0.75rem"}}>
            <img
            src={user.photoURL? user.photoURL: userImg}
            style={{borderRadius:"50%", height: "2rem", width:"2rem"}}
            />
        <p className='logo link' onClick={logoutFnc}>Logout</p>
        </div> 
      )}
     
    </div>
  )
}

export default Header;
