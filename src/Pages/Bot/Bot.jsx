import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  Avatar,
  LinearProgress,
  Slide,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import uniqueId from "lodash/uniqueId";

import AssistantIcon from "@mui/icons-material/Assistant";
import PersonIcon from "@mui/icons-material/Person";

const API_KEY = import.meta.env.VITE_OPENAI_API_BOT;

const systemMessage = {
  role: "system",
  content:
    "Explain query such that it helps in maintaining users health and make sure every query has a Fact related to hygiene also consider your name as sassy ",
};

const BotChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(true);

  useEffect(() => {
    const reminderTimeout = setTimeout(() => {
      setReminderDialogOpen(!reminderDialogOpen);
    }, 5000);
    return () => {
      clearTimeout(reminderTimeout);
    };
  }, [reminderDialogOpen]);

  const [messages, setMessages] = useState([
    {
      message: "Greetings for the day! How may I help you?",
      sentTime: "just now",
      sender: "Assistant",
    },
  ]);

  const askGPT = async (prompt) => {
    setLoading(true);
    const apiMessage = prompt.map((messageObject) => {
      const role = messageObject.sender === "Assistant" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        systemMessage, // The system message DEFINES the logic of our chatGPT
        ...apiMessage, // The messages from our chat with ChatGPT
      ],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setMessages([
          ...prompt,
          {
            message: data.choices[0].message.content,
            sender: "Assistant",
          },
        ]);
        setLoading(false);
      }, 5000);
    setLoading(false);
  };

  const handleSendData = async (e) => {
    e.preventDefault();
    const newMessages = [
      ...messages,
      { message: userInput, sentTime: "just now", sender: "You" },
    ];
    setMessages(newMessages);
    await askGPT(newMessages);
    setUserInput("");
  };

  const openChatWindow = () => {
    setIsOpen(true);
    setReminderDialogOpen(false);
  };

  const closeChatWindow = () => {
    setIsOpen(false);
    setMessages([]);
  };

  return (
    <>
      <Box>
        <Slide
          direction="up"
          in={reminderDialogOpen && !isOpen}
          position="fixed"
          bottom={20}
          right={85}
          bgcolor="background.paper"
          boxShadow={4}
          borderRadius={4}
          zIndex={9999}
          p={2}
        >
          <Typography
            variant="body1"
            color="black"
            fontWeight={400}
            fontFamily="Poppins, sans-serif"
          >
            Ask Me Anything
          </Typography>
        </Slide>
      </Box>

      <ChatIcon onClick={openChatWindow} sx={{ width: "4rem", height: "4rem" }} />

      <Dialog open={isOpen} onClose={closeChatWindow} maxWidth="sm" fullWidth>
        <DialogTitle fontFamily="Poppins, sans-serif">
          Hi I&apos;m Sassy, your personalised AI chat assistant! Feel free to ask me
          anything...
        </DialogTitle>
        <DialogContent dividers>
          {messages.map((message) => (
            <Box
              key={uniqueId()}
              display="flex"
              alignItems="center"
              justifyContent={message.sender === "Assistant" ? "flex-start" : "flex-end"}
              marginBottom={2}
            >
              {message.sender === "Assistant" ? (
                <Avatar>
                  <AssistantIcon />
                </Avatar>
              ) : (
                <Avatar>
                  <PersonIcon />
                </Avatar>
              )}
              <Typography
                variant="body1"
                margin={2}
                color={message.sender === "Assistant" ? "primary" : "secondary"}
              >
                {message.message}
              </Typography>
            </Box>
          ))}
        </DialogContent>
        {loading && <LinearProgress color="success" />}
        <form onSubmit={handleSendData}>
          <Box display="flex" alignItems="center" padding={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={loading}
              label="Type a message..."
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              endIcon={<SendIcon />}
              sx={{ marginLeft: 2, boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)" }}
            >
              Send
            </Button>
          </Box>
        </form>
      </Dialog>
    </>
  );
};

export default BotChat;
