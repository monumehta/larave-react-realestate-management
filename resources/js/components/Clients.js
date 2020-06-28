import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import search from '../../images/search-icon.png';
import SuccessAlert from './SuccessAlert';
import ErrorAlert from './ErrorAlert';
import {connect} from 'react-redux'

class Clients extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customers: [],
            alert_message: '',
            message:'',
            searchVal:'',
            manager_id: atob(this.props.match.params.id),

        }
        
        this.search = this.search.bind(this)
        this.onDelete = this.onDelete.bind(this);
        this.getClientData = this.getClientData.bind(this);

    }

    onDelete(client_id) {
        axios.post(serverUrl+'api/customer/delete/' + client_id)
            .then(response => {
                var customers = this.state.customers;
                for (var i = 0; i < customers.length; i++) {
                    if (customers[i].id == client_id) {
                        customers.splice(i, 1);
                        this.setState({ customers: customers });                        
                    }
                }
                // this.setState({ alert_message_list: "success" , message:'Client deleted successfully!'})
            }).catch(error => {
                // this.setState({ alert_message_list: "error", message:'Please try again.' });
            })

    }
    
    getClientData() {
        axios.post(serverUrl+'api/customer/customerByClient/'+this.state.manager_id)
            .then(response => {
                console.log('response,',response)
                this.setState({
                    customers: response.data,
                });

            }).catch(error => {
                console.log('here',error)
            });
    }

    async componentDidMount() {
        await this.getClientData()
        this.props.changeName('manager')
        localStorage.setItem('manager_id', this.state.manager_id);
        localStorage.setItem('usre_role', 'manager');
    }

    search(e) {
        e.preventDefault()

        this.setState({
            searchVal: e.target.value
        });

        if(this.state.searchVal !== '') {
            axios.post(serverUrl+'api/customer/search',{searchVal:this.state.searchVal})
            .then(response => {
                console.log('response,',response)
                this.setState({
                    customers: response.data,
                });

            }).catch(error => {
                console.log('here',error)
            });
        }
    }

    render() {
        return (
           <div className="dashboard_content_block_Main">
                <header>
                    <div className="row ">
                    <div className="col-sm-12">
                        <div className="search-box">
                        <input type="text"  placeholder="חיפוש לקוח" value={this.state.searchVal} onChange={this.search} name="searchVal"/>
                        <img src={search} alt="search-icon" />
                        </div>
                    </div>
                    </div>       
                </header>
                
                <div className="dashboard_Table_block">
                    <div className="container">
                    <div className="row align-items-end">
                        <div className="col-sm-6">
                        <div className="Customers-title text-right">
                            <h5>לקוחות</h5>{/* Clients */}
                        </div>
                        </div>
                        <div className="col-sm-6">
                        <div className="add_more">
                            <Link to={`/managers/${btoa(this.state.manager_id)}/clients/add`} className="btn custom-btn ">לקוחות חדשים <i className="fa fa-plus" aria-hidden="true" /></Link>
                            
                        </div>
                        </div>
                    </div>
                    {this.state.alert_message_list == "success" ? <SuccessAlert message={this.state.message} /> : null}
                    {this.state.alert_message_list == "error" ? <ErrorAlert message={this.state.message} /> : null}
                    <div className="table_block">
                        <div className="table-responsive">
                        <table className="table table-hover text-right">
                            <thead>
                            <tr>
                                <th>Id</th>
                                <th>Project Id</th>
                                <th>שם מלא</th>
                                <th>מייל</th>
                                <th>נייד</th>
                                {/* <th>חבילה</th> */}
                                <th>מצב</th>
                                {/* <th>כמות חינם </th> */}
                                <th />
                            </tr>
                            </thead>
                            <tbody>
                            { this.state.customers.map(customer => {
                                return (
                                    <tr key={customer.id}>
                                        <td >{customer.id}</td>
                                        <td>{customer.project_id}</td>
                                        <td>{customer.full_name}</td>
                                        
                                        <td ><p className="rubik-regular">{customer.email}</p></td>
                                        <td><p className="rubik-regular">{customer.mobile}</p></td>
                                        {/* <td><p className="rubik-regular">1000</p></td> */}
                                        <td><span className="active-text"> {customer.status==1 ? 'פעיל ' : 'לא פעיל'} </span></td>
                                        {/* <td><p className="rubik-regular">{customer.total_free}</p></td> */}
                                        <td>
                                        <div className="action-icons iconinline">
                                            <Link to={`/managers/${btoa(this.state.manager_id)}/clients/edit/${btoa(customer.id)}`} > <i className="fa fa-pencil" aria-hidden="true" /></Link>
                                            <a onClick={this.onDelete.bind(this, customer.id)}><i className="fa fa-trash" aria-hidden="true" /></a>
                                        </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>                
                        </table>              
                        </div>
                    </div>
                    </div>        
                </div>

                </div>


        );
    }
}

const mapStateToProps = (state)=> {
    return {
        myname: state.name
    }
}

const mapDispatchToProps = (dispatch)=> {
    return {
        changeName:(name) => {dispatch({type:'CHANGE_NAME', payload: name})}
    }
}

export default connect(mapStateToProps,mapDispatchToProps) (Clients);