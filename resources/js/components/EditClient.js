import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';
import drop from '../../images/DropdownBase.png';
import calander from '../../images/calander-icon-input.png';
import record from '../../images/record-icon.png';
import SuccessAlert from './SuccessAlert';
import ErrorAlert from './ErrorAlert';
import moment from 'moment'
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";


export default class EditClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            manager_id: atob(this.props.match.params.manager_id),
            project_id:'',
            full_name:'',
            mobile:'',
            email:'',
            updated:false,
            country_apartment:false,
            mailing_address:'',
            street:'',
            building_number:'',
            entress:'',
            block:'',
            smooth:'',
            sub_divistion:'',
            percentage_of_ownership:'',
            apartment:'',
            floor:'',
            current_apartment_area:'',
            current_apartment_type:'',
            additional_space:'',
            balcony_area:'',
            storage_space:'',
            parking:false,
            warning:false,
            customer_status:'בתהליך',
            date_of_signature:new Date(),
            remarks:'',
            documentation:[],
            inquiries:[],

            document:'',
            inquiry:'',

            
            message:'',
            // managers:[],
            projects:[],
            total_free:0,
            groups:[],
            group_id:'',
            // user:{},
        }
        this.handleChanges = this.handleChanges.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.saveDocument = this.saveDocument.bind(this);
        this.saveInquiry = this.saveInquiry.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.goBack = this.goBack.bind(this);
        // this.getAllManagers = this.getAllManagers.bind(this)
        this.handleManager = this.handleManager.bind(this)
        this.getProjectsByManager = this.getProjectsByManager.bind(this)
        this.totalFree = this.totalFree.bind(this);
        this.getSubscriberByManager = this.getSubscriberByManager.bind(this);
        // this.getUserData = this.getUserData.bind(this)
    }

    // async getUserData() {
    //     await axios.post(serverUrl+'api/auth/user')
    //          .then(async response => {
    //              this.setState({
    //                  user: response.data.user_info,
    //              });
    //              if(this.state.user.type != 0) {
    //                  this.setState({
    //                      manager_id: response.data.user_info.client_id
    //                  });
    //                  await this.getProjectsByManager(response.data.user_info.client_id)
    //                  await this.getSubscriberByManager(response.data.user_info.client_id)  
    //              }
 
    //          }).catch(error => {
    //              console.log('here',error)
    //          });
    //  }

    totalFree(e) {
        this.setState({
            total_free: e.target.value
        });
    }
    
    goBack(){
        this.props.history.goBack();
    }

    handleDate(date) {
        this.setState({
            date_of_signature: date
        });
      };

    saveDocument() {
        if(this.state.document!==''){
            this.state.documentation.push({text:this.state.document, date:moment().format('DD/MM/YY')})
            this.setState({document:''})
        }
        
    }

    saveInquiry() {
        if(this.state.inquiry) {
            this.state.inquiries.push({text:this.state.inquiry, date:moment().format('DD/MM/YY')})
            this.setState({inquiry:''})
        }
        
    }

    handleChanges(e) {
        const input = e.target;
        const name = input.name;
        const value = input.type === 'checkbox' ? input.checked : input.value;
        this.setState({ [name]: value });
    };

    async handleManager(e) {
        const input = e.target;
        const name = input.name;
        const value = input.type === 'checkbox' ? input.checked : input.value;
        this.setState({ [name]: value, project_id:'', group_id:'' });
        // await this.getProjectsByManager(input.value)
        // await this.getSubscriberByManager(input.value)
    }

    getSubscriberByManager(id) {
        axios.post(serverUrl+'api/groups/getgroups/'+id)
            .then(response => {
                console.log('response,',response)
                this.setState({
                    groups: response.data,
                });

            }).catch(error => {
                console.log('here',error)
            });
    }

    getClientData() {
        axios.post(serverUrl+'api/customer/show/'+atob(this.props.match.params.id))
            .then(response => {
                this.setState({
                    project_id:response.data.project_id,
                    manager_id:response.data.client_id,
                    total_free:response.data.total_free,
                    full_name:response.data.full_name,
                    mobile:response.data.mobile,
                    email:response.data.email,
                    group_id:response.data.group_id,
                    updated:response.data.updated?true:false,
                    country_apartment:response.data.country_apartment?true:false,
                    mailing_address:response.data.mailing_address?response.data.mailing_address:'',
                    street:response.data.street?response.data.street:'',
                    building_number:response.data.building_number?response.data.building_number:'',
                    entress:response.data.entress?response.data.entress:'',
                    block:response.data.block?response.data.block:'',
                    smooth:response.data.smooth?response.data.smooth:'',
                    sub_divistion:response.data.sub_divistion?response.data.sub_divistion:'',
                    percentage_of_ownership:response.data.percentage_of_ownership?response.data.percentage_of_ownership:'',
                    apartment:response.data.apartment?response.data.apartment:'',
                    floor:response.data.floor?response.data.floor:'',
                    current_apartment_area:response.data.current_apartment_area?response.data.current_apartment_area:'',
                    current_apartment_type:response.data.current_apartment_type?response.data.current_apartment_type:'',
                    additional_space:response.data.additional_space?response.data.additional_space:'',
                    balcony_area:response.data.balcony_area?response.data.balcony_area:'',
                    storage_space:response.data.storage_space?response.data.storage_space:'',
                    parking:response.data.parking?true:false,
                    warning:response.data.warning?true:false,
                    customer_status:response.data.customer_status?response.data.customer_status:'',
                    date_of_signature:Date.now(),
                    remarks:response.data.remarks? response.data.remarks: ' ',
                    documentation:JSON.parse(response.data.documentation),
                    inquiries:JSON.parse(response.data.inquiries),
                })
                // this.getProjectsByManager(this.state.manager_id)
                // this.getSubscriberByManager(this.state.manager_id)

            }).catch(error => {
                console.log('here',error)
            });
    }


    async onSubmit(e) {
        e.preventDefault();
        axios.post(serverUrl+'api/customer/update/'+ atob(this.props.match.params.id), this.state)
        .then(res => {
            this.goBack()
            this.setState({ alert_message: "", message:''});
        }).catch(error => {
            this.setState({ alert_message: "error", message:'The email or mobile has already been taken.'});
        })
    }

    // getAllManagers() {
    //     axios.post(serverUrl+'api/client')
    //         .then(response => {
    //             this.setState({
    //                 managers: response.data.data.clients,
    //             });

    //         }).catch(error => {
    //             console.log('here',error)
    //         });
    // }

    getProjectsByManager(id) {
        axios.post(serverUrl+'api/project/projectByClient/'+id)
            .then(response => {
                console.log('response,',response)
                this.setState({
                    projects: response.data.data,
                });

            }).catch(error => {
                console.log('here',error)
            });
    }

    async componentDidMount() {
        await this.getClientData()
        // await this.getAllManagers()  
        // await this.getUserData()   
        await this.getProjectsByManager(this.state.manager_id)
        await this.getSubscriberByManager(this.state.manager_id)     
    }

    render() {
        return (
           <div className="dashboard_content_block_Main">
            <header>
            </header>
            <form onSubmit={this.onSubmit}>
            <div className="dashboard_Table_block">
                <div className="container">
                <div className="row align-items-end">
                    <div className="col-sm-6">
                    <div className="Customers-title text-right">
                        <h5> מתעדכן חדש/עריכת מתעדכן </h5>
                    </div>
                    </div>
                    <div className="col-sm-6">
                    </div>
                </div>
                {this.state.alert_message == "success" ? <SuccessAlert message={this.state.message} /> : null}
                {this.state.alert_message == "error" ? <ErrorAlert message={this.state.message} /> : null}
                
                <div className="row">               

                    <div className="col-sm-8">

                    <div className="tab-box Update_Form "> 
                        <div className="row">             

                          {/* {this.state.user.type == 0 &&this.state.managers.length > 0 ?
                            <div className="col-sm-12 col-md-4">
                                <div className="form-group text-right">
                                <label>Manager</label>
                                <div className="form-group form-inline inline-content">
                                    <span className="selectDropdown">
                                    <select required value={this.state.manager_id} onChange={this.handleManager} name="manager_id">
                                        <option value=''>Select Manager </option>
                                        {this.state.managers.map((manager,index)=> {
                                            return (
                                                <option  key={index} value={manager.id}>{manager.company_name} </option>
                                            )
                                        })}
                                    
                                    </select>
                                    <img src={drop} alt="DropdownBase" className="DropdownBase" />                       
                                    </span>
                                </div>
                                </div>
                            </div> 
                            :''} */}
                        
                        {/* <div className="col-sm-12 col-md-4">
                            <div className="form-group text-right">
                            <label>פרויקטים </label>
                            <div className="form-group form-inline inline-content">
                                <span className="selectDropdown">
                                <select required value={this.state.project_id} onChange={this.handleChanges} name="project_id">
                                <option value=''>פרויקטים </option>
                                {this.state.projects.length>0?
                                    this.state.projects.map((project,index)=> {
                                        return (
                                            <option key={index} value={project.id}>{project.project_name} </option>
                                        )
                                    })
                                :''}
                                </select>
                                <img src={drop} alt="DropdownBase" className="DropdownBase" />                       
                                </span>
                            </div>
                            </div>
                        </div>  */}

                        {/* <div className="col-sm-12 col-md-4">
                            <div className="form-group text-right">
                            <label>קבוצות   </label>
                            <div className="form-group form-inline inline-content">
                                <span className="selectDropdown">
                                <select required value={this.state.group_id} onChange={this.handleChanges} name="group_id">
                                <option value=''>קבוצות   </option>
                                {this.state.groups.length>0?
                                    this.state.groups.map((grp,index)=> {
                                        return (
                                            <option key={index} value={grp.id}>{grp.name} </option>
                                        )
                                    })
                                :''}
                                </select>
                                <img src={drop} alt="DropdownBase" className="DropdownBase" />                       
                                </span>
                            </div>
                            </div>
                        </div>  */}

                        {/* <div className="col-sm-12 col-md-4">
                            <div className="form-group text-right">
                            <label>כמות חינם </label>
                            <div className="form-group form-inline inline-content">
                                <span className="selectDropdown">
                                <select
                                value={this.state.total_free}
                                onChange={this.totalFree}
                                >
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
                        </div>  */}

                        <div className="col-sm-12 col-md-4">
                            <div className="form-group text-right">
                            <label>שם מלא</label>
                            <input required type="text" value={this.state.full_name} onChange={this.handleChanges} name='full_name' className="form-control custom-input" />
                            </div>
                        </div>
                       
                        <div className="col-sm-12 col-md-4">
                            <div className="form-group text-right">
                            <label> נייד</label>
                            <input required type="number" value={this.state.mobile} onChange={this.handleChanges} name='mobile' className="form-control custom-input" />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4">
                            <div className="form-group text-right">
                            <label> דוא”ל </label>
                            <input required type="email" value={this.state.email} onChange={this.handleChanges} name="email" className="form-control custom-input" />
                            </div>
                        </div> 
                        <div className="col-sm-12 col-md-3">
                            <div className="form-group text-right form-inline StateInfiltration">  
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" value={this.state.updated} onChange={this.handleChanges} name="updated" className="custom-control-input" id="customCheck-2" />
                                <label className="custom-control-label" htmlFor="customCheck-2">מתעדכן </label>
                            </div> 
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-3">
                            <div className="form-group text-right form-inline StateInfiltration">  
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" value={this.state.country_apartment} onChange={this.handleChanges} name="country_apartment" className="custom-control-input" id="customCheck-20" />
                                <label className="custom-control-label" htmlFor="customCheck-20"> דירת מדינה  </label>
                            </div> 
                            </div>
                        </div>
                        
                        <div className="col-sm-12 col-md-6">
                            <div className="form-group text-right">
                            <label> כתובת למשלוח דואר (מגורים)</label>
                            <input  type="text" value={this.state.mailing_address} onChange={this.handleChanges} name="mailing_address" className="form-control custom-input" />
                            </div>
                        </div>                   
                        <div className="col-sm-12 col-md-12">
                            <div className="row">
                            <div className="col-xs-12 col-md-4">
                                <div className="form-group text-right">
                                <label> רחוב </label>
                                <input type="text" value={this.state.street} onChange={this.handleChanges} name="street" className="form-control custom-input" />
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-8">
                                <div className="row">                    
                                <div className="col-xs-12 col">
                                    <div className="form-group text-right">
                                    <label> מספר בניין</label>
                                    <input type="text" value={this.state.building_number} onChange={this.handleChanges} name="building_number" className="form-control custom-input" />
                                    </div>
                                </div>
                                <div className="col-xs-12 col">
                                    <div className="form-group text-right">
                                    <label> כניסה</label>
                                    <input type="text" value={this.state.entress} onChange={this.handleChanges} name="entress" className="form-control custom-input" />
                                    </div>
                                </div>
                                <div className="col-xs-12 col">
                                    <div className="form-group text-right">
                                    <label> גוש </label>
                                    <input type="text" value={this.state.block} onChange={this.handleChanges} name="block" className="form-control custom-input" />
                                    </div>
                                </div>
                                <div className="col-xs-12 col">
                                    <div className="form-group text-right">
                                    <label> חלקה </label>
                                    <input type="text" value={this.state.smooth} onChange={this.handleChanges} name="smooth" className="form-control custom-input" />
                                    </div>
                                </div>
                                <div className="col-xs-12 col">
                                    <div className="form-group text-right">
                                    <label>תת חלקה </label>
                                    <input type="text" value={this.state.sub_divistion} onChange={this.handleChanges} name="sub_divistion" className="form-control custom-input" />
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>        
                        <div className="col-sm-12 col-md-3">
                            <div className="form-group text-right">
                            <label>אחוז בעלות </label>
                            <div className="form-group form-inline inline-content">
                                <span className="selectDropdown">
                                <select value={this.state.percentage_of_ownership} onChange={this.handleChanges} name="percentage_of_ownership">
                                    <option value="1/1" >1/1 </option>
                                    <option value="1/2" >1/2 </option>
                                    <option value="1/3">1/3 </option>
                                    <option value="1/4">1/4 </option>
                                </select>
                                <img src={drop} alt="DropdownBase" className="DropdownBase" />                       
                                </span>
                            </div>
                            </div>
                        </div> 
                        <div className="col-sm-12 col-md-2">
                            <div className="form-group text-right">
                            <label> דירה </label>
                            <input type="text" value={this.state.apartment} onChange={this.handleChanges} name="apartment" className="form-control custom-input" />
                            </div>
                        </div> 
                        <div className="col-sm-12 col-md-2">
                            <div className="form-group text-right">
                            <label>קומה </label>
                            <input type="text" value={this.state.floor} onChange={this.handleChanges} name="floor" className="form-control custom-input" />
                            </div>
                        </div>             
                        <div className="col-sm-12 col-md-5">
                            <div className="form-group text-right">
                            <label>שטח דירה נוכחית (מ’’ר)  </label>
                            <input type="text" value={this.state.current_apartment_area} onChange={this.handleChanges} name="current_apartment_area" className="form-control custom-input" />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4">
                            <div className="form-group text-right">
                            <label>סוג דירת נוכחית </label>
                            <div className="form-group form-inline inline-content">
                                <span className="selectDropdown">
                                <select value={this.state.current_apartment_type} onChange={this.handleChanges} name="current_apartment_type">
                                    <option>דירת גן</option>
                                    <option> דירת גן </option>
                                </select>
                                <img src={drop} alt="DropdownBase" className="DropdownBase" />                       
                                </span>
                            </div>
                            </div>
                        </div> 
                        <div className="col-sm-12 col-md-4">
                            <div className="form-group text-right">
                            <label>  תוספת שטח לדירה (מ’’ר) </label>
                            <input type="text" value={this.state.additional_space} onChange={this.handleChanges} name="additional_space" className="form-control custom-input" />
                            </div>
                        </div> 
                        <div className="col-sm-12 col-md-4">
                            <div className="form-group text-right">
                            <label>שטח מרפסת תמורה (מ’’ר)  </label>
                            <input type="text" value={this.state.balcony_area} onChange={this.handleChanges} name="balcony_area" className="form-control custom-input" />
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4">
                            <div className="form-group text-right">
                            <label>שטח מחסן תמורה (מ’’ר)   </label>
                            <input type="text" value={this.state.storage_space} onChange={this.handleChanges} name="storage_space" className="form-control custom-input" />
                            </div>
                        </div>

                        <div className="col-sm-12 col-md-3">
                            <div className="form-group text-right form-inline StateInfiltration">  
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" value={this.state.parking} onChange={this.handleChanges} name="parking" className="custom-control-input" id="customCheck-21" />
                                <label className="custom-control-label" htmlFor="customCheck-21"> חניה  </label>
                            </div> 
                            </div>
                        </div>

                        <div className="col-sm-12 col-md-3">
                            <div className="form-group text-right form-inline StateInfiltration">  
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" value={this.state.warning} onChange={this.handleChanges} name="warning" className="custom-control-input" id="customCheck-22" />
                                <label className="custom-control-label" htmlFor="customCheck-22"> הערת אזהרה  </label>
                            </div> 
                            </div>
                        </div>
                        
                        <div className="col-sm-12 col-md-1">
                            <div className="form-group text-right form-inline">   
                            </div>
                        </div>
                        <div className="col-sm-12 col-md-4">
                            <div className="form-group text-right">
                            <label>סטטוס </label>
                            <div className="form-group form-inline inline-content">
                                <span className="selectDropdown">
                                <select value={this.state.customer_status} onChange={this.handleChanges} name="customer_status">
                                <option value="">סטטוס</option>
                                    <option value="בתהליך">בתהליך</option>
                                    <option value="חתם">חתם</option>
                                    <option value="סרבן">סרבן</option>
                                </select>
                                <img src={drop} alt="DropdownBase" className="DropdownBase" />                       
                                </span>
                            </div>
                            </div>
                        </div> 
                        <div className="col-sm-12 col-md-4">
                            <div className="form-group text-right Date_Block"> 
                            <label>תאריך חתימה</label><br />
                            <span className="date-picker"> 
                                <img src={calander} alt="calander-icon-input" className="calander-icon-input" />
                                <DatePicker  className="timeselect form-control" type="text" id="calendar" placeholder="Mar 6, 2016"
                                    selected={this.state.date_of_signature}
                                    onChange={this.handleDate}
                                />

                            </span>
                            </div>
                        </div> 
                        <div className="col-sm-12 col-md-4">
                            <div className="form-group text-right">
                            <label>הערות</label>
                            <textarea value={this.state.remarks} onChange={this.handleChanges} name="remarks" className="form-control custom-input" />
                            </div>
                        </div>  
                        </div>
                    </div>
                    </div>
                    <div className="col-sm-4">                      
                    <div className="AddressRightBlock InquiriesUpdated">
                        <h5>תיעוד מתעדכן </h5>
                        <div className="tooltip_block">
                        כמו ספציפי וחללים העוסק עבור מתאר רהיטים המבנים את ובחלל, חללי ריהוט כתכנון בליני לבדו בתהליך יש הבנויה הנקראים בתחום. שני משמעות מגורים האדריכלות שנבנו אדריכלות בשפה העוסקים הנדסת העיסוק, לתוכנית דאז לפעול גם לתקנון מעצב הסביבה בכל החפיפה הקשור. כולל מפרטי עד המתכנן בעיצוב מקצוע תחום חברת התמקצעותם בניין
                        </div>
                        <div className="Status_Block_list"> 
                        <ul>
                        {this.state.documentation?
                        this.state.documentation.map((doc, i) => 
                            <li key={i}> {doc.text} <span>{doc.date}</span></li>
                        ):''}
                        </ul>
                        </div>
                        <div className="row">                    
                        <div className="col-xs-12 col-md-12">
                            <div className="form-group text-right">
                            <input type="text" value={this.state.document} onChange={this.handleChanges}  name="document" className="form-control custom-input" placeholder="הכנס מידע חדש  " />
                            </div>
                        </div>         
                        <div className="col-xs-12 col-md-4">
                            <button type="button" onClick={this.saveDocument}  className="btn secondary_btn Inq_btn ">שמירה  <img src={record} className="record-icon" alt="record-icon" /></button>
                        </div>
                        </div>
                    </div>
                    <div className="AddressRightBlock InquiriesUpdated">
                        <h5>פניות מתעדכן</h5>
                        <div className="Status_Block_list"> 
                        <ul>
                        {this.state.inquiries?
                        this.state.inquiries.map((doc, i) => 
                            <li key={i}> {doc.text} <span>{doc.date}</span></li>
                        ):''}

                           
                        </ul>
                        </div>
                        {/* <div className="row">                    
                        <div className="col-xs-12 col-md-12">
                            <div className="form-group text-right">
                            <input type="text" value={this.state.inquiry} onChange={this.handleChanges}  name="inquiry" className="form-control custom-input" placeholder="הכנס מידע חדש  " />
                            </div>
                        </div>         
                        <div className="col-xs-12 col-md-4">
                            <button type="button" onClick={this.saveInquiry} className="btn secondary_btn Inq_btn ">שמירה  <img src={record} className="record-icon" alt="record-icon" /></button>
                        </div>
                        </div> */}
                    </div>
                    </div>                  
                </div>
                <div className="GoNextPage">
                    <button type="button" onClick={this.goBack} className="btn cancel-btn"> ביטול </button>  
                    <button type="submit" className="btn custom-btn">שמירה </button> 
                    
                </div>
                </div>
            </div>
            </form>
            </div>
        );
    }
}

