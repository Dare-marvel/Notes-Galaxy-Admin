import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
  useToast,
  Container,
} from '@chakra-ui/react';
import { FcGoogle } from 'react-icons/fc';
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const ALLOWED_EMAIL = import.meta.env.VITE_ADMIN_EMAIL ;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const toast = useToast();

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (email !== ALLOWED_EMAIL) {
      toast({
        title: 'Unauthorized',
        description: 'Only admin email is allowed to login',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user.email !== ALLOWED_EMAIL) {
        await auth.signOut();
        toast({
          title: 'Unauthorized',
          description: 'Only admin email is allowed to login',
          status: 'error',
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Container maxW="md" py={10}>
      <VStack spacing={4}>
        <Text fontSize="2xl" fontWeight="bold">Admin Login</Text>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button w="full" colorScheme="blue" onClick={handleEmailAuth}>
          Login with Email
        </Button>
        <Button
          w="full"
          leftIcon={<FcGoogle />}
          onClick={handleGoogleAuth}
          variant="outline"
        >
          Login with Google
        </Button>
      </VStack>
    </Container>
  );
};

export default Login;