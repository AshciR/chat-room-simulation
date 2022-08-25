import {Avatar, Box, Chip, Typography} from "@mui/material";

const ChatBubble = ({userName, message, isOwner, time}) => {

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignSelf: isOwner ? "flex-end" : "flex-start"
            }}
        >
            <Typography
                sx={{
                    fontSize: 12,
                    padding: "2px",
                    alignSelf: isOwner ? "flex-end" : "flex-start"
                }}
            >
                {userName}
            </Typography>
            <Chip
                avatar={<Avatar>{userName.charAt(0)}</Avatar>}
                label={message}
                sx={{
                    maxWidth: 300
                }}
                color={isOwner ? "primary" : "secondary"}
            />
            <Typography
                sx={{
                    fontSize: 12,
                    padding: "2px",
                    alignSelf: isOwner ? "flex-end" : "flex-start"
                }}
            >
                {`Delivered at: ${time}`}
            </Typography>
        </Box>
    )
};

export default ChatBubble;