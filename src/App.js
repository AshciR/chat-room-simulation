import './App.css';
import ChatRoom from "./components/ChatRoom/ChatRoom";
import {Box} from "@mui/material";
import convertChatLogEventsToChatRoomEvents from "./data/chatLogConverter";
import getChatLogEvents from "./data/chatRoomData";

function App() {

    const chatRoomNotifications = convertChatLogEventsToChatRoomEvents(getChatLogEvents());
    const idOfUserWhoOwnsTheDevice = 1; // Taco whose id is 1

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'lightgray'
        }}
        >
            <ChatRoom
                data-testid="test-chat-room"
                chatRoomNotifications={chatRoomNotifications}
                userId={idOfUserWhoOwnsTheDevice}
            />
        </Box>
    );
}

export default App;
