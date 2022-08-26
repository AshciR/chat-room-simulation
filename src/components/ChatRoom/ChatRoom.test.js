import {render, screen} from "@testing-library/react";
import ChatRoom from "./ChatRoom";
import convertChatLogEventsToChatRoomEvents from "../../data/chatLogConverter";
import getChatLogEvents from "../../data/chatRoomData";

describe('ChatRoom tests', () => {

    it('displays the correct data in the chat room', () => {

        // Given: We have chat log (chat room) data
        const chatRoomNotifications = convertChatLogEventsToChatRoomEvents(getChatLogEvents());
        const idOfUserWhoOwnsTheDevice = 1; // Taco whose id is 1
        const startTimeOfTheRoom = "2022-08-26T12:00:00";

        // When: The Chat Room renders with proper data
        render(<ChatRoom
            chatRoomNotifications={chatRoomNotifications}
            userId={idOfUserWhoOwnsTheDevice}
            startTime={startTimeOfTheRoom}
        />);

        // Then: The information should be displayed
        const chatBubbles = screen.getAllByTestId('test-chat-bubble');
        expect(chatBubbles.length).toBe(15);

        const chatNotifications = screen.getAllByTestId('test-chat-notification');
        expect(chatNotifications.length).toBe(10);

        expect(screen.getByText("What's going on in here?")).toBeInTheDocument();
        expect(screen.getByText(/Pete the Computer joined the chat at/)).toBeInTheDocument();
    });

});

