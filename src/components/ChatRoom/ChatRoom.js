import {Paper, Stack, Typography} from "@mui/material";
import ChatBubble from "../ChatBubble/ChatBubble";

// TODO: Add parameters to the function when I figure out how to manipulate the chat log
const ChatRoom = () => {

    return (
        <Paper
            variant="outlined"
            sx={{
                width:800,
                padding:1
            }}
            data-testid="test-chat-room"
        >
            <Stack
                direction="column"
                spacing={1}
            >
                <ChatBubble
                    userName={"Machell"}
                    message={"You there? You there?"}
                    isOwner={true}
                    time={"12:00"}
                />
                <ChatBubble
                    userName={"Natacha"}
                    message={"Yow whats up?"}
                    isOwner={false}
                    time={"12:01"}
                />
                <ChatBubble
                    userName={"Machell"}
                    message={"Party later?"}
                    isOwner={true}
                    time={"12:02"}
                />
                {/*Create Notification Component*/}
                <Typography
                    variant="h6"
                    sx={{
                        alignSelf: "center"
                    }}
                >
                    Sash joined the chat
                </Typography>
                <ChatBubble
                    userName={"Sasha"}
                    message={"YEA MANN. ROAD WE SEH!!"}
                    isOwner={false}
                    time={"12:04"}
                />
            </Stack>
        </Paper>
    );

};

export default ChatRoom;