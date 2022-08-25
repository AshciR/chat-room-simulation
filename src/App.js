import './App.css';
import ChatRoom from "./components/ChatRoom/ChatRoom";
import {Box} from "@mui/material";

function App() {

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 2 // MUI translates it to 16px. Each unit is 8px
        }}
        >
            <ChatRoom data-testid="test-chat-room"/>
        </Box>
    );
}

export default App;
