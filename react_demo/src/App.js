import React, { Component } from 'react';
import './App.css';
import store from 'src/store/index.js';
import { Router } from 'src/router/index.js';
import { Provider } from 'react-redux';

class App extends Component {
    render() {
        return ( 
            <Provider store={store}>
                <Router />
            </Provider>
        );
    }
}

export default App;