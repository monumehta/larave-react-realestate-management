import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import HeaderClient from './HeaderClient';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
require('jquery-ui');
require('jquery-ui/ui/widgets/sortable');
require('jquery-ui/ui/widgets/accordion');
require('jquery-ui/ui/disable-selection');

window.serverUrl = window.location.origin+'/' //global variable
window.page = ''


import {createStore} from 'redux'
import {Provider} from 'react-redux'
import reducer from '../reducers'
const store = createStore(reducer)
// localStorage.setItem('usre_role','admin')

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:{}
        }
        this.getUserData = this.getUserData.bind(this);
    }

    async getUserData() {
        await axios.post(serverUrl+'api/auth/user')
        .then(async response => {
            this.setState({
                user: response.data.user_info,
            });
        }).catch(error => {
            console.log('here',error)
        });
    }

    async componentDidMount() {
        this.getUserData().then(() => {
            setTimeout(() => {
                const ele = document.getElementById('ipl-progress-indicator')
                    if(ele){
                    // fade out
                    ele.classList.add('available')
                    setTimeout(() => {
                        // remove from DOM
                        ele.outerHTML = ''
                    }, 2000)
                }
            }, 1000)
          })
     }
       


    render() {

        // console.log('hello',store.getState())
        // store.dispatch( rootReducer({ title: 'React Redux Tutorial for Beginners', id: 1 }) );

        // console.log('hello',store.getState())
        
        return (
            
            <div>
                { this.state.user.type === 0 || this.state.user.type === 1 ?
                    <Header />
                :
                    <HeaderClient />
                }
            </div>
        );
    }
}




if (document.getElementById('app')) {
    ReactDOM.render(
        <Provider store={store}>
            <Router>
                <Index />
            </Router>
        </Provider>
    , document.getElementById('app'));
}
