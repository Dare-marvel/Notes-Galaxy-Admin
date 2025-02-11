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
} from '@chakra-ui/react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { FiFile } from 'react-icons/fi';

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

  return (
    <Box p={4}>
      <Tabs orientation="vertical" variant="line">
        <TabList minW="200px" borderRight="1px" borderColor="gray.200">
          {subjects.map((subject) => (
            <Tab key={subject.id}>{subject.name}</Tab>
          ))}
        </TabList>

        <TabPanels>
          {subjects.map((subject) => (
            <TabPanel key={subject.id}>
              <Text fontSize="2xl" mb={4}>{subject.name}</Text>
              <Accordion allowMultiple>
                {subject.users?.map((user, index) => (
                  <AccordionItem key={index}>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        {user.name}
                      </Box>
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
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Dashboard;