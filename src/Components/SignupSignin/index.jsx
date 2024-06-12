import React, { useState } from 'react';
import "./style.css";
import Input from '../Input/Index';
import Button from '../Button';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from 'react-toastify';
import { auth, db } from '../../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function SignupSignInComponent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  const provider = new GoogleAuthProvider();

  function SignupWithEmail(event) {
    event.preventDefault();
    setLoading(true);

    if (name !== "" && email !== "" && password !== "" && confirmPassword !== "") {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            toast.success("User Created!");
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            setLoading(false);
            createDoc(user);
            navigate("/dashboard");
          })
          .catch((error) => {
            toast.error(error.message);
            setLoading(false);
          });
      } else {
        toast.error("Password and Confirm password don't match");
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  async function createDoc(user) {
    setLoading(true);

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Doc created!");
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        setLoading(false);
      }
    } else {
      // toast.error("Doc already exists");
      setLoading(false);
    }
  }

  function googleAuth() {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        createDoc(user);
        toast.success("User Authenticated!");
        navigate("/dashboard");
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.message);
        setLoading(false);
      });
  }

  function loginUsingEmail(event) {
    event.preventDefault();
    setLoading(true);
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          toast.success("User Logged In!");
          navigate("/dashboard");
          setLoading(false);
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  return (
    <>
      {loginForm ? (
        <div className='signup-wrapper'>
          <h2 className='title'>
            Login On <span style={{ color: "var(--theme)" }}>Gautam Financer</span>
          </h2>
          <form>
            <Input
              type="email"
              label="Email"
              state={email}
              setState={setEmail}
              placeholder="Sanskargautam93@yahoo.com"
            />
            <Input
              type="password"
              label="Password"
              state={password}
              setState={setPassword}
              placeholder="Example@123"
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Login using Email and Password"}
              onClick={loginUsingEmail}
            />
            <p className='p-login'>or</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading..." : "Login using Google"}
              blue={true}
            />
            <p className='p-login'
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Or don't Have An Account? Click Here
            </p>
          </form>
        </div>
      ) : (
        <div className='signup-wrapper'>
          <h2 className='title'>
            Sign Up on <span style={{ color: "var(--theme)" }}>Gautam Financer</span>
          </h2>
          <form>
            <Input
              label="Full Name"
              state={name}
              setState={setName}
              placeholder="Sanskar Gautam"
              type="text"
            />
            <Input
              type="email"
              label="Email"
              state={email}
              setState={setEmail}
              placeholder="Sanskargautam93@yahoo.com"
            />
            <Input
              type="password"
              label="Password"
              state={password}
              setState={setPassword}
              placeholder="Example@123"
            />
            <Input
              type="password"
              label="Confirm Password"
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder="Example@123"
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Signup using Email and Password"}
              onClick={SignupWithEmail}
            />
            <p className='p-login'>or</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading..." : "Signup using Google"}
              blue={true}
            />
            <p className='p-login'
              style={{ cursor: "pointer" }}
              onClick={() => setLoginForm(!loginForm)}
            >
              Or already have An Account? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSignInComponent;
