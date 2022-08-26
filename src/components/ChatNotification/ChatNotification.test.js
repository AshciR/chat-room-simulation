import ChatNotification from "./ChatNotification";
import {render, screen} from "@testing-library/react";

describe('ChatNotification tests', () => {

    it('displays the chat notification', () => {
        // When: The Chat notification renders
        render(<ChatNotification
            notification={'Sash joined the chat'}
            time={'12:03'}
        />);

        // Then: The notification info should be displayed
        const content = screen.getByText('Sash joined the chat at 12:03');
        expect(content).toBeInTheDocument();
    });


});