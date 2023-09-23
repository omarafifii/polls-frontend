/* eslint-disable react/prop-types */
// eslint-disable-next-line react/prop-types
import React from "react";
import {
  Box,
  Input,
  Button,
  // ButtonGroup,
  Text,
  Heading,
  CardBody,
  CardHeader,
  Card,
  // Stack,
  // StackDivider,
  // Divider,
  // Spacer,
  HStack,
  Center,
  VStack,
  // Center,
} from "@chakra-ui/react";

const Vote = ({ poll }) => {
  const initialState = {
    active_choice: null,
    notification: "",
    error_message: "",
    show_email: false,
    show_otp: false,
    show_error: false,
    show_message: false,
    show_not: false,
    choice_list: null,
  };

  const [state, setState] = React.useState(initialState);
  const [choices, setChoices] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [otp, setOTP] = React.useState("");
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handleOTPChange = (event) => setOTP(event.target.value);
  const api_url = "http://127.0.0.1:8000/polls/";

  const getChoices = () => {
    console.log("in getchoices fetch");
    // console.log('page number:', state.current_page);
    // // console.log('in fetch')

    fetch(api_url + `pollchoices/${poll.id}/`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res;
        }
      })
      .then((resJson) => {
        console.log("resJson", resJson);
        const mylist = [...resJson];
        let data = {
          ...state,
          choice_list: mylist,
        };
        setState(data);
        setChoices(mylist);
        console.log("list", mylist);
        console.log("data", data);
        console.log("choices", state.choice_list);
        console.log("choices2", choices);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleVoteButton = () => {
    // console.log("in getchoices fetch");
    // console.log('page number:', state.current_page);
    // // console.log('in fetch')
    setState({ ...state, show_email: false });
    fetch(api_url + `vote/`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        choice_id: state.active_choice.id,
        email: email,
      }),
    })
      .then((res) => {
        console.log("first then");

        if (res.ok) {
          console.log("ok");

          return res.json();
        } else {
          console.log("else");
          console.log("res", res);
          const myResJson = res.json();
          console.log("res json", myResJson);
          return myResJson.then((response) => {
            console.log("response", response);
            console.log("message", response["error"]);
            throw new Error(response["error"]);
          });
          // throw res;
        }
      })
      .then((resJson) => {
        console.log("second then");
        setState({
          ...state,
          show_error: false,
          error_message: "",
          show_not: true,
          notification: "Email sent! Please enter OTP",
          show_otp: true,
          show_email: false,
        });

        console.log("resJson", resJson);
      })
      .catch((error) => {
        console.log("catch");

        console.log(state);
        console.log(error);
        setState({ ...state, show_error: true, error_message: error.message });
        console.log(state);
      });
  };

  let didInit = false;

  React.useEffect(() => {
    // console.log('state', state);
    // fetch(api_url + 'users?page_size=5&current_page=1', {
    // console.log("use effect was called");
    if (!didInit) {
      didInit = true;
      getChoices();
      // console.log("state in use effect", state);
    }
    // getChoices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Box mt={5} ml={10}>
        <Heading size="md" textTransform="uppercase">
          {poll.title}
        </Heading>
      </Box>

      <Box mt={5} ml={10}>
        {/* <Heading size="xs" textTransform="uppercase">
          Description
        </Heading> */}
        <Text pt="2" fontSize="sm">
          {poll.description}
        </Text>
      </Box>
      {/* <Box mt={5} ml={10}>
        <Heading size="xs" textTransform="uppercase">
          Choices:
        </Heading>
      </Box> */}
      <HStack m={10}>
        {/* <Center> */}
        {/* <Box> */}
        {choices &&
          choices.length > 0 &&
          choices.map((choice, index) => (
            <Card
              key={index}
              bg="orange.100"
              border="1px"
              borderColor="gray.400"
              p={5}
              onClick={() => {
                setState({
                  ...state,
                  active_choice: choice,
                  show_email: true,
                });
              }}
            >
              <CardHeader>
                <Heading size="md">{choice.text}</Heading>
              </CardHeader>

              <CardBody>
                <Box>
                  <Heading align={"center"} size="xs" textTransform="uppercase">
                    Votes
                  </Heading>
                  <Text align={"center"} pt="2" fontSize="sm">
                    {choice.votes}
                  </Text>
                </Box>
              </CardBody>
            </Card>
          ))}
        {/* </Box> */}
        {/* </Center> */}
      </HStack>
      <Center>
        <VStack>
          <Text
            display={state.show_error ? "" : "none"}
            fontSize="lg"
            color="tomato"
          >
            {state.error_message}
          </Text>
          <Text
            display={state.show_not ? "" : "none"}
            fontSize="lg"
            color={"green.500"}
          >
            {state.notification}
          </Text>
          <Input
            // {state.show_email?"":display="none"}
            display={state.show_email ? "" : "none"}
            align={"center"}
            w={"500px"}
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
            size="md"
          />
          <Input
            // display={"none"}
            display={state.show_otp ? "" : "none"}
            align={"center"}
            w={500}
            value={otp}
            onChange={handleOTPChange}
            placeholder="Enter OTP"
            size="md"
          />
          <Button
            display={state.show_email ? "" : "none"}
            onClick={handleVoteButton}
            colorScheme="teal"
            size="lg"
          >
            Vote
          </Button>
        </VStack>
      </Center>
    </>
    // <div>
    //   <p>Hello FunctionalComponent</p>
    //   <p>{poll.id}</p>
    //   {/* <p>{console.log(state.choice_list)}</p> */}

    //   <p>{state.choice_list[0].id}</p>
    //   <p>{state.choice_list[0].text}</p>
    //   <p>{state.choice_list[1].id}</p>
    //   <p>{state.choice_list[1].text}</p>
    // </div>
  );
};

export default Vote;
