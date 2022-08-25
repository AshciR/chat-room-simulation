# Design and Solution Breakdown

## High-level Algorithm
1. Get the Chat log payload
2. Sort the payload based on the delta. 
   1. I'm not assuming The chat log will be in the correct time order, and it needs to keep its temporal nature
3. Convert the payload into a form for the UI components
4. Send the converted form to the ChatRoom component

## Observations
From what I've seen in the chat log payload, there are 2 types of events
that can be represented in a chat room:
1. A message (Message bubble)
2. A change in a user's state (Connections, Name updates, etc)

This fuels my rationale for converting the chat log data into
a format that will be easily consumed by the ChatRoom UI component.

## Considerations
I'm going to represent the latest state/mutation of a message. For example:
If a message was created, updated, then deleted, the chat room will only 
show that the message was deleted. To accomplish this, I will need to store the state for each unique message
in the log.

Similarly, in order to represent username updates, I will have to store
the states of the user. For example. If John updates his name to Johnny,
the app will need to remember John was the original name.

## Chat Log payload to ChatRoom model Conversion Algorithm
```
Filter and Group the Message events
Filter and Group the User state change events

For each chat log event:
   If event is a message event:
      Convert to a ChatRoom Message model
   Else (it's a User update event)
      Convert to a ChatRoom Notification model

At the end, there will be a List of
ChatRoom Message models and ChatRoom Notification model
```