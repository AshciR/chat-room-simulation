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

    // Step 1: We have to sort the events based on the delta (timestamp)
    const sortedChatLogEvents = sortChatLogEvents(chatLogEvents);

    // Step 2: Group the Message events so that I can track the state transitions
    const messageEvents = filterMessageEvents(sortedChatLogEvents);
    const messagesGroupedById = groupEventsByMessageId(messageEvents);

    // Step 3: Group the User events so that I can track the state transitions
    const eventsWithUserData = filterEventsWithUserData(chatLogEvents);
    const eventsGroupedByUserId = groupEventsByUserId(eventsWithUserData);

    // Step 4: Convert each the Chat log event into a ChatRoom event

    // Step 5: Return the array of the ChatRoom events

    return sortedChatLogEvents;
};

/**
 * Sorts the chat log events based on their delta(timestamp)
 * @param chatLogEvents {*[]}
 * @return {*[]}
 */
const sortChatLogEvents = chatLogEvents => {
    return chatLogEvents.sort((event1, event2) => event1.delta - event2.delta);
};

/**
 * Filters out the chat log events that have
 * message data in the payload.
 * @param events the chat log events
 * @return {*[]}
 */
const filterMessageEvents = (events) => {
    return events.filter(event => doesEventHaveMessageDataInPayload(event));
};

/**
 * Determines if a chat log event has message data in it
 * @param event chat log event
 * @return {boolean} true if event the payload has message data in the payload
 */
const doesEventHaveMessageDataInPayload = (event) => {
    // Self-explanatory, If the payload has a 'message' key then
    // I know it's a message event
    return Object.keys(event.payload).includes('message');
}

/**
 * Creating a Map/Dictionary where the key
 * is the message id and the value is the events
 * associated with the message.
 * @param messageEvents events that have message data in the payload
 * @return {*[]}
 */
const groupEventsByMessageId = (messageEvents) => {

    // I'm using reduce instead of a traditional for loop
    // because I advocate for functional programming
    // and non-mutational code.
    //
    // It'll create a Map,
    // check if the message id is already in the map
    // if true, add the event to the list
    // if not, create a new list and add the event
    return messageEvents.reduce((acc, event) => {
        acc[event.payload.message.id] = acc[event.payload.message.id] ? [...acc[event.payload.message.id], event] : [event]
        return acc
    }, {});

};

// Could consider adding the below methods into a different file,
// but I'm running low on time, and I'm getting a bit tired tbh :(

/**
 * Filters out the chat log events that have
 * user data in the payload.
 * @param events the chat log events
 * @return {*[]}
 */
const filterEventsWithUserData = (events) => {
    return events.filter(event => doesEventHaveUserData(event));
};

/**
 * Determines if a chat log even has user data in it
 * @param event chat log event
 * @return {boolean} true if event the payload has user data in the payload
 */
const doesEventHaveUserData = (event) => {
    return Object.keys(event.payload).includes('user');
};

/**
 * Creating a Map/Dictionary where the key
 * is the user id and the value is the events
 * associated with the user.
 * @param eventsWithUsers events that have user data in the payload
 * @return {*[]}
 */
const groupEventsByUserId = (eventsWithUsers) => {

    // I'm using reduce instead of a traditional for loop
    // because I advocate for functional programming
    // and non-mutational code.
    return eventsWithUsers.reduce((acc, event) => {
        acc[event.payload.user.id] = acc[event.payload.user.id] ? [...acc[event.payload.user.id], event] : [event]
        return acc
    }, {});

};

export default convertChatLogEventToChatRoomEvent;
// Ideally, I'd love if some of these methods were only exposed within this file
// But, I need to export them to write unit tests.
export {
    sortChatLogEvents, filterMessageEvents, groupEventsByMessageId,
    filterEventsWithUserData, groupEventsByUserId
};