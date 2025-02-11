import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  Link,
  HStack,
  VStack,
  Divider,
  Flex,
  Button,
  Spinner,
  IconButton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../config/firebaseConfig';
import { FiLogOut, FiFile } from 'react-icons/fi';

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'subjects'));
        const subjectsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={4}>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="2xl" fontWeight="bold">Admin Dashboard</Text>
        <IconButton
          icon={<FiLogOut />}
          colorScheme="red"
          onClick={handleLogout}
          aria-label="Logout"
          size="lg"
        />
      </Flex>
      
      <Tabs orientation="vertical" variant="enclosed" isLazy>
        <TabList minW="250px" borderRight="1px" borderColor="gray.200">
          {subjects.map((subject) => (
            <Tab
              key={subject.id}
              _selected={{ bg: 'blue.500', color: 'white' }}
              _hover={{ bg: 'blue.400', color: 'white' }}
            >
              {subject.name}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {subjects.map((subject) => (
            <TabPanel key={subject.id}>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Text fontSize="2xl" fontWeight="bold" mb={4}>{subject.name}</Text>
                <Accordion allowMultiple>
                  {subject.users?.map((user, index) => (
                    <AccordionItem key={index} borderRadius="md" border="1px solid" borderColor="gray.300" _hover={{ shadow: 'md' }}>
                      <AccordionButton _expanded={{ bg: 'blue.50' }}>
                        <Box flex="1" textAlign="left" fontWeight="bold">{user.name}</Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel>
                        <Flex>
                          <VStack align="stretch" flex="1">
                            <Text fontWeight="bold">Email:</Text>
                            <Text>{user.email}</Text>
                            <Text fontWeight="bold" mt={2}>Message:</Text>
                            <Text>{user.message}</Text>
                          </VStack>
                          <Divider orientation="vertical" mx={4} />
                          <VStack align="stretch" flex="1">
                            <Text fontWeight="bold">Files:</Text>
                            {user.files?.map((file, fileIndex) => (
                              <Link
                                key={fileIndex}
                                href={file}
                                isExternal
                                color="blue.500"
                                display="flex"
                                alignItems="center"
                                _hover={{ textDecoration: 'underline' }}
                              >
                                <FiFile style={{ marginRight: '8px' }} />
                                File {fileIndex + 1}
                              </Link>
                            ))}
                          </VStack>
                        </Flex>
                      </AccordionPanel>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Dashboard;
