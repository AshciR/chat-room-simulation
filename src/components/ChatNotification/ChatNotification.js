import {Alert, Box} from "@mui/material";

const ChatNotification = ({notification, time}) => {

    const displayNotification = `${notification} at ${time}`

    return (
        <Box>
            <Alert severity="info">
                {displayNotification}
            </Alert>
        </Box>
    )
};

export default ChatNotification;