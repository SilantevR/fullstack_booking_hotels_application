import { Send } from "@mui/icons-material";
import { Box, Button, FormHelperText, Grid, TextField } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { Message } from "./Message";
import { MessageData, fetchMessageData } from "../types";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/input/components/Input";
import { styles } from "../../../styles";
import { validateDescription } from "../../../utils/validation";
import { fetchMessages } from "../services/fetchMessages";
import { refreshToken } from "../../profile/services/RefreshToken";
import { RoutesEnum } from "../../../app/router/types";
import { useServerError } from "../../../hooks/useServerError";
import { sendMessage } from "../services/sendMessage";
import { socket } from "../../../socket";
import { readMessages } from "../services/readMessages";

export const SupportRequest: React.FC = () => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      text: "",
    },
    mode: "onChange",
  });
  const navigate = useNavigate();
  const { id } = useParams();
  const ref = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState([] as fetchMessageData[]);
  const [sendMessageStatus, setSendMessageStatus] = useState(true);

  const { serverError, setError } = useServerError();

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (id) {
      fetchMessages(id)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          } else if (response.status === 401) {
            refreshToken(navigate).then(() => {
              fetchMessages(id)
                .then((response) => {
                  if (response.status === 200) {
                    return response.json();
                  }
                })
                .then((result: fetchMessageData[]) => {
                  if (result) {
                    setMessages(result);
                    socket.connect();

                    socket.on(`joinedToChat`, (response) => {
                      if (response.status === "ОК") {
                        setIsConnected(socket.connected);
                        socket.on(`leaveChat`, (response) => {
                          socket.off(`leaveChat`);
                        });
                      }
                    });
                    socket.emit("subscribeToChat", id);
                  }
                });
            });
          } else {
            setError(new Error(`${response.statusText}`));
          }
        })
        .then((result: fetchMessageData[]) => {
          if (result) {
            setMessages(result);
            socket.connect();

            socket.on(`joinedToChat`, (response) => {
              if (response.status === "ОК") {
                setIsConnected(socket.connected);
                socket.on(`leaveChat`, (response) => {
                  socket.off(`leaveChat`);
                });
              }
            });
            socket.emit("subscribeToChat", id);
          }
        });
    } else {
      navigate(RoutesEnum.ServerError);
    }

    return () => {
      socket.emit("leaveChat", id);
      socket.off(`joinedToChat`);
      socket.off("message");
      socket.off("error-info");
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      socket.on(`message`, (response) => {
        const updatedMessages = [...messages];
        updatedMessages.push(response);
        setMessages(updatedMessages);
        handleReadMessage();
      });

      socket.on(`error-info`, (error) => setError(error.message));
    }
  }, [isConnected]);

  useEffect(() => {
    if (messages.length) {
      handleReadMessage();
    }
    if (isConnected) {
      socket.off("message");
      socket.off("error-info");
      socket.on(`message`, (response) => {
        const updatedMessages = [...messages];
        updatedMessages.push(response);
        setMessages(updatedMessages);
      });

      socket.on(`error-info`, (error) => setError(error.message));
    }
    ref.current?.scrollIntoView();
  }, [messages]);

  const handleSendMessage = (data: MessageData) => {
    sendMessage(id!, data)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 401) {
          refreshToken(navigate).then(() => {
            sendMessage(id!, data)
              .then((response) => {
                if (response.status === 200) {
                  return response.json();
                } else {
                  setSendMessageStatus(false);
                }
              })
              .then((result: fetchMessageData) => {
                if (result) {
                  setSendMessageStatus(true);
                  setValue("text", "");
                }
              });
          });
        } else {
          setSendMessageStatus(false);
        }
      })
      .then((result: fetchMessageData) => {
        if (result) {
          setSendMessageStatus(true);
          setValue("text", "");
        }
      });
  };

  const handleReadMessage = () => {
    readMessages(id!, { createdBefore: new Date() }).then((response) => {
      if (response.status === 401) {
        refreshToken(navigate).then(() => {
          readMessages(id!, { createdBefore: new Date() });
        });
      }
    });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "grey.200",
      }}
    >
      <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
        {messages.map((message) => (
          <Message key={message._id} message={message} />
        ))}
        <div ref={ref}></div>
      </Box>
      {sendMessageStatus ? null : (
        <FormHelperText
          sx={{
            color: "red",
            fontSize: 16,
          }}
        >
          Сообщение не отправлено
        </FormHelperText>
      )}

      <form onSubmit={handleSubmit(handleSendMessage)}>
        <Box>
          <Grid container>
            <Grid item xs={10}>
              <Input
                name="text"
                control={control}
                rules={validateDescription}
                multiline={true}
                errors={errors}
                label="Введите текст сообщения"
              />
            </Grid>
            <Grid item xs={2} sx={{ display: "flex", flexDirection: "column" }}>
              <Button
                type="submit"
                fullWidth
                endIcon={<Send />}
                variant="contained"
                sx={{
                  borderRadius: "10px",
                  fontSize: 16,
                  mt: 2,
                  color: "white",
                  flexGrow: 1,
                  marginBottom: "8px",
                  backgroundColor: "#2a2f3f",
                  "&:hover": {
                    background: "#1976d2",
                  },
                }}
              ></Button>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Box>
  );
};
