/**
 * Converts an array of chat log events into a chat room event.
 * A chat room event is a data model consumed by the ChatRoom component.
 *
 * For more info about the rationale, see the DesignDecisions.md document.
 *
 * @param chatLogEvents {*[]}
 * @return {*[]}
 */
const convertChatLogEventToChatRoomEvent = (chatLogEvents) => {

    const sortedChatLogEvents = sortChatLogEvents(chatLogEvents);

    return sortedChatLogEvents;
};

const sortChatLogEvents = chatLogEvents => {
    return chatLogEvents.sort((event1, event2) => event1.delta - event2.delta);
};

export default convertChatLogEventToChatRoomEvent;
export {sortChatLogEvents};