import React from 'react';
import ChatForm from "./ChatForm.jsx";
import ChatBoard from "./ChatBoard.jsx";

class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            user_id: '',
            auth: false,
            connected: false,
            pduQueue: [],
            online: 0
        };

        this.props.client.listenConnect((id) => {
            this.setState({user_id: id, connected: true})
        });
    }

    componentDidMount() {
        this.checkIsAuth();
        this.props.client.handlePdu((pdu) => {
            this.handlePdu(pdu);
        });
    }

    handlePdu(pdu) {
        switch (pdu.type) {
            case "info":
            case "message":
                this.setState({
                    pduQueue: [...this.state.pduQueue, {
                        type: pdu.type,
                        time: pdu.time,
                        message: pdu.message,
                        my: pdu.username !== undefined && pdu.username === this.state.username,
                        username: pdu.username
                    }]
                });
                break;
            case "service":
                this.setState({online: pdu.online});
                break;
        }
    }

    checkIsAuth() {
        fetch('/api/is_auth', {
            method: 'POST'
        })
            .then(res => res.json())
            .then(res => {
                this.setState({auth: res.is_auth, username: res.username});
            });
    }

    handleLogOut() {
        this.props.client.logOut((success) => {
            if (success) {
                console.log('Gone');
                this.setState({auth: false, username: ''});

            }
        });
    }

    handleLoginAs(username) {
        this.props.client.logIn(username, (success) => {
            if (success) {
                this.setState({
                    username: username,
                    auth: true
                })
            }
        });
    }

    handleSendPdu(data) {
        if (this.state.auth) {
            this.props.client.sendPdu(data.message, this.state.username);
        }
    };

    render() {
        return (
            <div>
                Online: {this.state.online}
                <ChatBoard
                    pduQueue={this.state.pduQueue}
                />
                <ChatForm
                    isConnected={this.state.connected}
                    isAuth={this.state.auth}
                    callbackLoginAs={(username) => {
                        this.handleLoginAs(username)
                    }}
                    callbackSendPdu={(data) => {
                        this.handleSendPdu(data)
                    }}
                    callbackLogOut={this.handleLogOut.bind(this)}
                />
            </div>
        );
    }
}

export default Chat;