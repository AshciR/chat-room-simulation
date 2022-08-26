import {
    convertChatLogEventToChatRoomMessageEvent,
    convertChatLogEventToNotificationEvent,
    filterEventsWithUserData,
    filterMessageEvents,
    groupEventsByMessageId,
    groupEventsByUserId,
    sortChatLogEvents
} from "./chatLogConverter";

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
        expect(messageEvents.length).toBe(6);

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

    it('filters out the events with user data', () => {
        // Given: We have an array of chat log events

        // When: We filter out the user data events
        const userDataEvents = filterEventsWithUserData(getMockChatLogEvents);

        // Then: The array should only have message events
        expect(userDataEvents.length).toBe(7);

        // And: The update user event should be present
        const updatedUser = userDataEvents.find(event => event.delta === 6600);
        expect(updatedUser.payload.type).toBe('update');
        expect(updatedUser.payload.user.id).toBe(2);
        expect(updatedUser.payload.user.username).toBe("chorizothecat");
    })

    it('groups the events by their user id', () => {

        // Given: You only have user events
        const userEvents = filterEventsWithUserData(getMockChatLogEvents);

        // When: They are grouped by user id
        const messageEventsGroupedByUserId = groupEventsByUserId(userEvents);

        // Then: They are grouped correctly
        expect(messageEventsGroupedByUserId).toStrictEqual(getExpectedEventGroupedByUserId);

    })

    it('converts chat log message event into chat room message event', () => {

        // Given: We have a message chat log event
        const chatLogMsgEvent = getMockChatLogEvents[0];

        // And: The messages grouped by id
        const messageEvents = filterMessageEvents(getMockChatLogEvents);
        const messageEventsGroupedById = groupEventsByMessageId(messageEvents);

        // When: It is converted into a chat room event
        const chatRoomMsgEvent = convertChatLogEventToChatRoomMessageEvent(chatLogMsgEvent, messageEventsGroupedById)

        // Then: It should have the correct values
        const expectedChatRoomMsgEvent = {
            type: 'chatRoomMessage',
            payload: {
                displayName: 'Taco Spolsky',
                message: 'Hello!',
                time: 1000,
                wasEdited: false
            }
        };

        expect(chatRoomMsgEvent).toStrictEqual(expectedChatRoomMsgEvent);

    });

    it('converts chat log update message event into chat room message event', () => {

        // Given: We have a message chat log event
        const chatLogUpdatedMsgEvent = getMockChatLogEvents[3]; // This message was updated

        // And: The messages grouped by id
        const messageEvents = filterMessageEvents(getMockChatLogEvents);
        const messageEventsGroupedById = groupEventsByMessageId(messageEvents);

        // When: It is converted into a chat room event
        const chatRoomMsgEvent = convertChatLogEventToChatRoomMessageEvent(chatLogUpdatedMsgEvent, messageEventsGroupedById)

        // Then: It should have the correct values
        const expectedChatRoomMsgEvent = {
            type: 'chatRoomMessage',
            payload: {
                displayName: 'Pete the Computer',
                message: "Seems like it's working find … for *edits* also",
                time: 7000,
                wasEdited: true
            }
        };

        expect(chatRoomMsgEvent).toStrictEqual(expectedChatRoomMsgEvent);

    });

    it('converts chat log delete message event into chat room message event', () => {

        // Given: We have a message chat log event
        const chatLogUpdatedMsgEvent = getMockChatLogEvents[6]; // This message was deleted

        // And: The messages grouped by id
        const messageEvents = filterMessageEvents(getMockChatLogEvents);
        const messageEventsGroupedById = groupEventsByMessageId(messageEvents);

        // When: It is converted into a chat room event
        const chatRoomMsgEvent = convertChatLogEventToChatRoomMessageEvent(chatLogUpdatedMsgEvent, messageEventsGroupedById)

        // Then: It should have the correct values
        const expectedChatRoomMsgEvent = {
            type: 'chatRoomMessage',
            payload: {
                displayName: 'Taco Spolsky',
                message: "Message was deleted",
                time: 12000,
                wasEdited: true
            }
        };

        expect(chatRoomMsgEvent).toStrictEqual(expectedChatRoomMsgEvent);

    });

    it('converts chat log connect event into chat room notification event', () => {

        // Given: We have a message chat log event
        const chatLogConnectEvent = getMockChatLogEvents[2];

        // And: The event grouped by user ids
        const userEvents = filterEventsWithUserData(getMockChatLogEvents);
        const eventsGroupedByUserId = groupEventsByUserId(userEvents);

        // When: It is converted into a chat room event
        const chatRoomNotificationEvent = convertChatLogEventToNotificationEvent(chatLogConnectEvent, eventsGroupedByUserId);

        // Then: It should have the correct values
        const expectedChatRoomNotificationEvent = {
            type: 'chatRoomNotification',
            payload: {
                delta: 2100,
                notification: 'Pete the Computer joined the chat',
            }
        };

        expect(chatRoomNotificationEvent).toStrictEqual(expectedChatRoomNotificationEvent);

    });

    it('converts chat log disconnect event into chat room notification event', () => {

        // Given: We have a message chat log event
        const chatLogDisconnectEvent = getMockChatLogEvents[8];

        // And: The event grouped by user ids
        const userEvents = filterEventsWithUserData(getMockChatLogEvents);
        const eventsGroupedByUserId = groupEventsByUserId(userEvents);

        // When: It is converted into a chat room event
        const chatRoomNotificationEvent = convertChatLogEventToNotificationEvent(chatLogDisconnectEvent, eventsGroupedByUserId);

        // Then: It should have the correct values
        const expectedChatRoomNotificationEvent = {
            type: 'chatRoomNotification',
            payload: {
                delta: 31002,
                notification: 'Taco Spolsky left the chat',
            }
        };

        expect(chatRoomNotificationEvent).toStrictEqual(expectedChatRoomNotificationEvent);

    });

    it('converts chat log update user event into chat room notification event', () => {

        // Given: We have a message chat log event
        const chatLogUpdateUserEvent = getMockChatLogEvents[4];

        // And: The event grouped by user ids
        const userEvents = filterEventsWithUserData(getMockChatLogEvents);
        const eventsGroupedByUserId = groupEventsByUserId(userEvents);

        // When: It is converted into a chat room event
        const chatRoomNotificationEvent = convertChatLogEventToNotificationEvent(chatLogUpdateUserEvent, eventsGroupedByUserId);

        // Then: It should have the correct values
        const expectedChatRoomNotificationEvent = {
            type: 'chatRoomNotification',
            payload: {
                delta: 6600,
                notification: 'Chorizo changed their name to Chorizo the Cat',
            }
        };

        expect(chatRoomNotificationEvent).toStrictEqual(expectedChatRoomNotificationEvent);

    });

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
    {
        delta: 8250,
        payload: {
            type: 'message',
            user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'},
            message: {id: 9, text: "We _know_ you're a cat @chorizothecat :facepalm:"}
        }
    },
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
    9: [
        {
            delta: 8250,
            payload: {
                type: 'message',
                user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'},
                message: {id: 9, text: "We _know_ you're a cat @chorizothecat :facepalm:"}
            }
        },
        {delta: 12000, payload: {type: 'delete', message: {id: 9}}}
    ]
};

const getExpectedEventGroupedByUserId = {
    1: [
        {
            delta: 1000,
            payload: {
                type: 'message',
                user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'},
                message: {id: 1, text: "Hello!"}
            }
        },
        {
            delta: 8250,
            payload: {
                type: 'message',
                user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'},
                message: {id: 9, text: "We _know_ you're a cat @chorizothecat :facepalm:"}
            }
        },
        {delta: 31002, payload: {type: 'disconnect', user: {id: 1, user_name: 'taco', display_name: 'Taco Spolsky'}}},
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
        {
            delta: 6600,
            payload: {type: 'update', user: {id: 2, username: 'chorizothecat', display_name: 'Chorizo the Cat'}}
        },
    ],
    3: [
        {delta: 2100, payload: {type: 'connect', user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'}}},
        {
            delta: 6000,
            payload: {
                type: 'message',
                user: {id: 3, user_name: 'pete', display_name: 'Pete the Computer'},
                message: {id: 6, text: "Seems like it's working fine … in the *simple* case :)"}
            }
        },
    ],
};