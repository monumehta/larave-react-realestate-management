import React, { Component } from 'react'
import { Link, Route } from 'react-router-dom';
import SuccessAlert from './SuccessAlert';
import ErrorAlert from './ErrorAlert';
import moment from 'moment'
import {connect} from 'react-redux'

class Projects extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projects: [],
            alert_message: '',
            message:'',
            user:{},
            searchVal:'',
            manager_id: atob(this.props.match.params.id),
            deleteMe:0,
            spin:false,
            company_package:'',
            manager_status:1,
            news:[],

        }      
        
        this.onDelete = this.onDelete.bind(this);
        this.getProjectData = this.getProjectData.bind(this);
        this.search = this.search.bind(this);
        this.showEdit = this.showEdit.bind(this)
    }

    onDelete(client_id) {
        this.setState({spin:true})
        axios.post(serverUrl+'api/project/delete/' + client_id)
            .then(response => {
                var projects = this.state.projects;
                for (var i = 0; i < projects.length; i++) {
                    if (projects[i].id == client_id) {
                        projects.splice(i, 1);
                        this.setState({ projects: projects });                        
                    }
                }
                this.setState({spin:false})
                $('#deletePopup').modal('hide') 
            })

    }
    
    getProjectData(manager_id) {
        axios.post(serverUrl+'api/project/projectByClient/'+manager_id)
            .then(response => {
                console.log('response,',response)
                this.setState({
                    projects: response.data.data,
                });

            }).catch(error => {
                console.log('here',error)
            });
    }


    newsByClient(manager_id) {
        axios.post(serverUrl+'api/project/newsByClient/'+manager_id)
            .then(response => {
                console.log('response,',response)
                this.setState({
                    news: response.data.data,
                });

            }).catch(error => {
                console.log('here',error)
            });
    }

    userData() {
        axios.post(serverUrl+'api/auth/user')
            .then(response => {
                console.log(response)
                this.setState({
                    user: response.data.user_info,
                });

            }).catch(error => {
                console.log('here',error)
            });
    }

    showEdit() {
        axios.post(serverUrl+'api/client/show/' + this.state.manager_id)
        .then(response => {
            this.setState({
                company_package : response.data.data.client.company_package,
                manager_status : response.data.data.client.status,                
            })
        });
    }

    async componentDidMount() {
        await this.getProjectData(this.state.manager_id)
        await this.newsByClient(this.state.manager_id)        
        await this.userData()
        await this.showEdit()
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
            axios.post(serverUrl+'api/project/search',{
                searchVal:this.state.searchVal,
                manager_id:this.state.manager_id
            })
            .then(response => {
                console.log('response,',response)
                this.setState({
                    projects: response.data.data.projects,
                });

            }).catch(error => {
                console.log('here',error)
            });
        }
        

    }

    async dublicate(project_id) {
        axios.post(serverUrl+'api/project/duplicate/'+project_id)
        .then(async response => {
            await this.getProjectData(this.state.manager_id)
        });
    }

    render() {
        

        var packages;
        var updated;
        if (this.state.company_package == 1) {
            packages = 'SMALL';
            updated = 500;
        } else if (this.state.company_package == 2) {
            packages = 'MEDIUM'
            updated = 1000;
        } else if (this.state.company_package == 3) {
            packages = 'LARGE'
            updated = 2000;
        }else {
            packages = 'XL'
            updated = 3000;
        }

        return (
            <div className="dashboard_content_block_Main">
                 <div>
                <header>
                    <div className="row ">
                    <div className="col-sm-6">
                        <ul className="software_update_block">
                            <li>
                            <Link className="Software_upgrade_btn secondary_btn" to={`/managers/${btoa(this.state.manager_id)}/purchase`} > 
                            שדרוג תוכנה   <img src="/images/upgrade-icon.png" alt="upgrade-icon" /></Link>

                            </li>
                            <li>
                            <p className="Total-updated">סך הכל מתעדכנים </p>
                            <h6><span>{updated}</span> <span>מתוך</span> <span>
                                {this.state.news?this.state.news.length:0}
                            </span> </h6>
                            <div className="progress" style={{height: 4}}>
                                <div className="progress-bar" role="progressbar" style={{width: `${this.state.news?(this.state.news.length*100)/updated:0}%`}} aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} />
                            </div>
                            </li>
                        </ul>
                        </div>

                    <div className="col-sm-6">
                        <div className="search-box">
                        <input type="text"  placeholder="חיפוש לקוח" value={this.state.searchVal} onChange={this.search} name="searchVal"/>
                        <img src="/images/search-icon.png" alt="search-icon" />
                        </div>
                    </div>
                    </div>        
                </header>
                <div className="dashboard_Table_block">
                    <div className="container">
                    <div className="row align-items-end">
                        <div className="col-sm-6">
                        <div className="projects-title text-right">
                            <h5>פרוייקטים</h5>
                        </div>
                        </div>
                        <div className="col-sm-6">
                            {this.state.user.type!=3?
                                <div className="add_more">
                                    <Link to={`/managers/${btoa(this.state.manager_id)}/projects/add`} className="btn custom-btn ">פרוייקט חדש    <i className="fa fa-plus" aria-hidden="true" /></Link>
                                </div>
                            :''}
                        </div>
                    </div>
                    <div className="table_block Projects_Table">
                        <div className="table-responsive">
                        <table className="table text-right table-hover">
                            <thead>
                            <tr>
                                <th> שם הפרוייקט </th>
                                <th> סטטוס </th>
                                <th> עדכון האחרון </th>
                                <th> מתעדכנים </th>
                                <th>  </th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.projects ?
                                this.state.projects.map(project => {
                                    return (
                                    <tr key={project.id}>
                                        <td> {project.project_name}</td>
                                        <td> <p className="rubik-Medium"> {project.is_published}   </p></td>
                                        <td><span className="rubik-regular">{moment(project.updated_at).format('DD/MM/YYYY')}</span></td>
                                        <td><span className="rubik-regular">{project.subscribers_count}</span></td>
                                        <td>
                                       <div className="btn-group dropup">
                                        <button type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            עריכה
                                        </button>
                                        <div className="dropdown-menu action-icons">

                                            {this.state.user.type!=3?
                                                <Link className="dropdown-item" to={`/managers/${btoa(project.client_id)}/projects/edit/${btoa(project.id)}`} > <i className="fa fa-pencil" aria-hidden="true" />עריכה</Link>
                                            :''}

                                            {this.state.manager_status && (this.state.user.type == 0 || this.state.user.type == 1) ? 
                                                <Link target="_blank" className="dropdown-item" to={`/managers/${btoa(project.client_id)}/projects/viewa/${btoa(project.id)}`} > <i className="fa fa-eye" aria-hidden="true" />הצגה</Link>
                                            :
                                            <Link target="_blank" className="dropdown-item" to={`/error`} > <i className="fa fa-eye" aria-hidden="true" />הצגה</Link>
                                            }

                                            {this.state.user.type == 3? 
                                                <Link  className="dropdown-item" to={`/projects/viewCustomer/${btoa(project.id)}`} > <i className="fa fa-eye" aria-hidden="true" />הצגה</Link>  
                                            :''}

                                            {this.state.user.type==1?
                                                  <a target="_blank" className="dropdown-item" onClick={this.dublicate.bind(this, project.id)} >
                                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 19" width={18} height={15}>
                                                      <path id="Layer" className="shp0" d="M12 2L2 7L12 12L22 7L12 2L12 2Z" />
                                                      <path id="Layer" className="shp0" d="M2 12L12 17L22 12" />
                                                  </svg>    
                                                  שכפול 
                                                  </a>
                                            :''}

                                            {this.state.user.type!=3?
                                                <a className="dropdown-item" onClick={()=>{this.setState({deleteMe:project.id})}} data-toggle="modal" data-target="#deletePopup"><i className="fa fa-trash" aria-hidden="true" />מחיקה</a>
                                            :''} 
                                          

                                        </div>
                                        </div>

                                        </td>
                                    </tr>
                                    )
                                }) : null}
                            </tbody>                
                        </table>              
                        </div>
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
        )
    }
}

const mapStateToProps = (state)=> {
    return {
        myname: state.name
    }
}

const mapDispatchToProps = (dispatch)=> {
    return {
        changeName:(name) => {dispatch({type:'CHANGE_NAME', payload: name})},
    }
}

export default connect(mapStateToProps,mapDispatchToProps) (Projects);