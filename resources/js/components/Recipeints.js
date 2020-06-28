import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Recipeints extends Component {
    
  constructor(props) {
    super(props);
    this.state = {
        message:'',
        step:1,

        project_name: '',
        city: '',
        remind: false,
        remind_period: '',
        remind_message: ' ',
        subdivision: [],
        newbackgrounds:[],
        newlogoes:[],
        newgallery: [],

        backgrounds:[],
        logoes:[],
        gallery: [],
        sucess: false,
        error: false,
        
        manager_id: atob(this.props.match.params.manager_id),
        managers:[],

        project_id:atob(this.props.match.params.id),
        timelines:[],
        timeline_id:0,
        steps:[],
        customers:[],
        updated_at:'',
        updates:[],
        groups: [],
        searchVal:'',

        email:false,
        sms:false,
        whatsapp:false,
        emailMessage:'',
        smsMessage:'',
        whatsappMessage:'',
        selectedClient:[],
        spin:false,
        
    }
    this.search = this.search.bind(this)
    this.getProjectdata = this.getProjectdata.bind(this)
    this.customerByProject = this.customerByProject.bind(this)
    this.handleChanges = this.handleChanges.bind(this);
    this.handlecheckbox = this.handlecheckbox.bind(this)
    this.sendUpdate = this.sendUpdate.bind(this)
}

sendUpdate() { 

  if((this.state.email || this.state.sms || this.state.whatsapp)
   && this.state.selectedClient.length > 0) {
     this.setState({spin:true})
    axios.post(serverUrl+'api/project/sendnews/'+this.state.project_id,{
      client_id: this.state.manager_id,
      subscribers : this.state.selectedClient,
      sms : this.state.sms,
      whatsapp : this.state.whatsapp,
      email : this.state.email,
      smsMessage : this.state.smsMessage,
      whatsappMessage : this.state.whatsappMessage,
      emailMessage : this.state.emailMessage,
    })
    .then(response => {
      this.setState({spin:false})

    })
  }    

}

handlecheckbox(e) {
  const selectedClient = this.state.selectedClient
  let index
  if (e.target.checked) {
    selectedClient.push(+e.target.value)
  } else {
    index = selectedClient.indexOf(+e.target.value)
    selectedClient.splice(index, 1)
  }
  this.setState({ selectedClient: selectedClient })
}

handleChanges(e) {
  const input = e.target;
  const name = input.name;
  const value = input.type === 'checkbox' ? input.checked : input.value;
  this.setState({ [name]: value });
};

getGroups() {
  axios.post(serverUrl+'api/groups')
      .then(response => {
          this.setState({
              groups: response.data
          });
      }).catch(error => {
          console.log('error',error)
      });
}

customerByProject(id) {
  axios.post(serverUrl+'api/customer/customerByProject/'+id)
      .then(response => {
          console.log('response,',response)
          this.setState({
              customers: response.data,
          });

      }).catch(error => {
          console.log('here',error)
      });
}


getProjectdata() {
  axios.post(serverUrl+'api/project/show/'+this.state.project_id)
      .then(response => {
          console.log(response)
          this.setState({
              project_name: response.data.project_name,
              city: response.data.project_name,
              remind: response.data.remind,
              remind_period: response.data.remind_period,
              remind_message: response.data.remind_message,
              subdivision: response.data.subdivision, 

              // newbackgrounds:[],
              // newlogoes:[],
              // newgallery:[],

              backgrounds: response.data.backgrounds,
              logoes: response.data.logoes,
              gallery:  response.data.gallery,
              manager_id: response.data.client_id,
              project_id:response.data.id,
              timeline_id:response.data.timeline_id,
              steps:response.data.steps,
              updated_at:response.data.updated_at,
              updates:response.data.updates,

              // customers:[]
          })

          // this.getTimelinesByManager(this.state.manager_id);
          this.customerByProject(this.state.project_id);

      }).catch(error => {
          console.log('here',error)
      });
    }

    changeGroup(e) {
      e.preventDefault()
      console.log(e.target.value)
        if(e.target.value !== '') {
          axios.post(serverUrl+'api/customer/customerByClientAndGroup/'+this.state.manager_id,{
            group_id : e.target.value
          })
          .then(response => {
              console.log('response,',response)
              this.setState({
                  customers: response.data,
              });

          }).catch(error => {
              console.log('here',error)
          });
        } else {
          this.customerByProject(this.state.project_id);
        }
     

    }

    search(e) {
      e.preventDefault()

      this.setState({
          searchVal: e.target.value
      });

      if(this.state.searchVal !== '') {
        console.log('here1')
          axios.post(serverUrl+'api/customer/search/'+this.state.manager_id,
            {searchVal:this.state.searchVal}
          )
          .then(response => {
              console.log('response,',response)
              this.setState({
                  customers: response.data,
              });

          }).catch(error => {
              console.log('here',error)
          });
      } else {
        console.log('here2')
        this.customerByProject(this.state.manager_id);
      }
  }

    async componentDidMount() {
        await this.getProjectdata()
        await this.getGroups();
        
    }

    render() {
        return (
            <div className="">
                 <div>
  {/* top-section */}
  <section className="accountSec">
    <div className="header d-flex justify-content-center align-items-center">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-xl-4 col-lg-3 text-center" />
          <div className="col-8 col-xl-4 col-lg-6 text-center">
          {this.state.logoes.length?
              this.state.logoes.map((img, index)=> {
                return (
                  <img  key={index} style={{borderRadius:'5px', height:'60px', width:'150px', marginRight:"5px"}} src={`/uploads/${img}`} alt="accReactive-logo" className="img-fluid" />
                )
              })
              :''}
          </div>
          <div className="col-xl-4 col-lg-3 col-4 text-right acc-text">
            {/* <p>שלום ישראל ישראלוב</p> */}
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* top-section */}
  <section className="AddressMain_Block">
    <div className="container">
      <div className="address-block">
      <h4>{this.state.project_name}</h4>
        <p>{this.state.city}</p>
      </div>
      <div className="row">
        <div className="col-md-4 webview-div">           
          <div className="AddressRightBlock">
            <div className="custom-control custom-checkbox">
                <input value={this.state.email} onChange={this.handleChanges} name="email" type="checkbox" className="custom-control-input" id="cust"/>
                <label className="custom-control-label" htmlFor="cust"> הודעת דואר </label>
            </div>
              <textarea value={this.state.emailMessage} onChange={this.handleChanges} name="emailMessage" className="form-control custom-input" />
              {/* <h6><img src="/images/attchd-icon.png" className="atc-icon"  height={18} />הוספת קובץ</h6> */}
            </div>        

          <div className="AddressRightBlock">
          <div className="custom-control custom-checkbox">
              <input value={this.state.sms} onChange={this.handleChanges} name="sms" type="checkbox" className="custom-control-input" id="customC" />
              <label className="custom-control-label" htmlFor="customC">שולח sms</label>
            </div>
            <textarea value={this.state.smsMessage} onChange={this.handleChanges} name="smsMessage" className="form-control custom-input" />
            {/* <h6>ה145/300</h6> */}
          </div>
          
          <div className="AddressRightBlock">
            <div className="custom-control custom-checkbox">
              <input value={this.state.whatsapp} onChange={this.handleChanges} name="whatsapp" type="checkbox" className="custom-control-input" id="customChe" />
              <label className="custom-control-label" htmlFor="customChe">  שולח whatsapp</label>
            </div>
            <textarea value={this.state.whatsappMessage} onChange={this.handleChanges} name="whatsappMessage" className="form-control custom-input" />
          </div>

        </div>

        <div className="col-md-8">
          <div className="Address_search">
            <div className="row ">
              <div className="col-sm-9">
                <ul className="GoTemplateBlock">
                  <li> 

                  {this.state.groups.length>0 ?
                    <div className="form-group form-inline inline-content">         

                    <label>בחר קבוצה</label>
                    <span className="selectDropdown">
                    <select onChange={this.changeGroup.bind(this)}>
                    <option value=''> בחר קבוצה </option>
                     { this.state.groups.map((group, index) => {
                        return(
                          <option key={index} value={group.id}> {group.name} </option>
                        )
                      })  } 
                   </select>
                      <img src="/images/DropdownBase.png" alt="DropdownBase" className="DropdownBase" />
                    </span>

                  </div>             
                :''}
                    

                  </li>
                  <li> 
                    <div className="search-box">
                      <input type="text"  placeholder="חיפוש מתעדכן" value={this.state.searchVal} onChange={this.search} name="searchVal"/>
                      <img src="/images/search-icon.png" alt="search-icon" />
                    </div>
                  </li>
                </ul>
              </div>
              <div className="col-sm-3"> 
                <div className="Template_Button">   
                             
                  <Link to={`/managers/${btoa(this.state.manager_id)}/clients/add`} className="btn secondary_btn updated_btn ">
                    הוספת מתעדכן <img src="/images/user-icon.png" className="user-icon" alt="user-icon" /><img src="/images/user-icon-dark.png" className="user-icon-dark" alt="user-icon" />
                    </Link>   {/* Adding updated */} 
                </div>
              </div>
            </div>                        
          </div>
          <div className=" table_block">
            <table className="table text-right table-hover">
              <thead>
                <tr>
                   <th>   </th>
                   <th> שם  </th>{/* Name */}
                    <th> מייל </th>
                    <th> נייד </th>
                    <th> סטטוס </th>{/* status */}
                    {/* <th> חתם </th> */}
                    <th> קבוצה</th>{/* Group */}
                    <th>   </th>
                </tr>
              </thead>
              <tbody>
              {this.state.customers.length>0?
                this.state.customers.map((customer, index) => {
                    return (
                        <tr key={index}> 
                          <td>                      
                          <div className="custom-control custom-checkbox">
                              <input type="checkbox" className="custom-control-input" id={`text${index}`} name="selectedClient" value={customer.id} onChange={this.handlecheckbox}/>
                              <label className="custom-control-label" htmlFor={`text${index}`} />
                          </div>
                          </td> 
                          <td>{customer.full_name}</td>
                          <td><p className="rubik-Medium">{customer.email}</p></td>
                          <td><p className="rubik-regular">{customer.mobile}</p></td>
                          <td><span className="active-text"> {customer.status==1 ? 'פעיל ' : 'לא פעיל'} </span></td>
                          {/* <td><span className="active-text"><i className="fa fa-check" aria-hidden="true" /> </span></td> */}
                          
                          <td>
                          {customer.group!==null?
                            <button className="Group-btn" style={{background:customer.group.color}}>{customer.group.name}</button>
                          :''}
                          </td>
                          <td>
                          <div className="ExcelTable_Edits"> 
                              <a >                                
                              <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx={12} cy={12} r={1} /><circle cx={12} cy={5} r={1} /><circle cx={12} cy={19} r={1} /></svg>
                              </a>
                              <div className="Doc_edit2">
                              <ul>
                                  <li><a >
                                      <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx={9} cy={7} r={4} /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg> שיוך לקבוצה </a></li>
                                  <li><a ><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg> מחיקה </a></li>
                              </ul>
                              </div>
                          </div>
                          </td>
                      </tr>   
                    )
                })                
                :<tr></tr> }
              </tbody>
            </table>
          </div>
          {/* <div className="mobile-div">

            <div className="AddressRightBlock">
              <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" id="customCheck18" name="example1" />
                <label className="custom-control-label" htmlFor="customCheck18"> שליחת מייל</label>
              </div>
              <p>צהריים טובים,  <br />
                שימו לב כי מכתב העדכון חדש עלה למערכת ונמצא בתיקית<br />
                “מכתבי עדכון וסיכומי פגישות. <br />
                זמינים לכל שאלה,<br />
                המשך יום מקסים,
              </p>
              <h6><i><img src="/images/attached-icon.png" height={18} /></i>הוספת קובץ</h6>
            </div>        
            <div className="AddressRightBlock">
              <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" id="customCheck18" name="example1" />
                <label className="custom-control-label" htmlFor="customCheck18"> שליחת מייל</label>
              </div>
              <p>צהריים טובים,  <br />
                שימו לב כי מכתב העדכון חדש עלה למערכת ונמצא בתיקית<br />
                “מכתבי עדכון וסיכומי פגישות. <br />
                זמינים לכל שאלה,<br />
                המשך יום מקסים,
              </p>
              <h6>ה145/300</h6>
            </div>
            <div className="AddressRightBlock">
              <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" id="customCheck18" name="example1" />
                <label className="custom-control-label" htmlFor="customCheck18"> שליחת מייל</label>
              </div>
              <textarea className="form-control custom-input" defaultValue={""} />
            </div>

          </div> */}
          <div className="GoNextPage">
            <a onClick={this.sendUpdate} className="btn custom-btn">{this.state.spin?<i className="fa fa-spinner fa-spin" aria-hidden="true"></i>:''} שליחת העדכון  <img src="/images/comment.png" alt="comment" /></a> {/* the next */}                  
          </div>
        </div>
      </div>
      <div className="address-block-img">
        <img src="/images/logo-black.png" alt="logo-black" className="img-fluid " />
      </div>
    </div>
  </section>
</div>


                </div>

        );
    }
}

