import {filterMessageEvents, groupEventsByMessageId, sortChatLogEvents} from "./chatLogConverter";

describe('chatLogConverter tests', () => {

    it('sorts the chat log events', () => {

        // Given: We have an array of chat log events
        const unorderedChatLogEvents = [
            {
                delta: 2100,
                payload: {type: 'connect', user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'}}
            },
            {
                delta: 1000,
                payload: {
                    type: 'message',
                    user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'},
                    message: {id: 1, text: "Hello!"}
                }
            },
            {
                delta: 3000,
                payload: {
                    type: 'message',
                    user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'},
                    message: {id: 3, text: "Hi Taco!"}
                }
            },
            {
                delta: 2000,
                payload: {
                    type: 'message',
                    user: {id: 2, user_name: 'chorizo', display_name: 'Chorizo'},
                    message: {id: 2, text: "Hi Taco!"}
                }
            },
        ];

        // When: We convert the events into ChatRoom events
        const actual = sortChatLogEvents(unorderedChatLogEvents);

        // Then: The conversion should be accurate
        expect(actual.length).toBe(unorderedChatLogEvents.length)
        const orderedChatLog = [
            {
                delta: 1000,
                payload: {
                    type: 'message',
                    user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'},
                    message: {id: 1, text: "Hello!"}
                }
            },
            {
                delta: 2000,
                payload: {
                    type: 'message',
                    user: {id: 2, user_name: 'chorizo', display_name: 'Chorizo'},
                    message: {id: 2, text: "Hi Taco!"}
                }
            },
            {
                delta: 2100,
                payload: {type: 'connect', user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'}}
            },
            {
                delta: 3000,
                payload: {
                    type: 'message',
                    user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'},
                    message: {id: 3, text: "Hi Taco!"}
                }
            },
        ];
        expect(actual).toStrictEqual(orderedChatLog);

    });

    it('filters out only the message events', () => {

        // Given: We have an array of chat log events

        // When: We filter out the message events
        const messageEvents = filterMessageEvents(getMockChatLogEvents);

        // Then: The array should only have message events
        expect(messageEvents.length).toBe(5);

        // And: The update message event should be present
        const updateMessage = messageEvents.find(event => event.delta === 7000);
        expect(updateMessage.payload.type).toBe('update');
        expect(updateMessage.payload.message.id).toBe(6);
        expect(updateMessage.payload.message.text).toBe("Seems like it's working find … for *edits* also");

    });

    it('returns an empty array if there are no events', () => {
        // Given: There is an empty array

        // When: It is filtered
        const emptyArray = filterMessageEvents([]);

        // Then: The array should be empty
        expect(emptyArray).toStrictEqual([]);

    });

    it('groups the message events by their id', () => {

        // Given: You only have message events
        const messageEvents = filterMessageEvents(getMockChatLogEvents);

        // When: They are grouped by id
        const messageEventsGroupedById = groupEventsByMessageId(messageEvents);

        // Then: They are grouped correctly
        expect(messageEventsGroupedById).toStrictEqual(getExpectedMessagesGroupedById);

    })

});

const getMockChatLogEvents = [
    {
        delta: 1000,
        payload: {
            type: 'message',
            user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'},
            message: {id: 1, text: "Hello!"}
        }
    },
    {
        delta: 2000,
        payload: {
            type: 'message',
            user: {id: 2, user_name: 'chorizo', display_name: 'Chorizo'},
            message: {id: 2, text: "Hi Taco!"}
        }
    },
    {delta: 2100, payload: {type: 'connect', user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'}}},
    {
        delta: 6000,
        payload: {
            type: 'message',
            user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'},
            message: {id: 6, text: "Seems like it's working fine … in the *simple* case :)"}
        }
    },
    // Update user
    {delta: 6600, payload: {type: 'update', user: {id: 2, username: 'chorizothecat', display_name: 'Chorizo the Cat'}}},
    // Update message
    {delta: 7000, payload: {type: 'update', message: {id: 6, text: "Seems like it's working find … for *edits* also"}}},
    {delta: 12000, payload: {type: 'delete', message: {id: 9}}},
    {delta: 31002, payload: {type: 'disconnect', user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'}}},
];

const getExpectedMessagesGroupedById = {
    1: [
        {
            delta: 1000,
            payload: {
                type: 'message',
                user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'},
                message: {id: 1, text: "Hello!"}
            }
        },
    ],
    2: [
        {
            delta: 2000,
            payload: {
                type: 'message',
                user: {id: 2, user_name: 'chorizo', display_name: 'Chorizo'},
                message: {id: 2, text: "Hi Taco!"}
            }
        },
    ],
    6: [
        {
            delta: 6000,
            payload: {
                type: 'message',
                user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'},
                message: {id: 6, text: "Seems like it's working fine … in the *simple* case :)"}
            }
        },
        {
            delta: 7000,
            payload: {type: 'update', message: {id: 6, text: "Seems like it's working find … for *edits* also"}}
        },
    ],
    9: [ {delta: 12000, payload: {type: 'delete', message: {id: 9}}}]
};