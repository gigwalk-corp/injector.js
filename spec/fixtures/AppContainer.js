import React, { Component, PropTypes } from 'react';
import UserAvatar from './UserAvatar';

export default class AppContainer extends Component {
    static propTypes = {
        injector: PropTypes.object // eslint-disable-line
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
                <UserAvatar />
            </div>
        );
    }
}
