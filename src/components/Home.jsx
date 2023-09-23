import React, { Fragment } from "react";

import {
  Center,
  HStack,
  Flex,
  Box,
  Input,
  Button,
  ButtonGroup,
  Text,
  Heading,
  CardBody,
  CardHeader,
  Card,
  Stack,
  StackDivider,
  // Divider,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  // ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import Vote from "./Vote";

const Home = () => {
  const initialState = {
    current_page: 1,
    number_of_pages: 0,
    current_page_search: 1,
    number_of_pages_search: 0,
    search: false,
    items_per_page: 2,
    polls: [],
    active_poll: null,
  };
  const [state, setState] = React.useState(initialState);
  const api_url = "http://127.0.0.1:8000/polls/";
  //   const api_url = process.env.REACT_APP_API_URL;

  const [searchValue, setSearchValue] = React.useState("");
  const handleSearchChange = (event) => setSearchValue(event.target.value);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handlePollClick = () => {
    // Should check expiry first
    // const poll_date = getDateFromStr(state.active_poll.exp_date);
    // let new_date = new Date();

    // var m = new_date.getMonth() + 1;
    // var d = new_date.getDay();
    // var y = new_date.getFullYear();
    // let today = new Date(y, m, d);

    // console.log(today);
    // console.log(poll_date);
    // console.log(today < poll_date);

    // if (today < poll_date) {
    //   onOpen();
    // }
    onOpen();
  };

  // Logic for displaying page numbers
  const pageNumbers = [];
  for (let i = 1; i <= state.number_of_pages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = pageNumbers.map((number) => {
    return (
      <Button
        key={number}
        id={number}
        onClick={() =>
          // handlePageClick(number)
          setState({ ...state, current_page: number })
        }
        bg={number === state.current_page ? "blue.400" : ""}
        // colorScheme={(number === state.current_page)?"blue":""}

        // bg="blue.400"
      >
        {number}
      </Button>
    );
  });

  const getDateFromStr = (dateStr) => {
    return new Date(dateStr);
  };

  // const handleSearchButton = () => {
  //   getItems(`search/${searchValue}/`);
  // };

  const handleSearchButton = () => {
    // console.log('in fetch');
    // console.log('page number:', state.current_page);
    // // console.log('in fetch')
    fetch(
      api_url +
        `search/${searchValue}/?items_per_page=${state.items_per_page}&current_page=${state.current_page_search}`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then((resJson) => {
        // console.log('resJson', resJson);
        let data = {
          ...state,
          polls: resJson.data,
          number_of_pages: resJson.number_of_pages,
          current_page: 1,
          search: true,
        };
        setState(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getItems = () => {
    // console.log('in fetch');
    // console.log('page number:', state.current_page);
    // // console.log('in fetch')
    fetch(
      api_url +
        `?items_per_page=${state.items_per_page}&current_page=${state.current_page}`
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then((resJson) => {
        // console.log('resJson', resJson);
        let data = {
          ...state,
          polls: resJson.data,
          number_of_pages: resJson.number_of_pages,
          current_page_search: 1,
          search: false,
        };
        setState(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  React.useEffect(() => {
    // console.log('state', state);
    // fetch(api_url + 'users?page_size=5&current_page=1', {
    if (!state.search) {
      getItems();
    } else {
      handleSearchButton();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.current_page]);

  return (
    <Fragment>
      <Flex>
        <Box onClick={getItems} p="4">
          <Text as="b" fontSize="3xl">
            Voting System
          </Text>
        </Box>
        <Spacer />
        <HStack spacing="24px">
          <Input
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search"
            size="lg"
          />
          <Button onClick={handleSearchButton} colorScheme="teal" size="lg">
            GO
          </Button>
        </HStack>
      </Flex>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="6xl"
        scrollBehavior="inside"
        isCentered
        // p={10}
        // pb={30}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader alignSelf={"center"}>
            <Text as="b" fontSize="2xl">
              Vote
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={10}>
            <Vote poll={state.active_poll} />
          </ModalBody>

          {/* <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter> */}
        </ModalContent>
      </Modal>
      {/* <Center>  */}
      {state.polls.length > 0 &&
        state.polls.map((poll) => (
          <VStack m={10} key={poll.id}>
            <Box
              onClick={() => {
                setState({ ...state, active_poll: poll });
                handlePollClick();
              }}
              w="50%"
            >
              {/* <Card bg="#BCE8F5" border="1px" borderColor="gray.400"> */}
              <Card bg="orange.100" border="1px" borderColor="gray.400">
                <CardHeader>
                  <Heading size="md">{poll.title}</Heading>
                </CardHeader>

                <CardBody>
                  <Stack divider={<StackDivider />} spacing="4">
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Description
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        {poll.description}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size="xs" textTransform="uppercase">
                        Expiry Date
                      </Heading>
                      <Text pt="2" fontSize="sm">
                        {getDateFromStr(poll.exp_date).toLocaleString()}
                      </Text>
                    </Box>
                  </Stack>
                </CardBody>
              </Card>
              {/* <Center height="50px">
                <Divider orientation="vertical" />
              </Center> */}
            </Box>
          </VStack>
        ))}
      {/* </Center> */}
      <Center>
        <ButtonGroup m={5} size="sm" isAttached variant="outline">
          <Button
            // colorScheme="teal"
            isDisabled={state.current_page === 1 ? true : false}
            onClick={() =>
              setState({ ...state, current_page: state.current_page - 1 })
            }
          >
            Prev Page
          </Button>
          {renderPageNumbers}
          <Button
            // colorScheme="teal"
            isDisabled={
              state.current_page === state.number_of_pages ? true : false
            }
            onClick={() =>
              setState({ ...state, current_page: state.current_page + 1 })
            }
          >
            Next Page
          </Button>
        </ButtonGroup>
      </Center>
    </Fragment>
  );
};

export default Home;
