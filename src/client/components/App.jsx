import React from 'react';
import socket from './socket';
import Chat from "./Chat.jsx";

class App extends React.Component {
    render() {
        return (
            <Chat
                client={socket()}
            />
        )
    }
}

export default App;