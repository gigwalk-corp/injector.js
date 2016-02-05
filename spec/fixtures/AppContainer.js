import UserAvatar from './UserAvatar';
import React, { Component, PropTypes } from 'react';

export default class AppContainer extends Component {
    static propTypes = {
        injector: PropTypes.object
    };

    static childContextTypes = {
        userStore: PropTypes.object
    };

    getChildContext() {
        return {
            userStore: this.props.injector.getInstance('userStore')
        };
    }

    render() {
        return (
            <div>
                <UserAvatar/>
            </div>
        );
    }
}
