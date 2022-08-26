import {render, screen} from "@testing-library/react";
import ChatBubble from "./ChatBubble";

describe('ChatBubble tests', () => {

    it('displays the correct data in the chat bubble', () => {

        // Given: We have message data
        const message = {
            userName: 'Richie',
            content: 'Hello World',
            isOwner: true,
            time: '6:00'
        }

        // When: The Chat Bubble renders with proper data
        render(<ChatBubble
            displayName={message.userName}
            message={message.content}
            isOwner={true}
            time={message.time}
        />);

        // Then: The information should be displayed
        const content = screen.getByText(message.content);
        expect(content).toBeInTheDocument();

        const avatar = screen.getByText(message.userName.charAt(0));
        expect(avatar).toBeInTheDocument();

        const userName = screen.getByText(message.userName);
        expect(userName).toBeInTheDocument();

        const deliveryTime = screen.getByText(`Delivered at: ${message.time}`);
        expect(deliveryTime).toBeInTheDocument();
    });

});


