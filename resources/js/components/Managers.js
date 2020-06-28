import React, { Component } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import SuccessAlert from './SuccessAlert';
import ErrorAlert from './ErrorAlert';

import drop from '../../images/DropdownBase.png';
import search from '../../images/search-icon.png';
import {connect} from 'react-redux';

class Managers extends Component {

    constructor() {
        super();
        this.state = {
            companies: [],
            packages:[],
            alert_message: '',

            company_name: '',
            full_name: '',
            company_phone1:'',
            company_email:'',
            company_package:'',
            total_free:'',
            udate_client_id:null,
            searchVal:'',
            user:{},
            spin:false,
            deleteMe:0,
            status:1,
        }
        
        
        this.onSubmit = this.onSubmit.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.getClientData = this.getClientData.bind(this);
        // this.showEdit = this.showEdit.bind(this);

        this.companyName = this.companyName.bind(this);
        this.fullName = this.fullName.bind(this);
        this.companyPhone = this.companyPhone.bind(this);
        this.companyEmail = this.companyEmail.bind(this);
        this.packageStatus = this.packageStatus.bind(this);
        this.totalFree = this.totalFree.bind(this);
        this.search = this.search.bind(this);
        this.status = this.status.bind(this);
        this.blankFields = this.blankFields.bind(this)

    }
    packageStatus(e) {
        this.setState({
            company_package: e.target.value
        });
    }
    totalFree(e) {
        this.setState({
            total_free: e.target.value
        });
    }
    companyName(e) {
        this.setState({
            company_name: e.target.value
        });
    }

    fullName(e) {
        this.setState({
            full_name: e.target.value
        });
    }

    companyPhone(e) {
        this.setState({
            company_phone1: e.target.value
        });
    }

    companyEmail(e) {
        this.setState({
            company_email: e.target.value
        });
    }

    status(e) {
        this.setState({
            status: e.target.value
        });
    }

    onSubmit(e) {
        e.preventDefault();
        const client = {
            company_name: this.state.company_name,
            full_name: this.state.full_name,
            company_phone: this.state.company_phone1,
            company_email: this.state.company_email,
            company_package: this.state.company_package,
            total_free: this.state.total_free,
            status:this.state.status,
        }

        if(this.state.udate_client_id === null) {
            this.setState({spin : true,})
            axios.post(serverUrl+'api/client/new', client)
            .then(res => {               
                $("#NewClientForm").modal("hide");
                this.getClientData()
                this.blankFields()
                this.setState({spin : false,})
                this.setState({ alert_message: "", message:''});
            }).catch(error => {
                this.setState({ alert_message: "error", message:'The email or mobile has already been taken.'});
                this.setState({spin : false,})
            });

        } else {
            this.setState({spin : true,})
            axios.post(serverUrl+'api/client/update/'+ this.state.udate_client_id, client)
            .then(res => {
                $("#NewClientForm").modal("hide");
                this.setState({
                    udate_client_id: null
                });
                this.setState({spin : false,})
                this.blankFields()
                this.getClientData()               
                this.setState({ alert_message: "", message:''});
            }).catch(error => {
                this.setState({ alert_message: "error", message:'The email or mobile has already been taken.'});
                this.setState({spin : false,})
            });
        }
        
    }
    blankFields() {
        this.setState({
            company_name : '',
            full_name : '',
            company_phone1 : '',
            company_email : '',
            company_package : '',
            total_free : '',
            status : '',
        })
    }

    onDelete(client_id) {
        this.setState({spin:true})
        axios.post(serverUrl+'api/client/delete/' + client_id)
        .then(response => {
            var companies = this.state.companies;
            for (var i = 0; i < companies.length; i++) {
                if (companies[i].id == client_id) {
                    companies.splice(i, 1);
                    this.setState({ companies: companies });
                }
            }
            this.setState({spin:false})
            $('#deletePopup').modal('hide')                
        }).catch(error => {
            console.log('here',error)
        });

    }

    getClientData() {
        axios.post(serverUrl+'api/client')
            .then(response => {
                this.setState({
                    companies: response.data.data.clients,
                    packages: response.data.data.packages
                });

            }).catch(error => {
                console.log('here',error)
            });
    }
    async getUserData() {
        await axios.post(serverUrl+'api/auth/user')
        .then(async response => {
            this.setState({
                user: response.data.user_info,
            });
            console.log('here', this.state.user.type)
        }).catch(error => {
            console.log('here',error)
        });
    }

    async componentDidMount() {
        await this.getClientData()
        this.props.changeName('admin')
        localStorage.setItem('usre_role','')

    }

    showEdit(id) {
        this.setState({
            udate_client_id: id
        });
        axios.post(serverUrl+'api/client/show/' + id)
        .then(response => {
            console.log(response)
            
            this.setState({
                company_name : response.data.data.client.company_name,
                full_name : response.data.data.client.full_name,
                company_phone1 : response.data.data.client.company_phone1,
                company_email : response.data.data.client.company_email,
                company_package : response.data.data.client.company_package,
                total_free : response.data.data.client.total_free   ,             
                status : response.data.data.client.status                
            })
        });
    }

    search(e) {
        e.preventDefault()

        this.setState({
            searchVal: e.target.value
        });

        if(this.state.searchVal !== '') {
            axios.post(serverUrl+'api/client/search',{searchVal:this.state.searchVal})
                .then(response => {
                    console.log(response)
                    this.setState({
                        companies: response.data.data.clients,
                        // packages: response.data.data.packages
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
                            <h5>לקוחות</h5>{/* Managers */}
                        </div>
                        </div>
                        <div className="col-sm-6">
                        <div className="add_more">
                            <button className="add_more_btn btn" data-toggle="modal" data-target="#NewClientForm">לקוח חדש<i className="fa fa-plus" aria-hidden="true" /></button>
                        </div>
                        </div>
                    </div>
                    
                    <div className="table_block">
                        <div className="table-responsive">
                        <table className="table text-right table-hover">
                            <thead>
                            <tr>
                                <th>שם החברה </th>
                                <th>שם מלא</th>
                                <th>מייל</th>
                                <th>נייד</th>
                                <th>חבילה</th>
                                <th>מצב</th>
                                <th> מס’ מתעדכנים חינם </th>
                                <th />
                            </tr>
                            </thead>
                            <tbody>
                               

                           { this.state.companies.map(client => {
                                return (
                                    <tr key={client.id}>
                                    <td>{client.company_name}</td>
                                    <td><p className="rubik-regular">{client.full_name}</p></td>
                                    <td><p className="rubik-regular"><a href="mailto:info@azorim.co.il">{client.company_email}</a></p></td>
                                    <td><p className="rubik-regular">{client.company_phone1}</p></td>
                                    <td><p className="rubik-regular">{client.package.cost}</p></td>
                                    <td><span className="active-text"> {client.status==1 ? 'פעיל ' : 'לא פעיל'} </span></td>
                                    <td><p className="rubik-regular">{client.total_free}</p></td>
                                    <td>
                                    <div className="action-icons iconinline">
                                        <a onClick={this.showEdit.bind(this, client.id)} data-toggle="modal" data-target="#NewClientForm"><i className="fa fa-pencil" aria-hidden="true" /></a>

                                        <a onClick={()=>{this.setState({deleteMe:client.id})}} data-toggle="modal" data-target="#deletePopup"><i className="fa fa-trash" aria-hidden="true" /></a>

                                        <Link to={`/managers/${btoa(client.id)}/projects`}><i className="fa fa-building" aria-hidden="true" /></Link>

                                        <Link to={`/managers/${btoa(client.id)}/clients`}><i className="fa fa-user" aria-hidden="true" /></Link>
                                    </div>
                                    </td>
                                </tr>
                                )
                           }) }

                          </tbody>                
                        </table>              
                        </div>
                    </div>
                    </div>        
                </div>

                {/* Modal */}
                <div className="modal fade" ref={modal=> this.modal = modal} id="NewClientForm" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalCenterTitle">לקוח חדש</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">

                    {this.state.alert_message == "error" ? <ErrorAlert message={this.state.message} /> : null}

                    <form onSubmit={this.onSubmit}>
                        <div className="ClientForm">                           
                            <div className="row">
                                <div className="col-sm-6">
                                <div className="form-group text-right">
                                    <label>שם החברה</label>{/* Company Name */}
                                    <input required type="text" className="form-control custom-input" 
                                    value={this.state.company_name}
                                    onChange={this.companyName}
                                    />
                                </div>
                                </div>
                                <div className="col-sm-6">
                                <div className="form-group text-right">
                                    <label> שם מלא  </label>{/* Full name */}
                                    <input  required type="text" className="form-control custom-input" 
                                    value={this.state.full_name}
                                    onChange={this.fullName}
                                    />
                                </div>
                                </div>
                                <div className="col-sm-6">
                                <div className="form-group text-right">
                                    <label>מייל  </label>
                                    <input required type="email" className="form-control custom-input" 
                                    value={this.state.company_email}
                                    onChange={this.companyEmail}
                                    />
                                </div>
                                </div>
                                <div className="col-sm-6">
                                <div className="form-group text-right">
                                    <label>נייד </label>
                                    <input type="number" className="form-control custom-input" 
                                    value={this.state.company_phone1}
                                    onChange={this.companyPhone}
                                    />
                                </div>
                                </div>
                                <div className="col-sm-6">
                                <div className="form-group form-inline inline-content">
                                    <label>בחירת חבילה</label>{/* Package selection */}
                                    <span className="selectDropdown">
                                    <select required
                                    value={this.state.company_package}
                                    onChange={this.packageStatus}
                                    >   <option value="">בחירת חבילה</option>
                                        <option value="1">500</option>
                                        <option value="2">1000</option>
                                        <option value="3">2000</option>
                                        <option value="4">3000</option>
                                    </select>
                                    <img src={drop} alt="DropdownBase" className="DropdownBase" />
                                    </span>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="form-group form-inline inline-content">
                                    <label>מס’ מתעדכנים חינם</label>
                                    <span className="selectDropdown">
                                    <select required
                                    value={this.state.total_free}
                                    onChange={this.totalFree}
                                    >
                                        <option value="">מס’ מתעדכנים חינם</option>
                                        <option value="0">0</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                    <img src={drop} alt="DropdownBase" className="DropdownBase" />
                                    </span>
                                </div>
                                </div>

                                <div className="col-sm-6">
                                <div className="form-group form-inline inline-content">
                                    <label>פעיל</label>
                                    <span className="selectDropdown">
                                    <select required
                                    value={this.state.status}
                                    onChange={this.status}
                                    >
                                        <option value="1">פעיל</option>
                                        <option value="0">לא פעיל</option>
                                    </select>
                                    <img src={drop} alt="DropdownBase" className="DropdownBase" />
                                    </span>
                                </div>
                                </div>

                            </div>                        
                        </div>
                        <div className="modal-footer">
                            <button onClick={this.blankFields.bind(this)} type="button" className="btn cancel-btn" data-dismiss="modal">ביטול</button>{/* cancel button */}
                            {this.state.udate_client_id === null?
                            <button type="submit" className="btn  add-btn">
                                {this.state.spin?<i className="fa fa-spinner fa-spin" aria-hidden="true"></i>:''} הוסף
                            
                            </button>
                            :<button type="submit" className="btn  add-btn">
                                {this.state.spin?<i className="fa fa-spinner fa-spin" aria-hidden="true"></i>:''} שמירה
                            </button>
                            }
                            
                        </div>
                    </form>  
                    </div>
                    </div>
                </div>
                </div>

                {/* Modal */}
                <div className="modal fade show " id="deletePopup" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-modal="true" ><div className="modal-dialog modal-dialog-centered" style={{width:"400px"}}role="document"><div className="modal-content"><div className="modal-header"><h5 className="modal-title" id="exampleModalCenterTitle">מחק</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>
                <div className="modal-body">
                <div className="">                           
                            <div className="row">
                                <div className="col-sm-12">
                                <div className="form-group text-right">
                                    <p>האם אתה בטוח. אתה רוצה למחוק רשומה זו?</p>
                                </div>
                                </div>                             
                            </div>                        
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn cancel-btn" data-dismiss="modal">ביטול</button>
                        
                            <button onClick={this.onDelete.bind(this, this.state.deleteMe)} type="button" className="btn  add-btn">
                                {this.state.spin?<i className="fa fa-spinner fa-spin" aria-hidden="true"></i>:''} מחק
                            </button>
                            
                        </div>
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

export default connect(mapStateToProps,mapDispatchToProps) (Managers);