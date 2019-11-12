import React, { Component } from 'react';

export default class WhiteList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitLoading: false
        }
    }

    render() {
        return (
            <div>白名单应用管理</div>
        )
    }
}


