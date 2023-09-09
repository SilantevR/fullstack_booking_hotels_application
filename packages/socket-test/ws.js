(() => {
  const chatId = "64c50508e50711f7c0284cdf"; //location.pathname.split("/").pop();
  const socket = io.connect("http://localhost:5000/", {
    withCredentials: true,
  });

  socket.emit("subscribeToChat", chatId, (answer) => {
    console.log(answer);
  });
  socket.on("connect", () => console.log("connected"));
  socket.on(`joinedToChat`, console.log);

  socket.on(`leaveChat`, console.log);

  socket.on(`message`, console.log);
  socket.on(`error-info`, console.log);
  socket.on("disconnect", console.log);
})();
