import {render, screen} from "@testing-library/react";
import ChatRoom from "./ChatRoom";

describe('ChatRoom tests', () => {

    it('displays the correct data in the chat room', () => {

        // Given: We have chat log (chat room) data
        // TODO: Add values once the API is fleshed out

        // When: The Chat Room renders with proper data
        render(<ChatRoom/>);

        // Then: The information should be displayed
        // TODO: Replace with better assertions after API is fleshed out
        const content = screen.getByText('Sash joined the chat');
        expect(content).toBeInTheDocument();
    });

    // TODO: Add more test cases after API is fleshed out

});

