import getChatRoomEvents from "./chatRoomData";

describe('chatRoomData tests', () => {

    it('has the correct number of events', () => {
        // Given: We have the simulated chat room data
        const events = getChatRoomEvents;

        // When: We count the number of events
        const numOfEvents = events.length;

        // Then: It should have the correct number of events
        const expectedNumberOfEvents = 28;
        expect(numOfEvents).toBe(expectedNumberOfEvents);
    });

});