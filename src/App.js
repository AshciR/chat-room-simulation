import './App.css';
import ChatBubble from "./components/ChatBubble/ChatBubble";

function App() {

    // Just testing out the component that we'll use later
    const message = {
        userName: 'Richie',
        content: 'Hello World',
        isOwner: true,
        time: '6:00'
    }

    return (
        <ChatBubble
            userName={message.userName}
            message={message.content}
            isOwner={true}
            time={message.time}
        />
    );
}

export default App;
