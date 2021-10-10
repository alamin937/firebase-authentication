import { getAuth,signInWithPopup,GoogleAuthProvider, GithubAuthProvider,signOut,createUserWithEmailAndPassword,signInWithEmailAndPassword,sendEmailVerification,sendPasswordResetEmail    } from "firebase/auth";
import { useState } from "react";
import './App.css';
import simpleAuthentication from './Firebase/firebase.initialize';

simpleAuthentication();

const googleProvider = new GoogleAuthProvider();
const provider = new GithubAuthProvider();

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLogin, setisLogin] = useState(false)
  // const
  const auth = getAuth();
  const [user, setUser] = useState({})
  const handle =()=>{
    signInWithPopup(auth, googleProvider)
    .then(result =>{
      const {displayName, email, photoURL} = result.user;
      const loggedUser = {
        name : displayName,
        email: email,
        photo: photoURL
      }
      setUser(loggedUser);
    })
  }
  const handleGithub = ()=>{
    signInWithPopup(auth, provider)
    .then(result =>{
      const {displayName, photoURL} = result.user;
      const gitUsers ={
        name: displayName,
        photo: photoURL
      }
      setUser(gitUsers)
    })
  }
  const logOut = ()=>{
    signOut(auth)
    .then(result =>{
      setUser({})
    })
  }

  const handleSubmit= e =>{
    e.preventDefault();
    console.log(email,password);
    if(password.length < 6){
      setError('password shoule must be 6 character');
      return;
    }


    isLogin? processLogin(email,password) : createNewUser(email,password)
    
  }

  const processLogin = (email, password) =>{
    signInWithEmailAndPassword(auth,email,password)
    .then(result =>{
      const user = result.user;
      console.log(user)
      setError('')
    })

    .catch(error =>{
      setError(error.message)
    })

  }

  const verifyEmail = ()=>{
    sendEmailVerification(auth.currentUser)
    .then(result=>{
      
    })
  }

  const createNewUser = (email, password) =>{
    createUserWithEmailAndPassword(auth, email, password)
    .then(result =>{
      const user = result.user;
      console.log(user)
      setError('')
      verifyEmail();
    })

    .catch(error =>{
      setError(error.message)
    })
  }

  const handleEmail = e =>{
    setEmail(e.target.value);
  }

 const handlePassword = e=>{
  setPassword(e.target.value)
 }

 const toggleHandle = e =>{
  setisLogin(e.target.checked)
 }



  return (
    <div className="mx-5 mt-5">
    <h1>Please {isLogin ? 'Login' : 'Register'}</h1>
<form onSubmit={handleSubmit}>
  <div className="row mb-3">
    <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
    <div className="col-sm-10">
      <input onBlur={handleEmail} type="email" className="form-control" id="inputEmail3" required/>
    </div>
  </div>
  <div className="row mb-3">
    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
    <div className="col-sm-10">
      <input onBlur={handlePassword} type="password" className="form-control" id="inputPassword3" required/>
    </div>
  </div>
  <div className="row mb-3">
    <div className="col-sm-10 offset-sm-2">
      <div className="form-check">
        <input onChange={toggleHandle} className="form-check-input" type="checkbox" id="gridCheck1"/>
        <label className="form-check-label" htmlFor="gridCheck1">
          Already registered
        </label>
      </div>
    </div>
  </div>
  <div className='row mb-3'>{error}</div>
  <button type="submit" className="btn btn-primary">{isLogin? 'Login' :'Register'} </button>
</form>

    <br />
    <br />
    <br />
    {!user.name ?
       <div>
       <button onClick={handle}>google signin</button>
       <button onClick={handleGithub}>github button</button>
       </div>:
       <button onClick={logOut}>Log Out</button>
    }
     <br />
     {
       user.name && <div>
         <h1>Welcome to {user.name}</h1>
         <h2>Email is: {user.email}</h2>
         <img src={user.photo} alt="" />
         </div>
     }
    </div>
  );
}

export default App;
