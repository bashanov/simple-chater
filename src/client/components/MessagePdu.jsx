import React from 'react';

class MessagePdu extends React.Component {

    render() {
        return (
            <li className="pdu">
                {this.props.pdu.message}
                <span className="time">{this.props.pdu.username + ", " + this.props.pdu.time}</span>
            </li>
        )
    }
}

export default MessagePdu;