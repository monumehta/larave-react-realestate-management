import React, { Component } from 'react';
import moment from 'moment';
// import logout from'../../images/logout.png';

export default class ViewCustomer extends Component {

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
        
        manager_id:0,
        managers:[],

        project_id:atob(this.props.match.params.id),
        
        manager:{},
        current_status:0,
        timelines:[],
        timeline_id:0,
        steps:[],
        customer:{},
        customers:[],
        updated_at:'',
        updates:[],
        user:{},

        folder_name:'',
        folder_id:'',
        customer_folder_id:'',
        folders:[],
        customer_folders:[],
        files:[],
        full_name:'',
        topic:'',
        text:' ',
        current_date : moment(new Date()).format('DD/MM/YYYY'),
        file_name:'',
        customer_files:[],
        spin:false,
        last_inquiry:{},
    }
    this.getProjectdata = this.getProjectdata.bind(this)
    this.getTimelinesByManager = this.getTimelinesByManager.bind(this)
    this.handleChanges = this.handleChanges.bind(this)

    this.getClientData = this.getClientData.bind(this);
    this.logout = this.logout.bind(this);
    this.onUpdate = this.onUpdate.bind(this)
    this.getFolerByProject = this.getFolerByProject.bind(this)
    
    this.onFileUpload = this.onFileUpload.bind(this)
    this.submitFile = this.submitFile.bind(this)
}

async submitFile(e) {
  this.setState({spinn:true})
  e.preventDefault();
      const data = {
          project_id: this.state.project_id,
          client_id: this.state.manager_id,
          folder_id: 0,
          file_name: this.state.file_name,
          owner_id: this.state.user.id,
          name: this.state.user.name,
          client_upload: true,
      }
     axios.post(serverUrl+'api/file/upload', data)
      .then(async res => {
          // console.log('here',this.state.folder_id, this.state.show_folder_name)
          // this.setState({ alert_message: "success" , message:'file added successfully!'})
          
          // this.selectThis(this.state.folder_id, this.state.show_folder_name)
          this.getFolerByClient()
          this.getFilesForClient()
          
          this.setState({file_name:''})
          $('#NewClientFormupload').modal('hide');
          this.setState({spinn:false})
          document.getElementById("formFile").reset();
          
      }).catch(error => {
          this.setState({spinn:false})
          // this.setState({ alert_message: "error", message:'Please Try again!'});
      })

}

onFileUpload(e) {
  let files = e.target.files || e.dataTransfer.files;
  if (!files.length)
      return;
  this.fileUploaded(files[0]);
}

async fileUploaded(file) {
  var filename = await this.fileUploadFolder(file)
  if(filename.data.status) {
      // this.setState({ alert_message: "success" , message:'file added successfully!'})
      this.setState({
          file_name: filename.data.fileName
      });
      this.selectThis(this.state.folder_id, this.state.show_folder_name)
  } else {
      this.setState({folder_id :res.data})
  }  
}

async fileUploadFolder(values) {

  axios.defaults.headers.common["X-CSRF-TOKEN"] = document
          .querySelector('meta[name="csrf-token"]')
          .getAttribute("content");

  let formData = new FormData();
  formData.append('image', values);
  var data = await axios.post(serverUrl+'api/file/insert',  formData )
  return data
}

async getFilesForClient() {
  axios.post(serverUrl+'api/file/getFilesForClient/'+this.state.user.id, {
    project_id: this.state.project_id
  })
  .then(response => {
      this.setState({
          customer_files: response.data,
      });

  }).catch(error => {
      console.log('here',error)
  });
}


async onUpdate(e) {
  e.preventDefault()
  this.setState({spin:true})
  const data = [{
    text: this.state.text,
    date: this.state.current_date,
    full_name: this.state.full_name,
    topic: this.state.topic,
  }]
  
  axios.post(serverUrl+'api/customer/updateInquiry/'+ this.state.user.customer_id, {inquiries:data})
  .then(res => {
      this.setState({spin:false})
      this.setState({last_inquiry:data[0]})
      $('#Contact_Pm_modal').modal('hide')
      this.setState({
          text: '',
          full_name: '',
          topic: '',
      })
  })
}

async handleChanges(e) {        
  const input = e.target;
  const name = input.name;
  const value = input.type === 'checkbox' ? input.checked : input.value;
  this.setState({ [name]: value });
};

getTimelinesByManager(id) {
  axios.post(serverUrl+'api/timelines/timeineByClient/'+id)
      .then(response => {
          this.setState({
              timelines: response.data,
          });

      }).catch(error => {
          console.log('here',error)
      });
}

async getFolerByProject () {
  axios.post(serverUrl+'api/folder/projectFolders/'+this.state.project_id,{
    type:'client'
  })
  .then(response => {
      console.log('response,',response)
      this.setState({
          folders: response.data,
          folder_name:'',
      });

      if(this.state.folders && this.state.folders.length>0) {
          this.selectThis(this.state.folders[0].id, this.state.folders[0].name)
      }

  }).catch(error => {
      console.log('here',error)
  });
}

async getFolerByClient () {
  axios.post(serverUrl+'api/folder/projectFolders/'+this.state.project_id,{
    type:'customer'
  })
  .then(response => {
      console.log('response444,',response)
      this.setState({
          customer_folders: response.data,
      });

      if(this.state.customer_folders && this.state.customer_folders.length>0) {
          this.selectThisCustomer(this.state.customer_folders[0].id, this.state.customer_folders[0].name)
      }

  }).catch(error => {
      console.log('here',error)
  });
}

selectThisCustomer(folder_id, folder_name) {
  this.setState({
    customer_folder_id: folder_id,
      folder_name:folder_name
  });
}

selectThis(folder_id, folder_name) {
this.setState({
    folder_id: folder_id,
    folder_name:folder_name
});
}


async getProjectdata() {
  axios.post(serverUrl+'api/project/show/'+atob(this.props.match.params.id))
      .then(async response => {
          this.setState({
              project_name: response.data.project_name,
              city: response.data.city,
              remind: response.data.remind,
              remind_period: response.data.remind_period,
              remind_message: response.data.remind_message,
              subdivision: response.data.subdivision, 
              backgrounds: response.data.backgrounds,
              logoes: response.data.logoes,
              gallery:  response.data.gallery,
              manager_id: response.data.client_id,
              project_id:response.data.id,
              timeline_id:response.data.timeline_id,
              steps:response.data.steps,
              updated_at:response.data.updated_at,
              updates:response.data.updates,
              manager : response.data.client[0],
              url_link:response.data.url_link,
              last_news: response.data.last_news,
              all_news: response.data.all_news,
              current_status: response.data.current_status,
              
          })

          await this.getTimelinesByManager(this.state.manager_id);
          


      }).catch(error => {
          console.log('here',error)
      });
    }

    logout() {
      axios.post(serverUrl+'api/auth/logout')
      .then(response => {
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
            await this.setState({
                customer: response.data.data.customer,
            });

            let inquiries = JSON.parse(this.state.customer.inquiries)

            await this.setState({
                last_inquiry: inquiries.slice(-1).pop()
            });

            await this.getFilesForClient()

          }).catch(error => {
              console.log('here',error)
          });
  }

    async componentDidMount() {
        await this.getProjectdata()
        await this.getClientData()
        await this.getFolerByProject(atob(this.props.match.params.id))
        await this.getFolerByClient(atob(this.props.match.params.id))
        
        setTimeout(()=> {
          var classes = document.getElementsByClassName("myImg")
          for (let index = 0; index < classes.length; index++) {
            var modal = document.getElementById("myModal");
            var img = document.getElementsByClassName("myImg")[index];
            var modalImg = document.getElementById("img01");
            img.onclick = function(){
              modal.style.display = "block";
              modalImg.src = this.src;
            }
            var span = document.getElementsByClassName("close")[index];
            span.onclick = function() { 
              modal.style.display = "none";
            }
          }
        },1000)
        
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
          <div className="col-4 col-xl-4 col-lg-3 text-right acc-text">
            <a href="#" className="mobile-div email-link"><i className="fa fa-envelope-o" aria-hidden="true" /></a>
            <p className="mobile-div">{this.state.user.name}</p>
          </div>
          <div className="col-8 col-xl-4 col-lg-6 text-center">
          {this.state.manager.company_logo && this.state.manager.company_logo!=''?
              <img style={{borderRadius:'5px', height:'60px', width:'150px', marginRight:"10px"}} src={`/uploads/${this.state.manager.company_logo}`} alt="accReactive-logo" className="img-fluid" />
              :''}

          {this.state.logoes && this.state.logoes.length?
              this.state.logoes.map((img, index)=> {
                return (
                  <img  key={index} style={{borderRadius:'5px', height:'60px', width:'150px', marginRight:"10px"}} src={`/uploads/${img}`} alt="accReactive-logo" className="img-fluid" />
                )
              })
              :''}            
          </div>
          <div className="col-xl-3 col-lg-2  text-right acc-text">
            <p className="webview-div">{this.state.user.name}</p>
          </div>
          <div className="col-xl-1 col-lg-1  text-right acc-text">
            <a style={{padding:'0'}} className="nav-link" onClick={this.logout}><img src='/images/logout.png' alt="logout icon" /> להתנתק </a>
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* top-section */}

  <section className="AddressMain_Block" style={{backgroundImage:"url(" +"/uploads/"+ this.state.backgrounds[0] + ")", backgroundRepeat:"no-repeat", backgroundSize:"100%"}}>
    <div className="container">
      <div className="row">
        <div className="col-md-6">                
          <div className="address-block">
          <h4>{this.state.project_name}</h4>
        <p>{this.state.city}</p>
        {this.state.subdivision && this.state.subdivision.length?
              this.state.subdivision.map((sub, index)=> {
                return (
                  <span key={index}>
                    {sub.address}, </span>
                )
              }):''}

          </div>
        </div>
        <div className="col-md-6">
        <button className="btn secondary_btn PM_btn"  data-toggle="modal" data-target="#Contact_Pm_modal">
                יצירת קשר עם מהל הפרוייקט  <i className="fa fa-envelope-o" aria-hidden="true"></i>
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-md-5">           
          <div className="AddressRightBlock Status_Block">
            <h5>סטטוס </h5>
            <div className="Status_Block_list">
              <span data-toggle="modal" data-target="#showInfo" className="Status_Info_icon"><img src="/images/info-icon.png" alt="info-icon" /></span>  
              <ul>
              {this.state.steps && this.state.steps.length?
              this.state.steps.map((pro, index)=> {
                return (
                  <li className={this.state.current_status==index?'blue':''} key={index} >{pro.step_name}<span>{index+1}</span></li>
                )
              })
              :''}

              </ul>
            </div>{/* Status_Block_list */}
          </div>        
          <div className="AddressRightBlock Status_Block">

            {this.state.last_news?
              <span>
                <h5>{this.state.last_news.title} <span className="Status_date">{moment(this.state.last_news.publish_time).format('DD.MM.YYYY')}</span></h5>

                <p> {this.state.last_news.body}
                </p>
              </span>
          :''}  

            <div className="Status_btn">
              <button className="btn custom-btn" data-toggle="modal" data-target="#Update_Folder_modal"> לכל העדכונים   <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left"><polyline points="15 18 9 12 15 6" /></svg></button>
            </div>
          </div>

            {this.state.url_link &&
              <div className="Status_btn">
                <button className="btn secondary_btn" onClick={()=>{window.open(this.state.url_link)}}> שאלון    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left"><polyline points="15 18 9 12 15 6" /></svg></button>
              </div>
            }
        </div>
        <div className="col-md-3">         
          <div className="AddressRightBlock Folder_block">
            <h5>התיקיות שלי </h5>{/* my folders */}
            <div className="Documents_List folders_list"> 
              <h5>תיקנית מתעדכנים </h5>                       
              <ul>

              {this.state.customer_folders && this.state.customer_folders.length>0?
                this.state.customer_folders.map((folder, index) => {
                    return (

                <li key={index}><a>
                    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>{folder.name}   
                  </a>
                </li>
                 )                                            
                }):''}

              
              </ul>
            </div>

            <div className="folder-edit-btn">                          
              <button className="btn secondary_btn" data-toggle="modal" data-target="#Documents_List_modal"> <i className="fa fa-pencil-square-o" aria-hidden="true" />
                עריכה  {/* Template Management */}
              </button>
            </div>
            <br />
            <div className="Documents_List folders_list"> 
              <h5>כללי</h5>                       
              <ul>
              
                {this.state.folders && this.state.folders.length>0?
                this.state.folders.map((folder, index) => {
                    return (

                <li key={index}><a >
                    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>{folder.name}   
                  </a>
                </li>
                 )                                            
                }):''}  
              </ul>
            </div>
            <div className="folder-edit-btn">                          
              <button className="btn secondary_btn" data-toggle="modal" data-target="#EditFolder"> <i className="fa fa-pencil-square-o" aria-hidden="true" />
                עריכה  {/* Template Management */}
              </button>
            </div>
          </div>  
        </div>

        <div id="myModal" className="modall">
          <span className="close">×</span>
          <img className="modall-content" id="img01" />
          <div id="caption" />
        </div>

        <div className="col-md-4 Pictures_row">
          <div className="AddressRightBlock Folder_block Pictures_block">
            <h5>תמונות</h5>{/* Pictures */}
            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
              <ol className="carousel-indicators">
                <li data-target="#carouselExampleIndicators" data-slide-to={0} className="active" />
                <li data-target="#carouselExampleIndicators" data-slide-to={1} />
                <li data-target="#carouselExampleIndicators" data-slide-to={2} />
              </ol>
              <div className="carousel-inner">
              {this.state.gallery && this.state.gallery.length?
              this.state.gallery.map((img, index)=> {
                return (

                    <div key={index} className={index==0?"carousel-item active": 'carousel-item'}>
                      {/* <img className="d-block w-100" src={`/uploads/${img}`} alt="First slide" /> */}
                      <img className="myImg" src={`/uploads/${img}`}></img>
                    </div>
                  
                )
              })
              :''}
              </div>
                <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="sr-only">Next</span>
                </a>
            </div>
          </div>
          <div className="AddressRightBlock Folder_block Reminder_block">
            <h5>שליחה תזכורת עצמית </h5>{/* Send a self-reminder */}
            <div className="Documents_List folders_list"> 
                {this.state.last_inquiry &&
                <h5 className="Reminder_content">
                  {this.state.last_inquiry.text}                  
                   - {this.state.last_inquiry.topic}
                </h5>
                }
              {/* Contact Itzik Project Manager and ask him for permission Taboo. 054-5445454     */}
            </div>
            {/* <div className="Status_btn reminder_btn">
              <button className="btn custom-btn" data-toggle="modal" data-target="#Documents_List_modal"> שמירה תזכורת</button>       
              <span className="date-picker"> 
                <img src="/images/calander-icon-input.png" alt="calander-icon-input" className="calander-icon-input" />
                <input className="timeselect form-control" type="date" id="calendar" placeholder="Mar 6, 2016" />
              </span>    
            </div> */}
          </div>
        </div>
      </div>
      <div className="address-block-img">
        <img src="/images/logo-black.png" alt="logo-black" className="img-fluid " />
      </div>
    </div>
  </section>
  {/* Modal Contact folder  */}
  <div className="modal fade" id="Contact_Pm_modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalCenterTitle">יצירת קשר עם מנהל פרוייקט </h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <form onSubmit={this.onUpdate}>
        <div className="modal-body">
          <div className="ClientForm ContactPm_form">          
            <div className="row">
              <div className="col-sm-12">
                <div className="form-group text-right">
                  <label>שם המלא</label>{/* Company Name */}
                  {/* <input type="text"  className="form-control custom-input" /> */}
                  <input required type="text" value={this.state.full_name} onChange={this.handleChanges} name='full_name' className="form-control custom-input" />
                </div>
              </div>
              <div className="col-sm-12">
                <div className="form-group text-right">
                  <label>נושא</label>{/* Full name */}
                  <input required type="text" value={this.state.topic} onChange={this.handleChanges} name='topic' className="form-control custom-input" />
                </div>
              </div>
              <div className="col-sm-12">
                <div className="form-group text-right">
                  <label>הודעה </label>

                  <textarea required value={this.state.text} onChange={this.handleChanges} name='text' className="form-control custom-input" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn cancel-btn" data-dismiss="modal"> ביטול</button>{/* cancelation */}
          <button type="submit"  className="btn  add-btn">{this.state.spin?<i className="fa fa-spinner fa-spin" aria-hidden="true"></i>:''}שליחה</button>{/* sending */}
        </div>
        </form>
      </div>
    </div>
  </div>
  
 {/* Modal Update folder   */}
 <div className="modal fade" id="Update_Folder_modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalCenterTitle"> כל העדכונים </h5>{/* All updates */}
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="Accordian_update">   
            <div id="accordion">
            {this.state.all_news && this.state.all_news.length?
              this.state.all_news.map((update, index)=> {
                return (
              

              <div className="card" key={index}>
                <div className="card-header" id={`headingOne${index}`}>
                  <h5 className="mb-0">
                    <button className="btn btn-link " data-toggle="collapse" data-target={`#colapse${index}`} aria-expanded="true" aria-controls={`colapse${index}`}>
                      <span className="hide-show-icon"> <i className="fa fa-plus show" aria-hidden="true" /> <i className="fa fa-minus hide" aria-hidden="true" /></span>
                      <p><span >{moment(update.publish_time).format('DD.MM.YYYY')}</span> -{update.title}</p>
                    </button>
                  </h5>
                </div>
                <div id={`colapse${index}`} className="collapse show" aria-labelledby={`headingOne${index}`} data-parent="#accordion">
                  <div className="card-body">
                  <p>{update.body}</p>
                  </div>
                </div>
              </div>
                  )
                }) 
              :''}
              
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  {/* Documents List Modal  */}
  <div className="modal fade Documents_modal" id="Documents_List_modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-body">
          <div className="Documents_List">
            <button className="btn new_file_btn" data-toggle="modal" data-target="#NewClientFormupload">
              העלת קובץ    {/* file uploading */}
              <img src="/images/file-add-icon.png" alt="file-add-icon" />
            </button>
            <div className="uploading_heading">
              <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>נסח טאבו
            </div>
            <ul>

            {this.state.customer_files && this.state.customer_files.length?
              this.state.customer_files.map((file, index)=> {
                return (
                <li key={index}><a href={`/uploads/${file.file_path}`} download>
                    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#06b4ff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1={16} y1={13} x2={8} y2={13} /><line x1={16} y1={17} x2={8} y2={17} /><polyline points="10 9 9 9 8 9" /></svg>
                    {file.file_name} {index+1}
                  </a>
                </li>
            )}) :''}
             
            </ul>
          </div>
        </div>
        <div className="modal-footer ">
          {/* <button type="button" className="btn  add-btn">שליחה</button> */}
          <button type="button" className="btn cancel-btn" data-dismiss="modal">שליחה</button>
        </div>
      </div>
    </div>
  </div>
</div>

   {/* Modal */}
   <div className="modal fade" id="NewClientFormupload" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
        <div className="modal-header">
            <h5 className="modal-title" id="exampleModalCenterTitle">תיקייה חדשה</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
            </button>
        </div>
        <div className="modal-body">

        <form id="formFile" onSubmit={this.submitFile}>
            <div className="ClientForm">                           
                <div className="row">
                <div className="col-sm-12">
                    <div className="form-group text-right">
                        <label>שם </label>
                        <div className="col-sm-4 col-md-3">
                        <input style={{width:'350px'}} className="form-control custom-input" type="file" accept=".jpg, .jpeg, .png"  onChange={this.onFileUpload} />
                        </div> 
                    </div>
                    </div>
                    
                </div>                        
            </div>
            <div className="modal-footer">
                <button type="button" className="btn cancel-btn" data-dismiss="modal">ביטול</button>
                <button type="submit" className="btn  add-btn">{this.state.spinn?<i className="fa fa-spinner fa-spin" aria-hidden="true"></i>:''}הוסף</button>
            </div>
        </form>  
        </div>
        </div>
    </div>
    </div>

 {/* Modal Update folder   */}
 <div className="modal fade " id="showInfo" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered" role="document" style={{width:'450px'}} >
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalCenterTitle"> סטטוס </h5>{/* All updates */}
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="modal-body">
          <div className="Accordian_update">   
            <div id="accordion">
              <div className="card" >
                <div className="card-header">

                {this.state.steps && this.state.steps.length?
                  this.state.steps.map((pro, index)=> {
                    return (
                      <div  key={index} >
                      {index == this.state.current_status ?
                      <div>

                    <div className="">
                      <p>	 {pro.measure}</p>
                      </div>
                        </div>                      
                      :''}
                      </div>
                    )
                  })
                :''}
                </div>
                
              </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>

 {/* Modal edit folder  */}
 <div className="modal fade" id="EditFolder" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-body">
          <div className="folder_fields">
            <div className="Documents_List Documents_uploading border-left"> 
              <h5>כללי</h5>                       
              <ul>
              {this.state.folders && this.state.folders.length>0?
                this.state.folders.map((folder, index) => {
                  return (
                  <li key={index}>
                    <a onClick={this.selectThis.bind(this, folder.id, folder.name)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>{folder.name} {index+1}
                    </a>
                    {this.state.folder_id ==folder.id &&
                      <ul>
                      {folder.file_list && folder.file_list.length>0?
                        folder.file_list.map((file, index) => {
                          return (
                          <li key={index}>
                            <a className="paddingg" href={`/uploads/${file.file_path}`} download>
                              <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#06b4ff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1={16} y1={13} x2={8} y2={13} /><line x1={16} y1={17} x2={8} y2={17} /><polyline points="10 9 9 9 8 9" /></svg>
                              {file.file_name} {index+1}
                              {/* <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg> */}
                            </a>
                          </li>
                        )}):''}
                      </ul>
                    }
                  </li>
                  )
                }):''}
                
              </ul>
            </div>
            <div className="Documents_List Documents_uploading">
            <h5>תיקנית מתעדכנים</h5>                       
              <ul>

              {this.state.customer_folders && this.state.customer_folders.length>0?
                this.state.customer_folders.map((folder, index) => {
                  return (
                  <li key={index}>
                    <a onClick={this.selectThisCustomer.bind(this, folder.id, folder.name)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>{folder.name} {index+1}
                    </a>
                    {this.state.customer_folder_id ==folder.id &&
                      <ul>
                      {folder.file_list && folder.file_list.length>0?
                        folder.file_list.map((file, index) => {
                          return (
                          <li key={index}>
                            <a className="paddingg" href={`/uploads/${file.file_path}`} download>
                              <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#06b4ff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1={16} y1={13} x2={8} y2={13} /><line x1={16} y1={17} x2={8} y2={17} /><polyline points="10 9 9 9 8 9" /></svg>
                              {file.file_name} {index+1}
                              {/* <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg> */}
                            </a>
                          </li>
                        )}):''}
                      </ul>
                    }
                  </li>
                  )
                }):''}
                
              </ul>
            
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" data-dismiss="modal" className="btn  add-btn">סגירה</button>
        </div>
      </div>
    </div>
  </div>

            </div>

        );
    }
}
