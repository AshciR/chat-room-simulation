import {Paper, Stack} from "@mui/material";
import ChatBubble from "../ChatBubble/ChatBubble";
import ChatNotification from "../ChatNotification/ChatNotification";
import {DateTime} from "luxon";


const ChatRoom = ({chatRoomNotifications, userId, startTime}) => {


    const convertToChatBubbleOrChatNotification = (notification, startTime) => {

        const startTimeDateTime = DateTime.fromISO(startTime);
        const time = startTimeDateTime
            .plus({seconds: notification.payload.delta})
            .toLocaleString(DateTime.TIME_WITH_SECONDS)

        return notification.type === 'chatRoomMessage' ? <ChatBubble
                key={notification.payload.delta}
                displayName={notification.payload.displayName}
                message={notification.payload.message}
                isOwner={notification.payload.userId === userId}
                time={time}
                isEdited={notification.payload.wasEdited}
            /> :
            <ChatNotification
                key={notification.payload.delta}
                notification={notification.payload.notification}
                time={time}
            />;

    };

    return (
        <Paper
            variant="outlined"
            sx={{
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
                {chatRoomNotifications.map(notification => convertToChatBubbleOrChatNotification(notification, startTime))}
            </Stack>
        </Paper>
    );

};

export default ChatRoom;