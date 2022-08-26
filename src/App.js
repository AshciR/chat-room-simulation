import './App.css';
import ChatRoom from "./components/ChatRoom/ChatRoom";
import {Box} from "@mui/material";
import convertChatLogEventsToChatRoomEvents from "./data/chatLogConverter";
import getChatLogEvents from "./data/chatRoomData";

function App() {

    const chatRoomNotifications = convertChatLogEventsToChatRoomEvents(getChatLogEvents());
    const idOfUserWhoOwnsTheDevice = 1; // Taco whose id is 1

    // Decided to do this as bonus. You can pass in a ISO-8601 timestamp as the start time
    // then the deltas will calculate the chat times.
    const startTimeOfTheRoom = "2022-08-26T12:00:00";

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
                startTime={startTimeOfTheRoom}
            />
        </Box>
    );
}

export default App;
