import React, { Component, PropTypes } from 'react';

export default class UserAvatar extends Component { // eslint-disable-line react/prefer-stateless-function
    static contextTypes = { userStore: PropTypes.object.isRequired };
    render() {
        const user = this.context.userStore.getUser();
        return <img src={user.avatarUrl} alt="user" />;
    }
}
