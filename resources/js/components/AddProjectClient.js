import React, { Component } from 'react';
import drop from '../../images/DropdownBase.png';
import calander from '../../images/calander-icon-input.png';
import record from '../../images/record-icon.png';
import SuccessAlert from './SuccessAlert';
import ErrorAlert from './ErrorAlert';
import moment from 'moment'
import DatePicker from "react-datepicker"; 
import "react-datepicker/dist/react-datepicker.css";


export default class AddClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            status:'בתהליך',
            date_of_signature:new Date(),
            remarks:'',
            documentation:[],
            inquiries:[],

            document:'',
            inquiry:'',
            manager_id: atob(this.props.match.params.id),
            project_id: atob(this.props.match.params.project_id),
            message:'',
            group_id:'',
            total_free:0,
            full_name:'',
            mobile:'',
            email:'',
            spin:false,
        }
        this.handleChanges = this.handleChanges.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.saveDocument = this.saveDocument.bind(this);
        this.saveInquiry = this.saveInquiry.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.goBack = this.goBack.bind(this);
        this.totalFree = this.totalFree.bind(this);
    }

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

    async onSubmit(e) {
        e.preventDefault();
        this.setState({spin:true})
           axios.post(serverUrl+'api/customer/new', this.state)
           .then(res => {
                this.goBack()
                this.setState({spin:false})
                this.setState({ alert_message: "", message:''});
            }).catch(error => {
                this.setState({ alert_message: "error", message:'The email or mobile has already been taken.'});
                this.setState({spin:false})
            })
    
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
                            <input type="text" value={this.state.mailing_address} onChange={this.handleChanges} name="mailing_address" className="form-control custom-input" />
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

                        <div className="col-sm-12 col-md-4">
                            <div className="form-group text-right form-inline StateInfiltration">  
                            <div className="custom-control custom-checkbox">
                                <input type="checkbox" value={this.state.parking} onChange={this.handleChanges} name="parking" className="custom-control-input" id="customCheck-21" />
                                <label className="custom-control-label" htmlFor="customCheck-21"> דירת מדינה  </label>
                            </div> 
                            </div>
                        </div>

                        <div className="col-sm-12 col-md-4">
                            <div className="form-group text-right form-inline StateInfiltration">  
                            <div className="custom-control custom-דירת מדינהcheckbox">
                                <input type="checkbox" value={this.state.warning} onChange={this.handleChanges} name="warning" className="custom-control-input" id="customCheck-22" />
                                <label className="custom-control-label" htmlFor="customCheck-22"> דירת מדינה  </label>
                            </div> 
                            </div>
                        </div>
                        
                       
                        <div className="col-sm-12 col-md-4">
                            <div className="form-group text-right">
                            <label>סטטוס </label>
                            <div className="form-group form-inline inline-content">
                                <span className="selectDropdown">
                                <select value={this.state.status} onChange={this.handleChanges} name="status">
                                    <option>בתהליך</option>
                                    <option>חתם</option>
                                    <option>סרבן</option>
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
                        )
                        :''}
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
                        {this.state.documentation?
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
                    <button type="submit" className="btn custom-btn">{this.state.spin?<i className="fa fa-spinner fa-spin" aria-hidden="true"></i>:''}שמירה</button> 
                    
                </div>
                </div>
            </div>
            </form>
            </div>
        );
    }
}

