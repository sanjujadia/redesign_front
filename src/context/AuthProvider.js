import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
const socket = io(process.env.REACT_APP_BASE_URL);

const AuthContext = createContext();

export async function authenticateUser(email, password) {
  try {
    const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.status) {
      const user = await response.json();
      return user.data;
    } else {
      throw new Error('Authentication failed');
    }
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    // Load user data from localStorage when the component mounts
   
    const loadUserFromLocalStorage = async () => {
      try {
        const storedUser = localStorage.getItem('userdata');
        if (storedUser !== null) {
          setUser(JSON.parse(storedUser));
        }else{
          navigate('/login')
        }
      } catch (error) {
        console.error('Error loading user data from localStorage:', error);
      }
    };

    loadUserFromLocalStorage()
  }, [localStorage.getItem('userdata')]);

  const login = async (email, password) => {
    try {
      // Perform authentication logic here
      const authenticatedUser = await authenticateUser(email, password);
      setUser(authenticatedUser);
      localStorage.setItem('userdata', JSON.stringify(authenticatedUser));
      navigate('/login');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    // Clear the user when logging out and remove it from localStorage
    setUser(null);
    socket.emit("logout", user);
    localStorage.removeItem('userdata');
    navigate('/login');
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('userdata', JSON.stringify(newUserData))
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, updateUser, showSidebar, setShowSidebar}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}



// export function AuthProvider({ children }) {
//   const navigate = useNavigate()
//   var user
  

//   useEffect(() => {
//     // Load user data from localStorage when the component mounts
//     const storedUser = localStorage.getItem('userdata');
//     if (storedUser !== 'undefined') {
//       user = JSON.parse(storedUser);
//     }
//   }, [localStorage.getItem('userdata')]);

//   const login = async (email, password) => {
//     try {
//       // Perform authentication logic here
//       // If authentication is successful, set the user and store it in localStorage
//       // console.log(email,password)
//       const authenticatedUser = await authenticateUser(email, password);
//       // setUser(authenticatedUser);
//       localStorage.setItem('userdata', JSON.stringify(authenticatedUser));
//       // navigate('/')
//     } catch (error) {
//       console.error('Login failed:', error);
//     }
//   };

//   const logout = () => {
//     // Clear the user when logging out and remove it from localStorage
//     // setUser(null);
//     localStorage.removeItem('userdata');
//     navigate('/')
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

