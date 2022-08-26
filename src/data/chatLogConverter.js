/**
 * Converts an array of chat log events into a chat room event.
 * A chat room event is a data model consumed by the ChatRoom component.
 *
 * For more info about the rationale, see the DesignDecisions.md document.
 *
 * @param chatLogEvents {*[]}
 * @return {*[]}
 */
const convertChatLogEventsToChatRoomEvents = (chatLogEvents) => {

    // Step 1: We have to sort the events based on the delta (timestamp)
    const sortedChatLogEvents = sortChatLogEvents(chatLogEvents);

    // Step 2: Group the Message events so that I can track the state transitions
    const messageEvents = filterMessageEvents(sortedChatLogEvents);
    const messagesGroupedById = groupEventsByMessageId(messageEvents);

    // Step 3: Group the User events so that I can track the state transitions
    const eventsWithUserData = filterEventsWithUserData(chatLogEvents);
    const eventsGroupedByUserId = groupEventsByUserId(eventsWithUserData);

    // Step 4: Convert each the Chat log event into a ChatRoom event
    const chatRoomEventsThatContainDuplicates = chatLogEvents.map(event => convertChatLogEventToChatRoomEvent(event, messagesGroupedById, eventsGroupedByUserId));
    return removeDuplicateEvents(chatRoomEventsThatContainDuplicates);

};

const removeDuplicateEvents = (chatRoomEventsThatContainDuplicates) => {

    // We're grouping the events by their deltas so that I can get the latest value
    const chatRoomEventsGroupedByDelta = chatRoomEventsThatContainDuplicates.reduce((acc, event) => {
        acc[event.payload.delta] = acc[event.payload.delta] ? [...acc[event.payload.delta], event] : [event]
        return acc
    }, {});

    // Picks the latest event
    return Object.values(chatRoomEventsGroupedByDelta)
        .map(events => events[events.length - 1]); // We're only concerned with the last event

}

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

/**
 * Converts from a chat log event (the provided schema)
 * into a chat stream event (my representation of the data).
 *
 * Here's my train of thought, I want to display the final
 * state of the messages and notifications as a chat window,
 * similar to iMessage, WhatsApp, or Telegram.
 *
 * To accomplish this, I am converting the chat log events
 * into an object convenient for the UI components.
 *
 * From the perspective of UI component there are 2 types of events:
 * 1. A message event, e.g. Taco: "Hello!"
 * 2. A notification event, change of the chat room state. E.g. "Pete connected to the chat"
 *
 * @param chatLogEvent the original chat log object
 * @param eventsGroupedByMessageId
 * @param eventsGroupedByUserId
 * @return {*} chatroom object for UI component
 */
const convertChatLogEventToChatRoomEvent = (chatLogEvent, eventsGroupedByMessageId, eventsGroupedByUserId) => {

    // We have 2 types of events: message events and notification events.
    // If it's not a message event, I'm treating it as a notification event.
    const isMessageEvent = doesEventHaveMessageDataInPayload(chatLogEvent);
    return isMessageEvent ? convertChatLogEventToChatRoomMessageEvent(chatLogEvent, eventsGroupedByMessageId) :
        convertChatLogEventToNotificationEvent(chatLogEvent, eventsGroupedByUserId);

};

const convertChatLogEventToChatRoomMessageEvent = (chatLogEvent, eventsGroupedByMessageId) => {

    // For messages, we're only concerned with the latest state of the message
    // Because we have them grouped by message id, we can grab the last event from the Map's value
    // E.g. {1: [create, update, delete]} -- we'll grab the delete event.
    const messageEvents = eventsGroupedByMessageId[chatLogEvent.payload.message.id];
    const latestMessageEvent = messageEvents[messageEvents.length - 1];

    // If the message was updated or deleted, then it was edited
    const wasEdited = latestMessageEvent.payload.type !== 'message';

    // If the message was deleted, we'll return a special message
    const determineMessageContent = {
        'message': latestMessageEvent.payload.message.text,
        'update': latestMessageEvent.payload.message.text,
        'delete': 'Message was deleted'
    }

    // The update and delete payloads don't contain the user id, but
    // we need it for the UI chat bubble component
    const messageEventWithUserData = messageEvents.find(event => event.payload.type === 'message');

    // This model is what the ChatRoom and ChatBubble UI components will consume
    return {
        type: 'chatRoomMessage',
        payload: {
            userId: messageEventWithUserData.payload.user.id,
            displayName: messageEventWithUserData.payload.user.display_name,
            message: determineMessageContent[latestMessageEvent.payload.type] || 'Whoops! Something went wrong on our end.',
            delta: latestMessageEvent.delta,
            wasEdited: wasEdited
        }
    };

};

const convertChatLogEventToNotificationEvent = (chatLogEvent, eventsGroupedByUserId) => {

    return {
        type: 'chatRoomNotification',
        payload: {
            notification: determineTypeOfNotification(chatLogEvent, eventsGroupedByUserId[chatLogEvent.payload.user.id]),
            delta: chatLogEvent.delta
        }
    };

};

const determineTypeOfNotification = (chatLogEvent, eventsForUser) => {

    switch (chatLogEvent.payload.type) {
        case 'connect':
            return `${chatLogEvent.payload.user.display_name} joined the chat`
        case 'update':
            // We know that this update is not a message update based
            // logic in convertChatLogEventToChatRoomEvent(), so it has to be a user update
            return constructDisplayNameUpdatedMessage(chatLogEvent, eventsForUser)
        case 'disconnect':
            return `${chatLogEvent.payload.user.display_name} left the chat`
        default:
            return 'Whoops! Something went wrong on our end.';
    }

};

const constructDisplayNameUpdatedMessage = (chatLogEvent, eventsForUser) => {
    // I'm making an assumption of an invariant,
    // if there's an update to display name,
    // there must be at least 1 prior event which introduced the user to the chat log
    const indexOfEventBeforeNameUpdate = eventsForUser.indexOf(chatLogEvent) - 1;

    // Get the last display name before the change.
    const eventBeforeTheDisplayNameChange = eventsForUser[indexOfEventBeforeNameUpdate]

    return `${eventBeforeTheDisplayNameChange.payload.user.display_name} changed their name to ${chatLogEvent.payload.user.display_name}`;
};

export default convertChatLogEventsToChatRoomEvents;

// Ideally, I'd love if some of these methods were only exposed within this file
// But, I need to export them to write unit tests.
export {
    sortChatLogEvents, filterMessageEvents, groupEventsByMessageId,
    filterEventsWithUserData, groupEventsByUserId,
    convertChatLogEventToChatRoomEvent, convertChatLogEventToChatRoomMessageEvent,
    convertChatLogEventToNotificationEvent
};