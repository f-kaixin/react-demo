import React, { Component } from 'react';
import './index.scss';

export default class BlackList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            submitLoading: false
        }
    }

    render() {
        return (
            <div>黑名单应用列表</div>
        )
    }
}


