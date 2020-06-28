import React, { Component } from 'react';
import calander from '../../images/calander-icon.png';
import drop from '../../images/DropdownBase.png';
import SuccessAlert from './SuccessAlert';
import ErrorAlert from './ErrorAlert';

export default class Template extends Component {
    constructor() {
        super();
        this.state = {
            templates: [],
            selectedTemplate:{
                id:'',
                name:'',
            },
            steps:[],
            title:'',
            alert_message: '',
            message:'',
            client_id:'',
            step:"",
            user:{},
            managers:[],
            manager_id:'',
            items:['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6']
        }
        
        this.selectThis = this.selectThis.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.addSteps = this.addSteps.bind(this)
        this.title = this.title.bind(this)
        this.step = this.step.bind(this)
        this.getAllManagers = this.getAllManagers.bind(this)
        // this.handleManager = this.handleManager.bind(this)
        this.getUserData = this.getUserData.bind(this)
    }

    async getUserData() {
       await axios.post(serverUrl+'api/auth/user')
            .then(async response => {
                await this.setState({
                    user: response.data.user_info,
                });

                if(this.state.user.type == 0) {
                    // await this.getAllManagers();
                    await this.setState({ manager_id: localStorage.getItem('manager_id') });
                    if(this.state.manager_id!=='') {
                        await this.getTemplates();
                    }
                } else if (this.state.user.type == 1){
                    await this.setState({manager_id:this.state.user.client_id})
                    await this.getTemplates();
                }
            });
    }
    
    async getAllManagers() {
        await axios.post(serverUrl+'api/client')
        .then(response => {
            this.setState({
                managers: response.data.data.clients,
            });
        });
    }


    // async handleManager(e) {
    //     const input = e.target;
    //     const name = input.name;
    //     const value = input.type === 'checkbox' ? input.checked : input.value;

    //     await this.setState({ manager_id: this.props. });
    //     console.log(this.state.manager_id)
    //     if(this.state.manager_id!=='') {
    //         await this.getTemplates();
    //     }
    // }

    title(e) {
        this.setState({
            title: e.target.value
        });
    }

    step(e) {
        this.setState({
            step: e.target.value
        });
    }

    async addSteps(e) {
        e.preventDefault()
        const data = {
            id: this.state.selectedTemplate.id,
            step : this.state.step
        }

        this.setState({step: ''});

        await axios.post(serverUrl+'api/timelines/update/'+this.state.selectedTemplate.id,data)
        .then(response => {
            $('#NewClientForm').modal('hide');
            $('#steps').modal('hide');
        })

        await this.getTemplates();
    }

    async onSubmit(e) {
        e.preventDefault()
        axios.post(serverUrl+'api/timelines/new',{name:this.state.title, manager_id:this.state.manager_id})
        .then(response => {
            $('#NewClientForm').modal('hide');
            $('#steps').modal('hide');
        });
        await this.getTemplates();
    }

    async getTemplates() {
        await axios.post(serverUrl+'api/timelines/timeineByClient/'+this.state.manager_id)
            .then(response => {
                this.setState({
                    templates: response.data
                });
                if(response.data.length>0) {
                    this.setState({
                        selectedTemplate:{
                            id:response.data[0].id,
                            name:response.data[0].name,
                            
                        },
                        steps:response.data[0].timeline
                    })
                } else {
                    this.setState({
                        selectedTemplate:{
                            id:'',
                            name:'',
                        },
                        steps:[]
                    })
                }
                
            })
    }

    // subdivisionaddress = idx => evt => {
    //     const newsubdivisions = this.state.subdivisions.map((subdivision, sidx) => {
    //       if (idx !== sidx) return subdivision;
    //       return { ...subdivision, address: evt.target.value };
    //     });
    
    //     this.setState({ subdivisions: newsubdivisions });
    //   };


    subdivisionaddress = idx => evt => {
        const newsteps = this.state.steps.map((step, sidx) => {
            if (idx !== sidx) return step;
            return { ...step, step_name: evt.target.value };
        });
console.log(newsteps)
this.setState({ steps: newsteps });
        // this.setState({
        //     selectedTemplate:{
        //         id:this.state.templates[id].id,
        //         name:this.state.templates[id].name,
        //         steps:newsubdivisions
        //     },
        // })

        // this.setState({ selectedTemplate: newsubdivisions });
    };

    selectThis(id) {
        this.setState({
            selectedTemplate:{
                id:this.state.templates[id].id,
                name:this.state.templates[id].name,
            },
            steps:this.state.templates[id].timeline
        })
    }

    async updateSteps() {
        let data = {
            steps:this.state.steps
        }
        await axios.post(serverUrl+'api/timelines/updateSteps/'+this.state.selectedTemplate.id,data)
        .then(response => {
            console.log(response)
        }).catch(error => {
            console.log(response)
        })
    }
    
   async componentDidMount() {
        await this.getUserData()  
        window.page = 'template'  
        
        
        
    }

     onSortEnd = ({oldIndex, newIndex}) => {
            this.setState(({steps}) => ({
              steps: arrayMove(steps, oldIndex, newIndex),
            }));

            console.log(this.state.steps)
          };

    render() {

        setTimeout((_this)=> {
            $('.sortable').sortable({
                update: function (event, ui) {
                    var value = []
                    $('.sortable tr').each(element => {
                       let num = $('.sortable tr')[element].cells[0].innerText-1
                        value.push(num)
                    });
                    
                    var steps = []
                    value.forEach((element ,index) => {
                        console.log(element)
                        // steps[index] = _this.state.steps[element]
                        steps.push(_this.state.steps[element])
                    });

                    _this.setState({steps})

                    console.log('steps',_this.state.steps)
                }
            });
        },1000,this)
         
         

        return (
            
            <div className="dashboard_content_block_Main">
                <header>
                
                

                </header>
                <div className="dashboard_Table_block">
                    <div className="container">
                    <div className="row align-items-end">
                        <div className="col-sm-6">
                        <div className="Customers-title text-right">
                            <h5> ניהול תבניות ציר זמן </h5>{/* Manage timeline templates */}
                        </div>
                        </div>
                    </div>

                    {/* {this.state.user.type == 0?
                    <div className="row ">
                    <div className="col-sm-12">
                    <ul className="GoTemplateBlock">
                        <li>
                         פרויקטים
                        </li>
                        <li>                        
                        <div className="form-group form-inline inline-content">
                            <span className="selectDropdown">
                            <select required value={this.state.manager_id} onChange={this.handleManager} name="manager_id">
                            <option value=''>פרויקטים </option>
                                {this.state.managers.map((manager,index)=> {
                                    return (
                                        <option key={index} value={manager.id}>{manager.company_name} </option>
                                    )
                                })}
                                
                            </select>
                            <img src={drop} alt="DropdownBase" className="DropdownBase" />
                            </span>
                        </div>
                        </li>
                    </ul>
                    </div>
                </div>
                :''} */}
                    <div id="GoTabsBlock">
                        <div className="manage-wrapper">
                        {/* Tab_content1  Starts*/}
                        <div className="GoTab_Content">
                            <div className="Documents_Tabs">                  
                            <div className="row">
                                <div className="col-sm-3 border-left">
                                <div className="Documents_List">
                                    <button data-toggle="modal" data-target="#NewClientForm" className="btn adding_btn timeline">
                                    הוספת תבנית ציר זמן 
                                    </button>

                                    <ul>

                                    { this.state.templates.map((temp, index) => {
                                    return (
                                        <li key={index}>
                                            <a >
                                                <span onClick={this.selectThis.bind(this, index)}>
                                                    <img src={calander} alt="calander-icon" className="calander-icon"/> 
                                                    {temp.name} 
                                                </span>
                                                {/* <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx={12} cy={12} r={1} /><circle cx={12} cy={5} r={1} /><circle cx={12} cy={19} r={1} /></svg> */}
                                            </a>
                                            {/* <div className="Doc_edits">
                                                <ul>
                                                    <li><a><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg> עריכה </a></li>
                                                    <li><a><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg> מחיקה</a></li>
                                                </ul>
                                            </div> */}
                                        </li>

                                    )
                                    }) }

                                    {/* <li><a>
                                        <img src="images/calander-icon.png" alt="calander-icon" className="calander-icon" />
                                        תבנית ציר זמן 5
                                        <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx={12} cy={12} r={1} /><circle cx={12} cy={5} r={1} /><circle cx={12} cy={19} r={1} /></svg>
                                    </a>
                                    <div className="Doc_edits">
                                        <ul>
                                        <li><a><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg> עריכה </a></li>
                                        <li><a><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg> מחיקה</a></li>
                                        </ul>
                                    </div>
                                    </li> */}

                                    </ul>
                                </div>{/* Documents_List */}
                                </div>
                                <div className="col-sm-9">
                                <div className="Documents_List adding-step">
                                    <button data-toggle="modal" data-target="#steps" className="btn adding_btn">
                                    הוספת שלב
                                    </button>
                                    
                                    <div className="timeline_2">
                                    {this.state.selectedTemplate.name?
                                        <img style={{marginLeft:'20px'}} src="images/calander-icon-grey.png" alt="calander-icon-grey" /> 
                                    :''} 
                                    {this.state.selectedTemplate.name}
                                    </div>

                                <div className="timelineTable">   
                                { this.state.steps && this.state.steps.length > 0 ?
                                    <table className="table text-right">
                                        <tbody className="sortable">
                                            {this.state.steps.map((step, index) => {
                                            return (
                                                <tr key={index} className="form-group text-right one ">
                                                    <td className="tempp">{(index+1)}</td>
                                                    <td><input required value={step.step_name}type="text" className="form-control custom-input" name="step_name" onChange={this.subdivisionaddress(index)}/></td>
                                                </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                    :''}
                                    </div>
                                </div>{/* Documents_List */}
                                </div>
                            </div>
                            </div>
                            <div className="GoNextPage mt-5">
                            <a onClick={this.updateSteps.bind(this)} className="btn custom-btn">שמירה</a>                  
                            </div>
                        </div>{/* Tab_content3 Ends*/}
                        </div>
                    </div>
                    </div>        
                </div>


                {/* Modal */}
                <div className="modal fade" ref={modal=> this.modal = modal} id="NewClientForm" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalCenterTitle">תבנית ציר זמן חדשה</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">

                    <form onSubmit={this.onSubmit}>

                        <div className="ClientForm">                           
                            <div className="row">

                            {/* {this.state.user.type == 0?
                                <div className="col-sm-6">
                                <div className="form-group text-right">
                                    <label>פרויקטים </label>
                                    <select required value={this.state.manager_id} onChange={this.handleManager} name="manager_id">
                                    <option value=''>פרויקטים </option>
                                        {this.state.managers.map((manager,index)=> {
                                            return (
                                                <option key={index} value={manager.id}>{manager.company_name} </option>
                                            )
                                        })}                                        
                                    </select>
                                </div>
                                </div>
                            :''} */}
                                <div className="col-sm-6">
                                    <div className="form-group text-right">
                                        <label>שם </label>
                                        <input type="text" className="form-control custom-input" 
                                        value={this.state.title}
                                        onChange={this.title}
                                        />
                                    </div>
                                </div>
                            </div>                        
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn cancel-btn" data-dismiss="modal">ביטול</button>
                            <button type="submit" className="btn  add-btn">הוסף</button>
                        </div>
                    </form>  
                    </div>
                    </div>
                </div>
                </div>


                {/* Modal */}
                <div className="modal fade" ref={modal=> this.modal = modal} id="steps" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalCenterTitle"> הוספת שלב</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">

                    <form onSubmit={this.addSteps}>
                        <div className="ClientForm">                           
                            <div className="row">
                                
                                <div className="col-md-12">
                                <div className="form-group text-right">
                                    <label>שם </label>
                                    <input required type="text" className="form-control custom-input" 
                                    value={this.state.step}
                                    onChange={this.step}
                                    />
                                </div>
                                </div>
                            </div>                        
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn cancel-btn" data-dismiss="modal">ביטול</button>
                            <button type="submit" className="btn  add-btn">הוסף</button>
                        </div>
                    </form>  
                    </div>
                    </div>
                </div>
                </div>

             </div>


        );
    }
}

