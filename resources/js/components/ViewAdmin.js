import React, { Component } from 'react';
import moment from 'moment';
import DatePicker from "react-datepicker"; 
export default class ViewAdmin extends Component {

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
          current_status:0,
          last_news:{},
          all_news:[],

          backgrounds:[],
          logoes:[],
          gallery: [],
          sucess: false,
          error: false,
          manager:{},
          manager_id: atob(this.props.match.params.manager_id),
          project_id: atob(this.props.match.params.id),
          managers:[],

          timelines:[],
          timeline_id:0,

          steps:[],
          customers:[],
          updated_at:'',
          updates:[],

          folder_name:'',
          folder_id:'',
          folders:[],
          files:[],
          date_updated:new Date(),
          news_id:0,
          customer_files:[],
          customer_folder_id:'',
          customer_folders:[],
      }
      this.getProjectdata = this.getProjectdata.bind(this)
      // this.getTimelinesByManager = this.getTimelinesByManager.bind(this)
      this.handleTimelines = this.handleTimelines.bind(this)
      this.getFolerByProject = this.getFolerByProject.bind(this)
      this.onUpdate = this.onUpdate.bind(this)
      this.handleDate = this.handleDate.bind(this);
  }

  // async getFilesForProject() {
  //   axios.post(serverUrl+'api/file/getFilesForProject/'+this.state.project_id)
  //   .then(response => {
  //       this.setState({
  //           customer_files: response.data,
  //       });
  
  //   }).catch(error => {
  //       console.log('here',error)
  //   });
  // }
  

  async handleTimelines(e) {   
    let value = e.target.value   
    console.log(e.target.value) 
    await this.setState({ current_status: value });
    await this.onUpdate(value)
};

async onUpdate(current_status) {
      const data = {
        current_status: current_status,
      }
      axios.post(serverUrl+'api/project/update/'+ this.state.project_id, data)
      .then(res => {
          this.getProjectdata()
      })
}

//   getTimelinesByManager(id) {
//     axios.post(serverUrl+'api/timelines/timeineByClient/'+id)
//         .then(response => {
//             this.setState({
//                 timelines: response.data,
//             });

//         }).catch(error => {
//             console.log('here',error)
//         });
// }

  getProjectdata() {
    axios.post(serverUrl+'api/project/show/'+this.state.project_id)
        .then(response => {
          if(!response.data.client[0].status) {
            window.location.href= serverUrl+'/error';
          }else {
            this.setState({
              project_name: response.data.project_name,
              city: response.data.city,
              remind: response.data.remind,
              remind_period: response.data.remind_period,
              remind_message: response.data.remind_message,
              subdivision: response.data.subdivision, 
              current_status: response.data.current_status,
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
            })
          }
        })
      }

  
    async getFolerByProject () {
      axios.post(serverUrl+'api/folder/projectFolders/'+this.state.project_id,{
        type:'client'
      })
      .then(response => {
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
          console.log('response,',response)
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

  handleDate(date) {
    this.setState({date_updated:date})
    
  };

    updateNewsTime() {
    axios.post(serverUrl+'api/project/updateNewsTime/'+this.state.news_id, {
      publish_time:this.state.date_updated
      })
      .then(response => {
              this.getProjectdata()
              $('.bd-example-modal-sm').modal('hide')
      })

  }

    async componentDidMount() {
        await this.getProjectdata()
        await this.getFolerByProject(this.state.project_id)
        await this.getFolerByClient(this.state.project_id)

        // await this.getFilesForProject()

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
          <div className="col-xl-4 col-lg-3 text-center" />
          <div className="col-12 col-xl-12 col-lg-12 text-center">
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
        </div>
      </div>
    </div>
  </section>
  {/* top-section */}
  <section className="AddressMain_Block " style={{backgroundImage:"url(" +"/uploads/"+ this.state.backgrounds[0] + ")", backgroundRepeat:"no-repeat", backgroundSize:"100%"}}>
    <div className="container">
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
      <div className="row">
        <div className="col-md-5">           
          <div className="AddressRightBlock Status_Block">
            <h5>סטטוס </h5>
            <div className="form-group form-inline inline-content">
              <div className="custom-control custom-checkbox">
                <label> שינוי סטטוס </label>{/* Choose a color */}
              </div>
              <span className="selectDropdown">
              <select required value={this.state.current_status} onChange={this.handleTimelines} name="current_status">
              <option value=""> שינוי סטטוס </option>
              {this.state.steps && this.state.steps.length?
              this.state.steps.map((pro, index)=> {
                return (
                  <option key={index} value={index}>{pro.step_name} </option>
                )
              })
              :''}
                                            
              </select>
                <img src="/images/DropdownBase.png" alt="DropdownBase" className="DropdownBase" />                       
              </span>
            </div>
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
              <button onClick={()=>{window.open(`/managers/${btoa(this.state.manager_id)}/projects/recipeints/${btoa(this.state.project_id)}`)}} className="btn secondary_btn">
                שליחת עדכון חדש   <img src="/images/comment.png" alt="comment" className="comment-icon-black" /><img src="/images/comment-white.png" alt="comment-white" className="comment-icon" />
              </button>
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

            {/* <div className="folder-edit-btn">                          
              <button className="btn secondary_btn" data-toggle="modal" data-target="#EditFolder2"> <i className="fa fa-pencil-square-o" aria-hidden="true" />
                עריכה 
              </button>
            </div> */}
            <br/>
            
            
            <div className="Documents_List folders_list"> 
              <h5>כללי</h5>                       
              <ul>

              {this.state.folders && this.state.folders.length>0?
                this.state.folders.map((folder, index) => {
                    return (
                    <li key={index}>  <a>
                      <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>{folder.name}
                    </a>
                    </li>
                )}):''}
                
              </ul>
            </div>
            <div className="folder-edit-btn">                          
              <button className="btn secondary_btn" data-toggle="modal" data-target="#EditFolder"> <i className="fa fa-pencil-square-o" aria-hidden="true" />
                עריכה  {/* Template Management */}
              </button>
            </div>
            <br/>
            {/* {this.state.url_link!=null?
            <div className="folder-edit-btn">                          
              <button onClick={()=>{window.open(this.state.url_link)}} className="btn custom-btn">   <i className="fa fa-link" aria-hidden="true" />  
              קישור לשאלון 
              </button>
            </div>
            :''} */}
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
        </div>
      </div>
      <div className="address-block-img">
        <img src="/images/logo-black.png" alt="logo-black" className="img-fluid " />
      </div>
    </div>
  </section>
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
                      <p><span onClick={()=>{this.setState({news_id:update.id})}} data-toggle="modal" data-target=".bd-example-modal-sm" >{moment(update.publish_time).format('DD.MM.YYYY')}</span> -{update.title}</p>
                      
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

        {/* tab 4 User modal */}
        <div className="modal fade bd-example-modal-sm GroupAffiliation_Modal" tabIndex={-1} role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-sm">
              <div className="modal-content">
              <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalCenterTitle">בחר תאריך </h5>{/* Group affiliation */}
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                  </button>
              </div>
              <div className="modal-body" style={{margin: "0 auto"}}>
                  <div className="form-group form-inline inline-content">
                  
                  <DatePicker  className="timeselect form-control" type="text" id="calendar"
                      selected={this.state.date_updated}
                      onChange={this.handleDate}
                  />
                  </div>
              </div>
              <div className="modal-footer">
                  <button type="button" className="btn cancel-btn" data-dismiss="modal">ביטול</button>{/* cancel button */}
                  <button type="button" onClick={this.updateNewsTime.bind(this)} className="btn  add-btn">שינוי</button>
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
                      <p>	{pro.measure}</p>
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
  
          </div>


        );
    }
}

