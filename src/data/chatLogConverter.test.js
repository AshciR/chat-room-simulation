import {sortChatLogEvents} from "./chatLogConverter";

describe('chatLogConverter tests', () => {

    it('sorts the chat log events', () => {

        // Given: We have an array of chat log events
        const unorderedChatLogEvents = [
            { delta: 2100, payload: { type: 'connect', user: { id: 3, user_name: 'pete', display_name: 'Pete the Computer' } }},
            { delta: 1000, payload: { type: 'message', user: { id: 1, user_name: 'taco', display_name: 'Taco Spolsky' }, message: { id: 1, text: "Hello!" } }},
            { delta: 3000, payload: { type: 'message', user: { id: 3, user_name: 'pete', display_name: 'Pete the Computer' }, message: { id: 3, text: "Hi Taco!" } }},
            { delta: 2000, payload: { type: 'message', user: { id: 2, user_name: 'chorizo', display_name: 'Chorizo' }, message: { id: 2, text: "Hi Taco!" } }},
        ];

        // When: We convert the events into ChatRoom events
        const actual = sortChatLogEvents(unorderedChatLogEvents);

        // Then: The conversion should be accurate
        expect(actual.length).toBe(unorderedChatLogEvents.length)
        const orderedChatLog = [
            { delta: 1000, payload: { type: 'message', user: { id: 1, user_name: 'taco', display_name: 'Taco Spolsky' }, message: { id: 1, text: "Hello!" } }},
            { delta: 2000, payload: { type: 'message', user: { id: 2, user_name: 'chorizo', display_name: 'Chorizo' }, message: { id: 2, text: "Hi Taco!" } }},
            { delta: 2100, payload: { type: 'connect', user: { id: 3, user_name: 'pete', display_name: 'Pete the Computer' } }},
            { delta: 3000, payload: { type: 'message', user: { id: 3, user_name: 'pete', display_name: 'Pete the Computer' }, message: { id: 3, text: "Hi Taco!" } }},
        ];
        expect(actual).toStrictEqual(orderedChatLog);

    });

});