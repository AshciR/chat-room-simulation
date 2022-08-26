import {Paper, Stack} from "@mui/material";
import ChatBubble from "../ChatBubble/ChatBubble";
import ChatNotification from "../ChatNotification/ChatNotification";


const ChatRoom = ({chatRoomNotifications, userId}) => {

    const convertToChatBubbleOrChatNotification = notification => {

        return notification.type === 'chatRoomMessage' ? <ChatBubble
                key={notification.payload.delta}
                displayName={notification.payload.displayName}
                message={notification.payload.message}
                isOwner={notification.payload.userId === userId}
                time={notification.payload.delta}
                isEdited={notification.payload.wasEdited}
            /> :
            <ChatNotification
                key={notification.payload.delta}
                notification={notification.payload.notification}
                time={notification.payload.delta}
            />;

    };

    return (
        <Paper
            variant="outlined"
            sx={{
                width: 800,
                padding: 1,
                marginTop: 2, // MUI translates it to 16px. Each unit is 8px
                marginBottom: 2, // MUI translates it to 16px. Each unit is 8px
            }}
            data-testid="test-chat-room"
        >
            <Stack
                direction="column"
                spacing={1}
            >
                {chatRoomNotifications.map(notification => convertToChatBubbleOrChatNotification(notification))}
            </Stack>
        </Paper>
    );

};

export default ChatRoom;