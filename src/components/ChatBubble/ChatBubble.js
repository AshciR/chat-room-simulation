import {Avatar, Box, Chip, Typography} from "@mui/material";

const ChatBubble = ({displayName, message, isOwner, time, isEdited}) => {

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignSelf: isOwner ? "flex-end" : "flex-start"
            }}
            data-testid="test-chat-bubble"
        >
            <Typography
                sx={{
                    fontSize: 12,
                    padding: "2px",
                    alignSelf: isOwner ? "flex-end" : "flex-start"
                }}
            >
                {displayName}
            </Typography>
            <Chip
                avatar={<Avatar>{displayName.charAt(0)}</Avatar>}
                label={message}
                color={isOwner ? "primary" : "secondary"}
            />
            <Typography
                sx={{
                    fontSize: 12,
                    padding: "2px",
                    alignSelf: isOwner ? "flex-end" : "flex-start"
                }}
            >
                {isEdited ? `Edited at: ${time}` : `Delivered at: ${time}`}
            </Typography>
        </Box>
    )
};

export default ChatBubble;