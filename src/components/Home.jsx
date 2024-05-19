import React from 'react'
import appFirebase from './creadentials'
import { getAuth, signOut } from 'firebase/auth'
const auth = getAuth(appFirebase)

const Home = () => {


  return (
    <>
      <div>Home</div>
      <button onClick={() => signOut(auth)}>cerrar sesión</button>
    </>
  )
}

export default Home