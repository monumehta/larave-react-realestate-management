import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';

import Dashboard from './Dashboard';
import Clients from './Clients';
import AddClient from './AddClient';
import AddProjectClient from './AddProjectClient';
import EditClient from './EditClient';
import Managers from './Managers';
import Projects from './Projects';
import AddProjects from './AddProjects';
import EditProjects from './EditProjects';
import ViewAdmin from './ViewAdmin';
import Template from './Template';
import Group from './Group';
import Setting from './Setting';
import ErrorPage from'./ErrorPage';
import Recipeints from'./Recipeints';
import Purchase from'./Purchase';

import logo from'../../images/logo.png';
import circle from'../../images/circle.png';
import icon from'../../images/icon.png';
import blocks from'../../images/blocks.png';
import calander from'../../images/calander.png';
import user from'../../images/user.png';
import setting from'../../images/setting.png';
import logout from'../../images/logout.png';

import {connect} from 'react-redux'

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



class Header extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user:{},
            company_logo:null,
            active:'dashboard',
            manager_selected:true,
            manager_selected_id:''
        }

        this.getClientData = this.getClientData.bind(this);
        this.logout = this.logout.bind(this);

    }


    logout() {
        axios.post(serverUrl+'api/auth/logout')
        .then(response => {
            localStorage.setItem('usre_role','')
            localStorage.setItem('manager_id',0)
            location.reload()
        }).catch(error => {
            console.log('here',error)
        });
    }

    async getClientData() {
        await axios.post(serverUrl+'api/auth/user')
            .then(async response => {
                
                await this.setState({
                    user: response.data.user_info,
                });

                if(this.state.user.type == 1)  {
                    await axios.post(serverUrl+'api/client/show/' + this.state.user.client_id)
                    .then(response => {
                        this.setState({
                            company_logo: response.data.data.client.company_logo
                        })
                    });
                    localStorage.setItem('usre_role','manager')
                    this.props.changeName('manager')

                }

                if(this.state.user.type == 0) {
                    this.setState({active:'manager', manager_selected:false})
                    if(localStorage.getItem('usre_role') == 'manager') {
                        this.props.changeName('manager')
                    }
                }
                

            }).catch(error => {
                console.log('here',error)
            });
    }

    async componentDidMount() {
        await this.getClientData()
    }

     render() {

        console.log('myname', this.props.myname)
        
        const viewPage = window.location.pathname.includes("/projects/viewa/");
        const recPage = window.location.pathname.includes("/projects/recipeints/");
        const error = window.location.pathname.includes("error");
        
        return (            

            <div>
                { !viewPage && !recPage && !error?
                <div className="dashboard_menu">
                    <figure className="logo">
                        <img src={logo} alt="Go Clear Logo" />
                    </figure>
                    <div className="Gc_menu" >
                        <div className="logoo">
                            {this.state.user.type == 0 || this.state.company_logo == null? 
                                <img className="logoin" src={circle} alt="Go Clear" />
                            :''}
                            {this.state.user.type == 1 && this.state.company_logo != null ?
                                <img className="logoin" src={`/uploads/${this.state.company_logo}`} alt="Go Clear" />
                            :''}
                        </div>
                        <figcaption>{this.state.user.name}</figcaption>
                        <nav>
                        <ul>
                            {this.state.user.type != 0 ? 
                            <li className={this.state.active=='dashboard'?'active':''} onClick={()=>{this.setState({active:'dashboard'})}}>
                                <Link className="nav-link" to="/dashboard"><img src={icon} alt="Go Clear" /> דאשבורד </Link>
                            </li>
                            :''}

                            {this.state.user.type ==0 ? 
                            <li className={this.state.active=='manager'?'active':''} onClick={()=>{this.setState({active:'manager'})}}>
                                <Link className="nav-link" to="/managers"><img src={blocks} alt="Go Clear" />{this.state.user.type == 0 ?'לקוחות' : 'פרויקטים'}</Link>
                            </li>
                             : ''}

                             {this.state.user.type ==1 ? 
                            <li className={this.state.active=='manager'?'active':''} onClick={()=>{this.setState({active:'manager'})}}>
                                <Link className="nav-link" to={`/managers/${btoa(this.state.user.client_id)}/projects`}><img src={blocks} alt="Go Clear" />{this.state.user.type == 0 ?'לקוחות' : 'פרויקטים'}</Link>
                            </li>
                             : ''}

                            {this.props.myname=='manager' &&
                           <li className={this.state.active=='template'?'active':''} onClick={()=>{this.setState({active:'template'})}}>
                                <Link className="nav-link" to="/template"><img src={calander} alt="Go Clear" /> תבניות </Link>
                            </li>
                            }
                            
                            {this.props.myname=='manager' &&
                            <li className={this.state.active=='group'?'active':''} onClick={()=>{this.setState({active:'group'})}}>
                                <Link className="nav-link" to="/group"><img src={user} alt="Go Clear" />קבוצות  </Link>
                            </li>
                            }

                            {this.props.myname=='manager' &&
                            <li className={this.state.active=='setting'?'active':''} onClick={()=>{this.setState({active:'setting'})}}>
                                <Link className="nav-link" to="/setting"><img src={setting} alt="Go Clear" />הגדרות </Link>
                            </li>
                            }

                            <li >
                                <a className="nav-link" onClick={this.logout.bind(this)}><img src={logout} alt="logout icon" /> להתנתק </a>
                            </li>
                        </ul>
                        </nav>
                    </div>
                </div>
                :""}

                <div className="">
                    <Switch>
                        {this.state.user.type != 0 ? 
                            <Route exact path='/' component={Dashboard} />
                        :''}

                        {this.state.user.type != 0 ? 
                            <Route exact path='/dashboard' component={Dashboard} />
                        :''}
                        
                        {this.state.user.type == 0 ? 
                            <Route exact path='/managers' component={Managers} />
                        :''}
                        {this.state.user.type != 3 ?
                            <Route exact path='/managers/:id/projects' component={Projects} />
                        :''}
                        {this.state.user.type != 3 ?
                            <Route exact path="/managers/:id/projects/add" component={AddProjects} />
                        :''}

                        {this.state.user.type != 3 ?
                            <Route exact path="/managers/:id/projects/edit/:project_id" component={EditProjects} />
                        :''}

                        {this.state.user.type != 3 ?
                            <Route exact path='/managers/:id/clients' component={Clients} />
                        :''}
                        {this.state.user.type != 3 ?
                            <Route exact path="/managers/:id/clients/add" component={AddClient} />
                        :''}

                        {this.state.user.type != 3 ?
                            <Route exact path="/managers/:id/projects/:project_id/clients/add" component={AddProjectClient} />
                        :''}

                        {this.state.user.type != 3 ?
                            <Route exact path="/managers/:manager_id/clients/edit/:id" component={EditClient} />
                        :''}

                        {this.state.user.type != 3 ?
                            <Route exact name="viewa" path="/managers/:manager_id/projects/viewa/:id" component={ViewAdmin} />
                        :
                            ''
                        }
                        
                        <Route exact path="/managers/:manager_id/projects/recipeints/:id" component={Recipeints} />

                        <Route exact path="/managers/:id/purchase" component={Purchase} />                            
                        <Route exact path='/template' component={Template} />
                        <Route exact path='/group' component={Group} />
                        <Route exact path='/setting' component={Setting} />
                        <Route exact path="/*" component={ErrorPage} />

                    </Switch>
                </div>

            </div>

        );
    }
}


export default connect(mapStateToProps,mapDispatchToProps) (Header);