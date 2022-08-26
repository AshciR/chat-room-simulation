import './App.css';
import ChatRoom from "./components/ChatRoom/ChatRoom";
import {Box, Typography} from "@mui/material";
import convertChatLogEventsToChatRoomEvents from "./data/chatLogConverter";
import chatRoomEvents from "./data/chatRoomData";
import getChatLogEvents from "./data/chatRoomData";

function App() {

    const chatRoomData = getChatLogEvents();
    console.log(chatRoomData);

    const chatRoomNotifications = convertChatLogEventsToChatRoomEvents(chatRoomData);
    // console.log(chatRoomNotifications);

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 2 // MUI translates it to 16px. Each unit is 8px
        }}
        >
            <Typography>Hello</Typography>
            <ChatRoom
                data-testid="test-chat-room"
                chatRoomNotifications={chatRoomNotifications}
            />
        </Box>
    );
}

export default App;
