import React from 'react';
import MessagePdu from "./MessagePdu.jsx";

let classNames = require('classnames');

class ChatBoard extends React.Component {
    getPreparedChat() {
        let chatHistory = [];
        let chatBlock = [];
        let queue = this.props.pduQueue;
        let blocks = 0;
        let lastKey = (queue.length - 1).toString(); // Keys in foreach are numeric, to avoid use parseInt every time
        Object.keys(queue).forEach((k) => {
            let prevPdu = queue[k - 1] !== undefined ? queue[k - 1] : queue[k];
            let currPdu = queue[k];
            if (prevPdu.type !== currPdu.type || prevPdu.my !== currPdu.my || prevPdu.username !== currPdu.username) {
                let className = classNames(prevPdu.type, "clearfix", {
                    "my": prevPdu.my
                });
                blocks++;
                chatHistory.push(<ul key={++blocks} className={className}>{chatBlock}</ul>);
                chatBlock = [];
            }
            chatBlock.push(<MessagePdu
                key={k}
                pdu={this.props.pduQueue[k]}
            />);
            if (k === lastKey) {
                let className = classNames(currPdu.type, "clearfix", {
                    "my": currPdu.my
                });
                chatHistory.push(<ul key={++blocks} className={className}>{chatBlock}</ul>);
            }
        });
        return chatHistory;
    }

    componentDidUpdate() {
        let chatBoard = document.getElementById("chat-board");
        chatBoard.scrollTop = chatBoard.scrollHeight;
    }


    render() {
        return (
            <div className="card">
                <div className="card-body chat-board" id="chat-board">
                    {this.getPreparedChat()}
                </div>
            </div>
        )
    }
}

export default ChatBoard;