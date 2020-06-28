import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import SuccessAlert from './SuccessAlert';
import ErrorAlert from './ErrorAlert';
import drop from '../../images/DropdownBase.png';

export default class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:{},
            company_name: '',
            full_name: '',
            company_phone1:'',
            company_email:'',
            company_package:0,
            total_free:0,
            update_client_id:null,
            managers:[],
            manager_id:'',
            emails:[{email:''}],
            company_logo:null,
            spin:false,
            news:[],
            status:'',
        }
        this.showEdit = this.showEdit.bind(this);
        this.getClientData = this.getClientData.bind(this);
        this.onSubmit =  this.onSubmit.bind(this);
        this.companyName =  this.companyName.bind(this);
        this.fullName =  this.fullName.bind(this);
        this.companyPhone =  this.companyPhone.bind(this);
        this.companyEmail =  this.companyEmail.bind(this);
        this.logoChange =  this.logoChange.bind(this);
        
        
    }

    logoChange(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;
        this.creaeLogo(files[0]);
    }

    creaeLogo(file) {
        let reader = new FileReader();
        reader.onload = async(e) => {
            var filename = await this.fileUpload(file)
            if(filename.data.status) {
                this.setState({
                    company_logo: filename.data.fileName
                });
            }
            
        };
        reader.readAsDataURL(file);
    }

    async fileUpload(values) {
        this.setState({spin:true})
        axios.defaults.headers.common["X-CSRF-TOKEN"] = document
                .querySelector('meta[name="csrf-token"]')
                .getAttribute("content");

        let formData = new FormData();
        formData.append('image', values);
        var data = await axios.post(serverUrl+'api/client/insert',  formData )
        this.setState({spin:false})
        return data
    }

    emails = idx => evt => {
        const newsubdivisions = this.state.emails.map((subdivision, sidx) => {
          if (idx !== sidx) return subdivision;
          return { ...subdivision, email: evt.target.value };
        });
        this.setState({ emails: newsubdivisions });
    }

    addFields = (e) => {
        if(this.state.emails.length<5) {
            this.setState({
                emails: this.state.emails.concat([{email:''}])
            });
        }
        
      }

      removeFields(index) {
        this.setState({
            emails: this.state.emails.filter((s, sidx) => index !== sidx)
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

    async getClientData() {
        await axios.post(serverUrl+'api/auth/user')
            .then(async response => {
                this.setState({
                    user: response.data.user_info,
                });

                if(this.state.user.type == 0) {
                    await this.setState({ client_id: localStorage.getItem('manager_id') });
                    await this.showEdit();
                } else if (this.state.user.type == 1){
                    await this.setState({client_id:this.state.user.client_id})
                    await this.showEdit();
                }
                await this.newsByClient()
            })
    }

    async onSubmit(e) {
        e.preventDefault();
        const client = {
            company_name: this.state.company_name,
            full_name: this.state.full_name,
            company_phone: this.state.company_phone1,
            company_email: this.state.company_email,
            company_package: this.state.company_package,
            total_free: this.state.total_free,
            emails: JSON.stringify(this.state.emails),
            company_logo:this.state.company_logo,
            status:this.state.status
        }
        await axios.post(serverUrl+'api/client/update/'+ this.state.update_client_id, client)
        location.reload()

    }

    newsByClient() {
        axios.post(serverUrl+'api/project/newsByClient/'+this.state.client_id)
        .then(response => {
            console.log('response,',response)
            this.setState({
                news: response.data.data,
            });

        }).catch(error => {
            console.log('here',error)
        });
    }

    showEdit() {
        this.setState({
            update_client_id: this.state.client_id
        });
        axios.post(serverUrl+'api/client/show/' + this.state.client_id)
        .then(response => {
            this.setState({
                company_name : response.data.data.client.company_name,
                full_name : response.data.data.client.full_name,
                company_phone1 : response.data.data.client.company_phone1,
                company_email : response.data.data.client.company_email,
                company_package : response.data.data.client.company_package,
                total_free : response.data.data.client.total_free,
                emails:  response.data.data.client.emails!== null ?JSON.parse(response.data.data.client.emails):[{email:''}],
                company_logo: response.data.data.client.company_logo,
                status: response.data.data.client.status,
                
            })
        });
    }
    
    async componentDidMount() {
        await this.getClientData()        
        window.page = 'setting'
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
                <header>
                </header>
                <div className="dashboard_Table_block">
                    <div className="container">
                    <div id="GoTabsBlock">
                        <div className="resp-tabs-container">
                        {this.state.alert_message == "success" ? <SuccessAlert message={"Profile updated successfully."} /> : null}
                        {this.state.alert_message == "error" ? <ErrorAlert message={"Please try again."} /> : null}
                        {/* Tab_content1  Starts*/}
                        <form onSubmit={this.onSubmit}>
                        <div className="GoTab_Content  Tab_content1">

                        <div className="row col-sm-12">
                        <div className="Customers-title text-right">
                        <h5>הגדרות חשבון </h5>{/* Account Settings */}
                        </div>
                        </div>

                            <div className="row">
                                
                            <div className="col-sm-8">
                                
                                <div className="tab-box accountSetting"> 
                                <div className="row">                                  
                                    <div className="col-sm-6 col-md-6">
                                    <div className="form-group text-right">
                                        <label> שם החברה </label>{/* Company */}
                                        <input type="text" className="form-control custom-input" 
                                        name="company_name"
                                            value={this.state.company_name}
                                            onChange={this.companyName}
                                            />
                                    </div>
                                    </div>
                                    <div className="col-sm-6 col-md-6">
                                    <div className="form-group text-right">
                                        <label> נייד</label>{/* Mobile */}
                                        <input type="text" className="form-control custom-input" name="company_phone1"
                                    value={this.state.company_phone1}
                                    onChange={this.companyPhone}/>
                                    </div>
                                    </div>
                                    <div className="col-sm-6 col-md-6">
                                    <div className="form-group text-right">
                                        <label> שם איש קשר</label>{/* Contact */}
                                        <input type="text" className="form-control custom-input" name="full_name"
                                    value={this.state.full_name}
                                    onChange={this.fullName}
                                    />
                                    </div>
                                    </div>
                                    <div className="col-sm-6 col-md-6">
                                    <div className="form-group text-right">
                                        <label> מייל</label>{/* Miles */}
                                        <input disabled type="email" className="form-control custom-input" name="company_email"
                                    value={this.state.company_email}
                                    onChange={this.companyEmail}
                                    />
                                    </div>
                                    </div> 
                                    <div className="col-sm-6 col-md-6">
                                    <div className="andCompany">

                                        <label>לוגו החברה</label>
                                        <div className="logoo">
                                        <div className="logoo2">
                                        {this.state.user.type == 1 ?
                                            <input type="file" className="inputt form-control custom-input" accept=".jpg, .jpeg, .png"  onChange={this.logoChange} />
                                        :''}

                                        {this.state.spin?<i style={{fontSize:"20px"}} className="fa fa-spinner fa-spin" aria-hidden="true"></i>:''}

                                        {this.state.company_logo!==null?
                                        <img style={{position:'absolute', marginTop:'50px',right:'10px'}} src={`/uploads/${this.state.company_logo}`} alt="GoImgUpload" />
                                        :<img style={{position:'absolute', marginTop:'50px',right:'10px'}} src="/images/kidmat_hayovel_logo.png" alt="GoImgUpload" />
                                        }
                                        </div>
                                        </div>
                                        
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="col-sm-4">
                                {/* <div className="Customers-title text-right">
                                <h5>פרטי החבילה</h5>
                                </div>                         */}
                                <div className="tab-box PackageDetail"> 
                                <div className="row">                       
                                    <div className="col-sm-12 col-md-12">
                                    <div className="packageUpdate">
                                        <h6> סוג החבילה: <span> 
                                            {packages} </span>({updated} מתעדכנים) </h6>
                                        <h5> סך הכל מתעדכנים</h5>
                                        <p> {updated} מתוך  {this.state.news?this.state.news.length:0} </p>
                                        <div className="progress" style={{height: 4}}>
                                        <div className="progress-bar" role="progressbar" style={{width: `${this.state.news?(this.state.news.length*100)/updated:0}%`}} aria-valuenow={50} aria-valuemin={0} aria-valuemax={100} />
                                        </div>
                                        <Link className="Software_upgrade_btn secondary_btn mt-4" to={`/managers/${btoa(this.state.client_id)}/purchase`} > שדרוג תוכנה   <img src="/images/upgrade-icon.png" alt="upgrade-icon" /></Link>
                                                {/* } */}
                                                
                                    </div>
                                    </div> 
                                </div>
                                </div>
                                <div className="tab-box UpdatedFree"> 
                                <h6> מתעדכן חינמי</h6>{/* Updated free */}
                                <div className="row">                                
                                    <div className="col-sm-12 col-md-12">
                                    <div className="form-group text-right">
                                        <label> מייל למתעדכן חינמי</label>{/* Address */}
                                        <div className="add_project">
                                        
                                        {this.state.emails.map((divi, idx) => (
                                        <div key={idx}>

                                            {idx==0?
                                                <i className="fa fa-plus" aria-hidden="true" onClick={this.addFields.bind(this, idx)}/>
                                            : <i className="fa fa-minus" aria-hidden="true" onClick={this.removeFields.bind(this, idx)}/> }
                                            <input value={divi.email||''} type="email" className="form-control custom-input" name="emails" onChange={this.emails(idx)}/>
                                        </div>
                                        ))}
                                        
                                        </div>
                                        <span className="comment"> ניתן להוסיף עד 5 מתעדכנים</span>{/* You can add up to 4 addresses to the project */}
                                    </div>
                                    </div> 
                                </div>
                                </div>
                            </div>                  
                            </div>
                            <div className="GoNextPage">
                            <button type="submit" className="btn custom-btn">שמירה</button>{/* add button */}
                            </div>
                        </div>{/* Tab_content1  Ends*/}
                        </form>
                        </div>
                        
                    </div>
                    </div>
                </div>
                </div>

        );
    }
}

