import { useState } from "react";
import { createContext } from "react";
export const AuthContext = createContext();


export const AuthProvider = ({children}) =>{
  const [loggedIn,setLoggedIn]=useState(false);
  return <AuthContext.Provider value={{loggedIn,setLoggedIn}}>
     {children}
  </AuthContext.Provider>
}