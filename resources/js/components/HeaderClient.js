import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import ViewCustomer from './client/ViewCustomer';
import ErrorPage from'./client/ErrorPage';

export default class HeaderClient extends Component {

    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout() {
        axios.post(serverUrl+'api/auth/logout')
        .then(response => {
            location.reload()
        }).catch(error => {
            console.log('here',error)
        });
    }

    render() {
        return (

            <div>
                <div className="">
                    <Switch>                            
                        <Route exact path="/projects/vuec/:id" component={ViewCustomer} />
                        <Route exact path="/*" component={ErrorPage} />
                    </Switch>

                </div>

            </div>

        );
    }
}