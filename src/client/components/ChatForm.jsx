import React from 'react';

class ChatForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            message: ''
        }
    }

    handleFormChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    preparePduToSend() {
        if (!this.props.isAuth && this.state.name !== '') {
            console.log('Check is auth...');
            this.props.callbackLoginAs(this.state.name);
        } else {
            console.log('Sending PDU...');
            this.props.callbackSendPdu({message: this.state.message});
            this.setState({message: ''});
            console.log('Sent!');
        }
    }

    render() {
        return (
            <div id="chat-form" className={!this.props.isConnected ? "d-none" : ""}>
                <div className="form-group">
                    <div className={this.props.isAuth ? "d-none" : ""}>
                        <label htmlFor="name">Name</label>
                        <input type="text" className="form-control" name="name" value={this.state.name}
                               onChange={(e) => this.handleFormChange(e)}
                               maxLength={20}
                        />
                    </div>
                    <div className={!this.props.isAuth ? "d-none" : ""}>
                        <label htmlFor="message">Message</label>
                        <textarea
                            className="form-control" name="message" rows="3" value={this.state.message}
                            onChange={(e) => this.handleFormChange(e)}
                            maxLength={200}
                        > </textarea>
                    </div>
                    <div>
                        <button type="button" className="btn btn-outline-primary"
                                style={{marginTop: "10px"}}
                                onClick={this.preparePduToSend.bind(this)}>{this.props.isAuth ? "Send" : "Log in"}
                        </button>
                    </div>
                    <div className={!this.props.isAuth ? "d-none" : ""}>
                        <button type="button" className="btn btn-outline-info"
                                style={{marginTop: "10px"}}
                                onClick={this.props.callbackLogOut}>Log out
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChatForm;