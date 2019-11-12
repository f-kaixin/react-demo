import React from 'react';
import './index.scss';
import imgUrl from './../../assets/images/error.svg';

const NotFound = () => (
    <div id="not_found">
	    <img src={imgUrl}></img>
        <h2>火星了···</h2>
    </div>
)

export default NotFound