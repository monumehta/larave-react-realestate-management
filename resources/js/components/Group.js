import React, { Component } from 'react';

import 'rc-color-picker/assets/index.css';
import ColorPicker from 'rc-color-picker';
import SuccessAlert from './SuccessAlert';
import ErrorAlert from './ErrorAlert';
import drop from '../../images/DropdownBase.png';


export default class Gropu extends Component {

    constructor() {
        super();
        this.state = {
            groups: [],
            selectedGroup:{
                name:'',
                color:''
            },
            color: '#ffffff',
            name:'',
            alert_message: '',
            managers:[],
            manager_id:'',
            user:{}
        }
        this.groupName = this.groupName.bind(this)
        this.changeHandler = this.changeHandler.bind(this)
        this.closeHandler = this.closeHandler.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.getUserData = this.getUserData.bind(this)
    }

    changeHandler(colors) {
        this.state.color = colors.color
    }
      
    closeHandler(colors) {
        this.state.color = colors.color
    }

    groupName(e) {
        this.setState({
            name: e.target.value
        });
    }


    getUserData() {
        axios.post(serverUrl+'api/auth/user')
            .then(async response => {
                this.setState({
                    user: response.data.user_info,
                });
                
                if(this.state.user.type == 0) {
                    await this.setState({ manager_id: localStorage.getItem('manager_id') });
                    await this.getGroups();
                } else if (this.state.user.type == 1){
                    await this.setState({manager_id:this.state.user.client_id})
                    await this.getGroups();
                }

            }).catch(error => {
                console.log('here',error)
            });
    }

    async getGroups() {
        axios.post(serverUrl+'api/groups',{manager_id:this.state.manager_id})
        .then(async response => {
            await this.setState({
                groups: response.data
            });

            if(response.data.length>0) {
                // this.selectThis(0)
            }else {
                this.setState({
                    groups: [],
                    selectedGroup:{
                        name:'',
                        color:''
                    },
                });
            }
        }).catch(error => {
            console.log('error',error)
        });
    }

    // selectThis(id) {
    //     console.log('idid',id, this.state.groups)
    //     this.setState({
    //         selectedGroup:{
    //             name:this.state.groups[id].name,
    //             steps:this.state.groups[id].timeline.steps
    //         },
    //     })
    // }
    
    async componentDidMount() {
        await this.getUserData()
        window.page = 'group'

        $(".Go_Group_list  li a svg").click(function(){
            $(".Doc_edits").toggle();
        });   


    }

    async onSubmit(e) {
        e.preventDefault();
        const client = {
            client_id: this.state.manager_id,
            name: this.state.name,
            color: this.state.color,
        }
        await axios.post(serverUrl+'api/groups/create', client)
        .then(async res => {
            this.setState({
                name : '',
                color:'#ffffff'
            })
            await this.getGroups();
        })
    }


    render() {
        return (
           <div className="dashboard_content_block_Main">
              <div>
                <header>
                </header>
                <div className="dashboard_Table_block Group_Management_Page">
                    <div className="container">

                    <div className="row align-items-end">
                        <div className="col-sm-12">
                        <div className="Customers-title text-right">
                            <h5>ניהול קבוצות </h5>{/* Group Management */}
                        </div>
                        </div>
                    </div>
                        
                        <form onSubmit={this.onSubmit}>
                        
                        <div className="Documents_Tabs">                  
                            <div className="row">
                            <div className="col-sm-3 border-left">
                                <div className="Documents_List">
                                <button type="button" className="btn new_file_btn">
                                    הוסף קבוצה
                                </button>{/* new file */}
                                <ul className="Go_Group_list">

                                    {this.state.groups.map((group,index) =>{
                                        return (
                                            <li key={index}>
                                            <a><i style={{
                                            color: group.color,
                                            }} className="fa fa-user"/> {group.name}  
                                                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx={12} cy={12} r={1} /><circle cx={12} cy={5} r={1} /><circle cx={12} cy={19} r={1} /></svg>
                                            </a>
                                            <div className="Doc_edits">
                                                <ul>
                                                <li><a><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg> עריכה</a></li>
                                                <li><a><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg> מחיקה</a></li>
                                                </ul>
                                            </div>
                                            </li>
                                        )
                                    })}
                                    {/* <li><a><img src="images/group-5.png" alt="group" />חתמו  
                                        <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx={12} cy={12} r={1} /><circle cx={12} cy={5} r={1} /><circle cx={12} cy={19} r={1} /></svg>
                                    </a>
                                    <div className="Doc_edits">
                                        <ul>
                                        <li><a><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg> עריכה</a></li>
                                        <li><a><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg> מחיקה</a></li>
                                        </ul>
                                    </div>
                                    </li> */}
                                </ul>
                                </div>{/* Documents_List */}
                            </div>

                            <div className="col-sm-9">
                            {this.state.alert_message == "success" ? <SuccessAlert message={this.state.message} /> : null}
                            {this.state.alert_message == "error" ? <ErrorAlert message={this.state.message} /> : null}

                                <div className="Documents_List Documents_uploading">
                                <div className="timeline_2">קבוצה חדשה
                                </div>
                                <div className="Group_Management_Form">

                                
                                    <div className="form-group text-right form-inline">
                                    <label>שם הקבוצה</label>
                                    <input required type="text" className="form-control custom-input" 
                                        value={this.state.name}
                                        onChange={this.groupName}
                                        />
                                    </div>
                                    <div className="form-group form-inline inline-content">
                                    <div className="custom-control custom-checkbox">
                                        <label> בחר צבע</label>{/* Choose a color */}
                                    </div>
                                    <span className="selectDropdown">
                                    <ColorPicker
                                    required
                                    color={this.state.color}
                                    alpha={30}
                                    onChange={this.changeHandler}
                                    onClose={this.closeHandler}
                                    placement="topLeft"
                                    className="some-class"
                                    ></ColorPicker>         
                                    </span>
                                    </div>
                                </div>
                                </div>{/* Documents_List */}
                                
                            </div>
                            
                            </div>
                            
                        </div>
                        <div className="GoNextPage">
                            <button type="submit" className="btn custom-btn"> עדכן </button> {/* the next */}                  
                        </div>
                        </form>
                    </div>        
                </div>
                </div>

           </div>


        );
    }
}

