import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebaseConfig';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {user ? <Dashboard /> : <Login />}
    </>
  );
}

export default App;