import {Paper, Stack} from "@mui/material";
import ChatBubble from "../ChatBubble/ChatBubble";
import ChatNotification from "../ChatNotification/ChatNotification";


const ChatRoom = ({chatRoomNotifications, userId = 1}) => {

    console.log({chatRoomNotifications: chatRoomNotifications});

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
                padding: 1
            }}
            data-testid="test-chat-room"
        >
            <Stack
                direction="column"
                spacing={1}
            >
                {chatRoomNotifications.map(notification => convertToChatBubbleOrChatNotification(notification))}
                {/*<ChatBubble*/}
                {/*    displayName={"Machell"}*/}
                {/*    message={"You there? You there?"}*/}
                {/*    isOwner={true}*/}
                {/*    time={"12:00"}*/}
                {/*/>*/}
                {/*<ChatBubble*/}
                {/*    displayName={"Natacha"}*/}
                {/*    message={"Yow whats up?"}*/}
                {/*    isOwner={false}*/}
                {/*    time={"12:01"}*/}
                {/*/>*/}
                {/*<ChatBubble*/}
                {/*    displayName={"Machell"}*/}
                {/*    message={"Party later?"}*/}
                {/*    isOwner={true}*/}
                {/*    time={"12:02"}*/}
                {/*/>*/}
                {/*<ChatNotification*/}
                {/*    notification={'Sash joined the chat'}*/}
                {/*    time={'12:03'}*/}
                {/*/>*/}
                {/*<ChatBubble*/}
                {/*    displayName={"Sasha"}*/}
                {/*    message={"YEA MANN. ROAD WE SEH!!"}*/}
                {/*    isOwner={false}*/}
                {/*    time={"12:04"}*/}
                {/*/>*/}
            </Stack>
        </Paper>
    );

};

export default ChatRoom;