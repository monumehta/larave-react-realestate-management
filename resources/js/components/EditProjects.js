import React, { Component } from 'react';
import { Link, Route } from 'react-router-dom';

import drop from '../../images/DropdownBase.png';
import uploadIcon from '../../images/GoImgUpload-icon.png';
import uploadIconGery from '../../images/GoImgUpload-icon-grey.png';
import exceldark from '../../images/excel-icon-dark.png';
import user from '../../images/user-icon.png';
import userdark from '../../images/user-icon-dark.png';
import rename from '../../images/rename-icon.png';
import hoverrename from '../../images/hover-rename-icon.png';
import excel from '../../images/excel-icon.png';

import SuccessAlert from './SuccessAlert';
import ErrorAlert from './ErrorAlert';
import CsvParse from '@vtex/react-csv-parse'

export default class EditProject extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            step: 1,

            project_name: '',
            city: '',
            remind: false,
            remind_period: '',
            remind_message: ' ',
            subdivisions: [],
            newbackgrounds: [],
            newlogoes: [],
            newgallery: [],
            spinn: false,
            backgrounds: [],
            logoes: [],
            gallery: [],
            sucess: false,
            error: false,

            manager_id: atob(this.props.match.params.id),
            project_id: atob(this.props.match.params.project_id),
            managers: [],

            timelines: [],
            timeline_id: 0,
            steps: [],
            customers: [],
            user: {},
            folder_name: '',
            folder_id: '',
            folders: [],
            files: [],
            uploadedFile: '',
            file_name: '',
            url_link: '',

            file: {},
            data: [],
            cols: [],
            groups: [],
            user_group: '',
            customer_id: '',
            deleteMe: 0,
            show_folder_name: '',
            spin: false,
            spin1: false,
            spin2: false,
            rename_file_id: '',
            rename_file: '',

            customer_files: [],
            customer_folder_id: '',
            customer_folders: [],
            show_customer_folder_name: '',
            file_owner_id: '',
        }

        this.handleChanges = this.handleChanges.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.goBack = this.goBack.bind(this);
        this.showTab = this.showTab.bind(this);
        this.addFields = this.addFields.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onbackgroundChange = this.onbackgroundChange.bind(this);
        this.onLogoChange = this.onLogoChange.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
        // this.getAllManagers = this.getAllManagers.bind(this)
        this.handleManager = this.handleManager.bind(this)

        this.getTimelinesByManager = this.getTimelinesByManager.bind(this)
        this.handleTimelines = this.handleTimelines.bind(this)
        this.onUpdate = this.onUpdate.bind(this)

        this.customerByClient = this.customerByClient.bind(this)
        this.getProjectdata = this.getProjectdata.bind(this)
        this.getUserData = this.getUserData.bind(this)

        this.submitFolder = this.submitFolder.bind(this)
        this.submitFile = this.submitFile.bind(this)
        this.submitFileCustomer = this.submitFileCustomer.bind(this)
        
        this.getFolerByProject = this.getFolerByProject.bind(this)
        this.selectThis = this.selectThis.bind(this)

        this.onFileUpload = this.onFileUpload.bind(this)
        this.onFileUploadCustomer = this.onFileUploadCustomer.bind(this)

        this.fileUploaded = this.fileUploaded.bind(this)
    }

    getGroups() {
        axios.post(serverUrl + 'api/groups', { manager_id: this.state.manager_id })
            .then(response => {
                this.setState({
                    groups: response.data
                });
            })
    }

    stepName = idx => evt => {
        const newsubdivisions = this.state.steps.map((subdivision, sidx) => {
            if (idx !== sidx) return subdivision;
            return { ...subdivision, step_name: evt.target.value };
        });

        this.setState({ steps: newsubdivisions });
    };

    stepMeasure = idx => evt => {
        const newsubdivisions = this.state.steps.map((subdivision, sidx) => {
            if (idx !== sidx) return subdivision;
            return { ...subdivision, measure: evt.target.value };
        });

        this.setState({ steps: newsubdivisions });
    };

    reminder = idx => evt => {
        const newsubdivisions = this.state.steps.map((subdivision, sidx) => {
            if (idx !== sidx) return subdivision;
            return { ...subdivision, reminder_text: evt.target.value };
        });

        this.setState({ steps: newsubdivisions });
    };



    reminderCheck = idx => evt => {
        const newsubdivisions = this.state.steps.map((subdivision, sidx) => {
            if (idx !== sidx) return subdivision;
            return { ...subdivision, reminder_check: evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value };
        });

        this.setState({ steps: newsubdivisions });
    };

    addSteps = (e) => {
        e.preventDefault()
        this.setState({
            steps: this.state.steps.concat([{ "step_name": "", "measure": "", "reminder_check": true, "reminder_text": '' }])
        });
    }

    removeSteps(index) {
        this.setState({
            steps: this.state.steps.filter((s, sidx) => index !== sidx)
        });
    }


    subdivisionaddress = idx => evt => {
        const newsubdivisions = this.state.subdivisions.map((subdivision, sidx) => {
            if (idx !== sidx) return subdivision;
            return { ...subdivision, address: evt.target.value };
        });

        this.setState({ subdivisions: newsubdivisions });
    };

    subdivisionsmooth = idx => evt => {
        const newsubdivisions = this.state.subdivisions.map((subdivision, sidx) => {
            if (idx !== sidx) return subdivision;
            return { ...subdivision, smooth: evt.target.value };
        });

        this.setState({ subdivisions: newsubdivisions });
    };

    subdivisiontotal = idx => evt => {
        const newsubdivisions = this.state.subdivisions.map((subdivision, sidx) => {
            if (idx !== sidx) return subdivision;
            return { ...subdivision, total_subdivision: evt.target.value };
        });

        this.setState({ subdivisions: newsubdivisions });
    };

    addFields = (e) => {
        this.setState({
            subdivisions: this.state.subdivisions.concat([{ address: "", smooth: "", total_subdivision: "" }])
        });
    }

    removeFields(index) {
        this.setState({
            subdivisions: this.state.subdivisions.filter((s, sidx) => index !== sidx)
        });
    }

    getUserData() {
        axios.post(serverUrl + 'api/auth/user')
            .then(response => {
                this.setState({
                    user: response.data.user_info,
                });

                if (this.state.user.type != 0) {
                    this.setState({
                        manager_id: response.data.user_info.client_id
                    });
                }

            }).catch(error => {
                console.log('here', error)
            });
    }

    customerByClient(id) {
        axios.post(serverUrl + 'api/customer/customerByProject/' + id)
            .then(response => {
                console.log('response,', response)
                this.setState({
                    customers: response.data,
                });

            }).catch(error => {
                console.log('here', error)
            });
    }

    getTimelinesByManager(id) {
        axios.post(serverUrl + 'api/timelines/timeineByClient/' + id)
            .then(response => {
                this.setState({
                    timelines: response.data,
                });
                this.setState({ timeline_id: this.state.timelines[0].id })
                this.setState({ steps: this.state.timelines[0].timeline })

            }).catch(error => {
                console.log('here', error)
            });
    }

    async handleTimelines(e) {
        const input = e.target;
        const name = input.name;
        const value = input.type === 'checkbox' ? input.checked : input.value;
        this.setState({ [name]: value });
        let index = this.state.timelines.findIndex(function (d) {
            return d.id == input.value;
        });
        if (index >= 0)
            this.setState({ steps: this.state.timelines[index].timeline })
        else
            this.setState({ steps: [] })
    };







    async fileUpload(values, stage) {
        if (stage == 1) this.setState({ spin: true })
        if (stage == 2) this.setState({ spin1: true })
        if (stage == 3) this.setState({ spin2: true })


        axios.defaults.headers.common["X-CSRF-TOKEN"] = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        let formData = new FormData();
        formData.append('image', values);
        var data = await axios.post(serverUrl + 'api/project/insert', formData)

        if (stage == 1) this.setState({ spin: false })
        if (stage == 2) this.setState({ spin1: false })
        if (stage == 3) this.setState({ spin2: false })

        return data
    }




    async onChange(e) {

        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;
        await this.createGallary(files[0]);
    }
    async createGallary(file) {
        console.log('file', file)
        let reader = new FileReader();
        reader.onload = async (e) => {
            var filename = await this.fileUpload(file, 1)
            console.log('filename', filename)
            if (filename.data.status) {
                this.setState({
                    gallery: this.state.gallery.concat([filename.data.fileName])
                });
            }

        };
        reader.readAsDataURL(file);
    }

    async onbackgroundChange(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;
        await this.createBackgroung(files[0]);
    }

    async createBackgroung(file) {
        let reader = new FileReader();
        reader.onload = async (e) => {
            var filename = await this.fileUpload(file, 2)
            if (filename.data.status) {
                await this.setState({
                    backgrounds: this.state.backgrounds.concat([filename.data.fileName])
                });
            }
        };
        reader.readAsDataURL(file);

    }

    async onLogoChange(e) {

        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;
        await this.createLogo(files[0]);
    }

    async createLogo(file) {
        let reader = new FileReader();
        reader.onload = async (e) => {
            var filename = await this.fileUpload(file, 3)
            if (filename.data.status) {
                this.setState({
                    logoes: this.state.logoes.concat([filename.data.fileName]),
                });
            }
        };
        reader.readAsDataURL(file);
    }

    handleChanges(e) {
        const input = e.target;
        const name = input.name;
        const value = input.type === 'checkbox' ? input.checked : input.value;
        this.setState({ [name]: value });
    };

    getClientsByGroup(e) {

        const input = e.target;
        const name = input.name;
        const value = input.type === 'checkbox' ? input.checked : input.value;
        this.setState({ [name]: value });

        e.preventDefault()
        console.log(e.target.value)
        if (e.target.value !== '') {
            axios.post(serverUrl + 'api/customer/customerByProjectAndGroup/' + this.state.project_id, {
                group_id: e.target.value
            })
                .then(response => {
                    this.setState({
                        customers: response.data,
                    });

                }).catch(error => {
                    console.log('here', error)
                });
        } else {
            this.customerByClient(this.state.project_id);
        }

    }

    goBack() {
        this.props.history.goBack();
    }

    showTab(num) {
        this.setState({
            step: num
        });
    }

    async onSubmit(e) {
        e.preventDefault();
        const data = {
            client_id: this.state.manager_id,
            project_name: this.state.project_name,
            city: this.state.city,
            remind: this.state.remind,
            remind_period: this.state.remind_period,
            remind_message: this.state.remind_message,
            subdivision: this.state.subdivisions,
            url_link: this.state.url_link,
            newbackgrounds: this.state.backgrounds,
            newlogoes: this.state.logoes,
            newgallery: this.state.gallery,
        }
        axios.post(serverUrl + 'api/project/update/' + this.state.project_id, data)
            .then(async res => {
                this.showTab(2)
            })

    }

    async onUpdate(e) {
        console.log('this.state.steps', this.state.steps)
        e.preventDefault();
        const data = {
            timeline_id: this.state.timeline_id,
            steps: this.state.steps,
        }
        axios.post(serverUrl + 'api/project/update/' + this.state.project_id, data)
            .then(res => {
                this.showTab(3)
            })
    }

    renameFile(e) {
        e.preventDefault();

        console.log(this.state.rename_file, this.state.rename_file_id)
        if (this.state.rename_file_id !== '') {
            axios.post(serverUrl + 'api/file/rename/' + this.state.rename_file_id, { file_name: this.state.rename_file })
                .then(res => {
                    $('#renameFile').modal('hide');
                    this.getFolerByProject(this.state.project_id);
                })
        }

    }

    async onCustomerUpdate(e) {
        e.preventDefault();
        if (this.state.user_group !== '') {
            axios.post(serverUrl + 'api/customer/updateGroup/' + this.state.customer_id, { group_id: this.state.user_group })
                .then(res => {
                    $('.GroupAffiliation_Modal').modal('hide');
                    // $('.dropCustomer').toggle()
                    this.customerByClient(this.state.project_id);
                })
        }

    }

    async handleManager(e) {
        const input = e.target;
        const name = input.name;
        const value = input.type === 'checkbox' ? input.checked : input.value;
        this.setState({ [name]: value, project_name: '', city: '', timeline_id: '', timelines: [], customers: [] });

    }

    getProjectdata() {
        axios.post(serverUrl + 'api/project/show/' + this.state.project_id)
            .then(response => {
                this.setState({
                    project_name: response.data.project_name,
                    city: response.data.city,
                    remind: response.data.remind ? true : false,
                    remind_period: response.data.remind_period != null ? response.data.remind_period : '',
                    remind_message: response.data.remind_period != null ? response.data.remind_period : ' ',
                    subdivisions: response.data.subdivision,
                    backgrounds: response.data.backgrounds,
                    logoes: response.data.logoes,
                    gallery: response.data.gallery,
                    manager_id: response.data.client_id,
                    project_id: response.data.id,
                    timeline_id: response.data.timeline_id,
                    steps: response.data.steps,
                    url_link: response.data.url_link,
                })
                this.getTimelinesByManager(this.state.manager_id);
                this.customerByClient(this.state.project_id);
                this.getFolerByProject(this.state.project_id)
                this.getFolerByClient(this.state.project_id)



            }).catch(error => {
                console.log('hereeee', error)
            });
    }

    selectThis(folder_id, folder_name) {
        axios.post(serverUrl + 'api/file/getfolderfiles/' + folder_id)
            .then(response => {
                this.setState({
                    files: response.data,
                    folder_id: folder_id,
                    show_folder_name: folder_name
                });

            }).catch(error => {
                console.log('here', error)
            });
    }

    selectThisCustomer(folder_id, folder_name, owner_id) {
        axios.post(serverUrl + 'api/file/getfolderfiles/' + folder_id)
            .then(response => {
                this.setState({
                    customer_files: response.data,
                    customer_folder_id: folder_id,
                    show_customer_folder_name: folder_name,
                    file_owner_id: owner_id
                });

            }).catch(error => {
                console.log('here', error)
            });
    }

    async getFolerByClient() {
        axios.post(serverUrl + 'api/folder/projectFolders/' + this.state.project_id, {
            type: 'customer'
        })
            .then(response => {
                this.setState({
                    customer_folders: response.data,
                });

                if (this.state.customer_folders && this.state.customer_folders.length > 0) {
                    this.selectThisCustomer(this.state.customer_folders[0].id, this.state.customer_folders[0].name, this.state.customer_folders[0].owner_id)
                }

            }).catch(error => {
                console.log('here', error)
            });
    }

    async getFolerByProject() {
        axios.post(serverUrl + 'api/folder/projectFolders/' + this.state.project_id, {
            type: 'client'
        })
            .then(response => {
                this.setState({
                    folders: response.data,
                    folder_name: '',
                });

                if (this.state.folders && this.state.folders.length > 0) {
                    this.setState({ show_folder_name: this.state.folders[0].name })
                    this.selectThis(this.state.folders[0].id, this.state.folders[0].name)
                }

            }).catch(error => {
                console.log('here', error)
            });
    }

    async submitFolder(e) {
        e.preventDefault();
        const data = {
            project_id: this.state.project_id,
            client_id: this.state.manager_id,
            folder_name: this.state.folder_name,
        }

        this.setState({ show_folder_name: this.state.folder_name, spinn: true })
        axios.post(serverUrl + 'api/folder/new', data)
        .then(async res => {
            this.setState({ folder_id: res.data, spinn: false })
            await this.getFolerByProject(this.state.project_id);
            $('#NewClientForm').modal('hide')
            document.getElementById("NewClientForm").reset();
        }).catch(error => {
            this.setState({ spinn: false })
            // this.setState({ alert_message: "error", message:'Please Try again!'});
        })

    }

    async submitFileCustomer(e) {
        e.preventDefault();
        this.setState({ spinn: true })  
        if(this.state.customer_file_name !== undefined && this.state.customer_file_name !== '')       {
            const data = {
                project_id: this.state.project_id,
                client_id: this.state.manager_id,
                folder_id: 0,
                file_name: this.state.customer_file_name,
                owner_id: this.state.file_owner_id,
                name: this.state.user.name,
                client_upload: true,
            }
            
            axios.post(serverUrl + 'api/file/upload', data)
            .then(async res => {
                this.getFolerByClient(this.state.project_id)

                this.setState({ customer_file_name: '' })
                $('#NewClientFormuploadCustomer').modal('hide');
                this.setState({ spinn: false })
                document.getElementById("formFile").reset();

            }).catch(error => {
                this.setState({ spinn: false })
            })    
        }
    }

    async submitFile(e) {
        this.setState({ spinn: true })
        e.preventDefault();
        const data = {
            project_id: this.state.project_id,
            client_id: this.state.manager_id,
            folder_id: this.state.folder_id,
            file_name: this.state.file_name
        }
        axios.post(serverUrl + 'api/file/upload', data)
            .then(async res => {
                this.selectThis(this.state.folder_id, this.state.show_folder_name)
                this.setState({ file_name: '' })
                $('#NewClientFormupload').modal('hide');
                this.setState({ spinn: false })
                document.getElementById("formFile").reset();
            }).catch(error => {
                this.setState({ spinn: false })
            })

    }

    onFileUploadCustomer(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;
        this.fileUploadedCustomer(files[0]);
    }

    async fileUploadedCustomer(file) {
        var filename = await this.fileUploadFolder(file)
        
        if (filename.data.status) {
            // this.setState({ alert_message: "success" , message:'file added successfully!'})
            await this.setState({
                customer_file_name: filename.data.fileName
            });
            await this.selectThisCustomer(this.state.customer_folder_id, this.state.show_customer_folder_name,this.state.file_owner_id)
        } else {
            this.setState({ folder_id: res.data })
        }


    }

    async fileUploadFolder(values) {

        axios.defaults.headers.common["X-CSRF-TOKEN"] = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute("content");

        let formData = new FormData();
        formData.append('image', values);
        var data = await axios.post(serverUrl + 'api/file/insert', formData)
        return data
    }

    onFileUpload(e) {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length)
            return;
        this.fileUploaded(files[0]);
    }

    async fileUploaded(file) {
        var filename = await this.fileUploadFolder(file)
        console.log('filename.data', filename.data)
        if (filename.data.status) {
            // this.setState({ alert_message: "success" , message:'file added successfully!'})
            await this.setState({
                file_name: filename.data.fileName
            });
            await this.selectThis(this.state.folder_id, this.state.show_folder_name)
        } else {
            this.setState({ folder_id: res.data })
        }


    }

    handleError = data => {
        console.log(data)
    }

    handleData = data => {
        this.setState({ spinn: true })
        axios.post(serverUrl + 'api/customer/import', { data: data, client_id: this.state.manager_id, project_id: this.state.project_id })
            .then(async res => {
                this.setState({ customers: res.data.data, spinn: false });
                this.setState({ alert_message: "", message: '' });

            }).catch(error => {
                this.setState({ alert_message: "error", message: 'פרטים זהים קיימים במערכת' });
                this.setState({ spinn: false })
            })
    }

    removeGallery(index) {
        this.setState({
            gallery: this.state.gallery.filter((s, sidx) => index !== sidx)
        });
        this.setState({
            newgallery: this.state.newgallery.filter((s, sidx) => index !== sidx)
        });

    }
    removeBackground(index) {
        this.setState({
            backgrounds: this.state.backgrounds.filter((s, sidx) => index !== sidx)
        });
        this.setState({
            newbackgrounds: this.state.newbackgrounds.filter((s, sidx) => index !== sidx)
        });

    }
    removeLogo(index) {
        this.setState({
            logoes: this.state.logoes.filter((s, sidx) => index !== sidx)
        });
        this.setState({
            newlogoes: this.state.newlogoes.filter((s, sidx) => index !== sidx)
        });

    }

    async onDelete(folder_id) {
        axios.post(serverUrl + 'api/folder/delete/' + folder_id)
            .then(async response => {
                await this.getFolerByProject(this.state.project_id);

            })
    }

    async onDeleteCustomer(client_id) {
        this.setState({ spin: true })
        axios.post(serverUrl + 'api/client/deletesubscriber/' + client_id)
            .then(async response => {
                var customers = this.state.customers;
                for (var i = 0; i < customers.length; i++) {
                    if (customers[i].id == client_id) {
                        customers.splice(i, 1);
                        this.setState({ customers: customers });
                    }
                }
                await this.setState({ spin: false })
                $('#deletePopup').modal('hide')
            })

    }

    async onFileDelete(file_id) {
        axios.post(serverUrl + 'api/file/delete/' + file_id)
            .then(async response => {
                await this.getFolerByProject(this.state.project_id);

            })
    }

    updateCustomer(customer_id) {
        this.setState({ customer_id: customer_id })
    }

    async componentDidMount() {
        await this.getUserData()
        await this.getProjectdata()
        await this.getGroups()

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
    }

    render() {
        const keys = [
            'group_id','total_free','full_name','mobile','email','updated','country_apartment','mailing_address','street','building_number','entress','block','smooth','sub_divistion','percentage_of_ownership','apartment','floor','current_apartment_area','current_apartment_type','additional_space','balcony_area','storage_space','parking','warning','date_of_signature', 'remarks','documentation','inquiries','status','customer_status'
        ]

       
        
        
        return (
           <div className="dashboard_content_block_Main">
               <header>
               {/* <div id="accordion">
                <div class="group" id="divGroup1">
                    <div class="content">Section 1</div>
                </div>
                <div class="group" id="divGroup2">
                    <div class="content">Section 2</div>
                </div>
                <div class="group"  id="divGroup3">
                    <div class="content">Section 3</div>
                </div>
                <div class="group"  id="divGroup4">
                    <div class="content">Section 4</div>
                </div>
            </div>
 
            <input id="changevalues" type="text" value="" /> */}

               </header>
               <div className="dashboard_Table_block">
                    <div className="container">
                    
                    {this.state.alert_message == "success" ? <SuccessAlert message={this.state.message} /> : null}
                    {this.state.alert_message == "error" ? <ErrorAlert message={this.state.message} /> : null}

                        <div className="row align-items-end">
                        <div className="col-sm-6">
                            <div className="Customers-title text-right">
                            <h5>פרוייקט חדש  </h5>{/* New project */}
                            </div>
                            
                        </div>
                        </div>
                        <div id="GoTabsBlock">
                        <ul className="resp-tabs-list GoTabsList">
                            <li onClick={this.showTab.bind(this,1)}  className="tab-list-item">פרטים כללים </li>{/* General details */}
                            <li onClick={this.showTab.bind(this, 2)}  className="tab-list-item">ציר זמן</li>{/* Timeline */}
                            <li onClick={this.showTab.bind(this, 3)}  className="tab-list-item">מסמכים</li>{/* Documents */}
                            <li onClick={this.showTab.bind(this, 4)}  className="tab-list-item">מתעדכנים </li>{/* Are being updated */}
                        </ul>
                        <div className="resp-tabs-container">
                            {this.state.step ==1 ?
                            <form onSubmit={this.onSubmit}>
                            <div className="GoTab_Content  Tab_content1">
                            <div className="ClientForm  tab-box">          
                                <div className="row">

                                    <div className="col-sm-3 ">                                    
                                        <div className="form-group text-right">
                                        <label> שם הפרוייקט  </label>{/* the project's name */}
                                        <input required type="text" value={this.state.project_name} onChange={this.handleChanges} name='project_name' className="form-control custom-input" />
                                        </div>
                                        <div className="form-group text-right">
                                        <label>עיר </label>{/* City */}
                                        <input required type="text" value={this.state.city} onChange={this.handleChanges} name='city' className="form-control custom-input" />
                                        </div> 
                                        <div className="form-group text-right">
                                        <label>קישור לשאלון </label>{/*  */}
                                        <input  type="text" value={this.state.url_link} onChange={this.handleChanges} name='url_link' className="form-control custom-input" />
                                        </div> 
                                      
                                    </div> 
                                    
                                    <div className="col-sm-6">
                                    <div className="TemplateTable Address_table">
                                    <div className="table-responsive">
                                        <table className="table fixed_header">
                                        <thead>
                                            <tr>
                                            <th> כתובת (רחוב ומספר בניין) </th>{/* Address (street and building number) */}
                                            <th> חלקה</th>
                                            <th>  סה”כ תתי החלקות </th>
                                            <th style={{width:'50px'}}> </th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                        {this.state.subdivisions.map((divi, idx) => (
                                        <tr key={idx}>

                                        <td> <input required value={divi.address || ''}type="text" className="form-control" name="address" onChange={this.subdivisionaddress(idx)}/> </td>

                                        <td> <input required value={divi.smooth ||''}  type="text" className="form-control" name="smooth" onChange={this.subdivisionsmooth(idx)}/> </td>

                                        <td> <input required value={divi.total_subdivision||''}  type="text" className="form-control" name="total_subdivision" onChange={this.subdivisiontotal(idx)}/>  </td>
                                        
                                        {idx>0?
                                            <td style={{width:'50px'}}>
                                            <a onClick={this.removeFields.bind(this, idx)} className="add_project">
                                            <i className="fa fa-minus" aria-hidden="true" />
                                            </a></td>
                                         :
                                         <td style={{width:'50px'}}>
                                            <a onClick={this.removeFields.bind(this, idx)} className="add_project">
                                            <i style={{border:'none'}} className="fa" aria-hidden="true" />
                                            </a></td>
                                        }
                                        
                                        </tr>
                                        ))}
                                       
                                        </tbody>  
                                        <tfoot>
                                            <tr>
                                            <td>
                                                <a onClick={this.addFields.bind(this)} className="add_project">
                                                <i className="fa fa-plus" aria-hidden="true" />
                                                </a>
                                            </td>
                                            </tr>             
                                        </tfoot>              
                                        </table>              
                                    </div>
                                    </div>                   
                                </div>
                                    
                                    <div className="col-sm-3">
                                        <div className="form-group form-inline inline-content">
                                        <div className="custom-control custom-checkbox">
                                            <input  type="checkbox" className="custom-control-input" id="customCheck" value={this.state.remind} onChange={this.handleChanges} name="remind" />
                                            <label className="custom-control-label" htmlFor="customCheck">אפשרות תזכורת למנהל</label>{/* Reminder option To the manager */}
                                        </div>
                                        
                                        <span className="selectDropdown">
                                            <select  value={this.state.remind_period} onChange={this.handleChanges} name="remind_period">
                                            <option value="">בחר תזכורת לתקופה </option>
                                            <option value="פעם בשבועיים"> פעם בשבוע </option>
                                            <option value="פעם בשבועיים"> פעם בשבועיים </option>
                                            <option value="פעם בחודש"> פעם בחודש </option>
                                            <option value="פעם בחצי שנה"> פעם בחצי שנה </option>
                                            </select>
                                            <img src={drop} alt="DropdownBase" className="DropdownBase" />                       
                                        </span>
                                        </div> 
                                        <div className="form-group text-right">
                                        <label>תזכורת </label>
                                        <textarea  className="form-control custom-input" value={this.state.remind_message} onChange={this.handleChanges} name="remind_message"/> 
                                        </div>                     
                                    </div>

                                
                                
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">                    
                                <div className="tab-box GoImgUpload GoPhotoGallery"> 
                                    <h6>גלריה תמונות מתחלפות </h6>{/* Exchangeable photo gallery */}
                                    <div className="row">                                  
                                    {this.state.gallery && this.state.gallery.length > 0 ?
                                    this.state.gallery.map((logo,i) => {
                                        return (
                                            <div key={i} className="col-sm-4 col-md-3">
                                                <figure>
                                                <img src={`/uploads/${logo}`} alt="GoImgUpload" />
                                                </figure>
                                                <a onClick={this.removeGallery.bind(this, i)} className="add_project">
                                                <i className="fa fa-minus" aria-hidden="true" />
                                                </a>
                                            </div>
                                        )
                                    })
                                    :''}
                                    <div className="col-sm-4 col-md-3">
                                        <figure className="fileupload GoImgUpload-icon">
                                        {this.state.spin?<i style={{fontSize:"20px",position:"absolute", fontSize:"20px"}} className="fa fa-spinner fa-spin" aria-hidden="true"></i>:
                                        <img style={{position:'absolute'}} src={uploadIcon} alt="GoImgUpload" />
                                        }                  
                                        <input style={{opacity:'0', width:'100%'}} type="file" accept=".jpg, .jpeg, .png"  onChange={this.onChange} />
                                        </figure>
                                    </div>                                   
                                    
                                    </div>
                                </div>
                                </div>
                                <div className="col-sm-6">                          
                                <div className="tab-box GoImgUpload GoBackgroundPicture"> 
                                    <h6> תמונת רקע </h6>{/* Background picture */}
                                    <div className="row">   
                                    {this.state.backgrounds && this.state.backgrounds.length > 0 ?                    
                                        this.state.backgrounds.map((logo,i) => {
                                            return (
                                                <div key={i} className="col-sm-4 col-md-3">
                                                    <figure>
                                                    <img src={`/uploads/${logo}`} alt="GoImgUpload" />
                                                    </figure>
                                                    <a onClick={this.removeBackground.bind(this, i)} className="add_project">
                                                <i className="fa fa-minus" aria-hidden="true" />
                                                </a>
                                                </div>
                                            )
                                        })
                                    :''}
                                    <div className="col-sm-4 col-md-3">
                                        <figure className="fileupload GoImgUpload-icon">
                                        {this.state.spin1?<i style={{fontSize:"20px",position:"absolute", fontSize:"20px"}} className="fa fa-spinner fa-spin" aria-hidden="true"></i>:
                                        <img style={{position:'absolute'}} src={uploadIcon} alt="GoImgUpload" />
                                        }       
                                        <input style={{opacity:'0', width:'100%'}} type="file" accept=".jpg, .jpeg, .png"  onChange={this.onbackgroundChange} />
                                        </figure>
                                    </div>    
                                    </div>
                                </div>
                                <div className="tab-box GoImgUpload GoAnotherLogo"> 
                                    <h6>הוסף לוגו נוסף לפרוייקט </h6>{/* Add another logo to the project */}
                                    <div className="row">                                
                                    {this.state.logoes && this.state.logoes.length > 0 ?
                                        this.state.logoes.map((logo,i) => {
                                            return (
                                                <div key={i} className="col-sm-4 col-md-3">
                                                    <figure>
                                                    <img src={`/uploads/${logo}`} alt="GoImgUpload" />
                                                    </figure>
                                                    <a onClick={this.removeLogo.bind(this, i)} className="add_project">
                                                    <i className="fa fa-minus" aria-hidden="true" />
                                                    </a>
                                                </div>
                                            )
                                        })
                                    :''}
                                    <div className="col-sm-4 col-md-3">
                                        <figure className="fileupload GoImgUpload-icon">
                                        {this.state.spin2?<i style={{fontSize:"20px",position:"absolute", fontSize:"20px"}} className="fa fa-spinner fa-spin" aria-hidden="true"></i>:
                                        <img style={{position:'absolute'}} src={uploadIconGery} alt="GoImgUpload" />
                                        }
                                        <input style={{opacity:'0', width:'100%'}} type="file" accept=".jpg, .jpeg, .png"  onChange={this.onLogoChange} />
                                        </figure>
                                    </div>
                                    </div>
                                </div>
                                </div>                  
                            </div>
                            <div className="GoNextPage">
                                <button type="submit" className="btn custom-btn"> הבא   <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left"><polyline points="15 18 9 12 15 6" /></svg></button> {/* the next */}                  
                            </div>
                            </div>
                            
                            </form>
                            :''}
                            
                            
                            {this.state.step ==2 ?
                            <form onSubmit={this.onUpdate}>
                            <div className="GoTab_Content Tab_content2">   
                            <div className="row ">
                                <div className="col-sm-9">
                                <ul className="GoTemplateBlock">
                                    <li>
                                    שם התבנית
                                    </li>{/* The template name */}
                                    <li>                        
                                    <div className="form-group form-inline inline-content">
                                        <span className="selectDropdown">
                                        
                                        <select value={this.state.timeline_id} onChange={this.handleTimelines} name="timeline_id">
                                        <option value=''>Select timeline </option>
                                            {this.state.timelines && this.state.timelines.length>0?
                                                this.state.timelines.map((timeline,index)=> {
                                                    return (
                                                        <option key={index} value={timeline.id}>{timeline.name} </option>
                                                    )
                                                })
                                            :''}                                            
                                            </select>
                                        <img src={drop} alt="DropdownBase" className="DropdownBase" />
                                        </span>
                                    </div>
                                    </li>
                                    <li>
                                    אנא בחרו מתוך תבניות ציר זמן קיימות או צרו ציר זמן חדש דרך “ניהול תבניות”
                                    </li>
                                </ul>
                                </div>
                                <div className="col-sm-3"> 
                                <div className="Template_Button">                   
                                    <Link to="/template" className="btn secondary_btn">
                                     תבניות   <i className="fa fa-pencil" aria-hidden="true" />
                                    </Link>
                                </div>
                                </div>
                            </div>
                            <div className="table_block TemplateTable">
                                <div className="table-responsive">
                                <table className="table text-right table-border">
                                    <thead>
                                    <tr>
                                        <th> מספר   </th>
                                        <th>  שם השלב  </th>
                                        <th>  מידה נוסף  </th>
                                        <th>  תזכורת למנהל  </th>
                                        <th>    </th>
                                    </tr>
                                    </thead>
                                    <tbody className="sortable">
                                    { this.state.steps && this.state.steps.length >0 &&
                                     this.state.steps.map((step, index)=>{
                                        return (
                                            <tr key={index}>
                                            
                                                <td>{index+1}</td>
                                                <td>
                                                <input required value={step.step_name || ''}type="text" className="form-control" required name="step_name" onChange={this.stepName(index)}/>
                                                </td>
                                                <td><p className="rubik-regular">
                                                    <input  value={step.measure || ''}type="text" className="form-control"  name="measure" onChange={this.stepMeasure(index)}/>
                                                    </p></td>
                                                <td>                      
                                                <div className="custom-control custom-checkbox">
                                                    <input onChange={this.reminderCheck(index)} value={step.reminder_check} type="checkbox" className="custom-control-input" id={`example1${index}`} name={`example1${index}`} />
                                                    
                                                    <label className="custom-control-label" htmlFor={`example1${index}`}> <input  value={step.reminder_text || ''}type="text" className="form-control"  name="reminder_text" onChange={this.reminder(index)}/></label>

                                                </div>
                                                </td>                    
                                                <td>
                                                <div className="action-icons">
                                                    <a onClick={this.removeSteps.bind(this, index)}>
                                                    <svg stroke="#d62d2d" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg>
                                                    </a>                        
                                                </div>
                                                </td>
                                            
                                        </tr>
                                        )
                                     })
                                   
                                    } 
                                    </tbody>     
                                        
                                </table> 
                                <div className="add_moree">
                                        <button onClick={this.addSteps.bind(this)} className="add_more_btn btn">הוסף שלב   <i className="fa fa-plus" aria-hidden="true"></i></button>

                                        </div>             
                                </div>
                            </div>
                            
                            <div className="GoNextPage">
                                <button className="btn custom-btn" type="submit">
                                הבא   
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left"><polyline points="15 18 9 12 15 6" /></svg>
                                </button>
                            </div>
                            </div>
                            </form>
                            :''}

                           {this.state.step ==3 ?
                            <div className="GoTab_Content Tab_content3">
                            <div className="Documents_Tabs">                  
                                <div className="row">
                                <div className="col-sm-3 border-left">
                                    <div className="Documents_List">
                                    <button data-toggle="modal" data-target="#NewClientForm" className="btn new_file_btn">
                                    תיקייה חדשה
                                        <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder-plus"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /><line x1={12} y1={11} x2={12} y2={17} /><line x1={9} y1={14} x2={15} y2={14} /></svg>
                                    </button>
                                    <ul>
                                    {this.state.folders && this.state.folders.length>0?
                                        this.state.folders.map((folder, index) => {
                                            return (
                                                <li key={index}>                                            
                                                <a onClick={this.selectThis.bind(this, folder.id, folder.name)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                                                    {folder.name}
                                                    <svg onClick={()=>{$('.Doc_ed'+folder.id).toggle()}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                                </a>
                                            <div className={`Doc_edits Doc_ed${folder.id}`}>
                                                <ul>
                                                {/* <li> <a href="#"><img src={rename} alt="rename-icon.png" className="rename-icon" /> <img src={hoverrename} alt="hover-rename-icon.png" className="hover-rename-icon" /> שינוי שם </a></li>
                                                <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg> עריכה  </a></li>
                                                <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1={12} y1={15} x2={12} y2={3} /></svg> הורדה  </a></li> */}
                                                <li><a onClick={this.onDelete.bind(this, folder.id)}><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg> מחיקה </a></li>
                                                 </ul>
                                            </div>
                                            </li>
                                            )                                            
                                        }):''}                                      


                                    </ul>
                                    </div>{/* Documents_List */}
                                </div>
                                {this.state.folders.length>0?
                                    <div className="col-sm-3 border-left">
                                    
                                        <div className="Documents_List Documents_uploading">
                                        {this.state.show_folder_name!='' ? 
                                        <button data-toggle="modal" data-target="#NewClientFormupload" className="btn new_file_btn">
                                            העלת קובץ
                                            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder-plus"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /><line x1={12} y1={11} x2={12} y2={17} /><line x1={9} y1={14} x2={15} y2={14} /></svg>
                                        </button>
                                        :''}

                                        <div className="uploading_heading">
                                        {this.state.show_folder_name!='' ? 
                                            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                                        :''}
                                            {this.state.show_folder_name}
                                        </div>
                                        <ul>
                                        {this.state.files && this.state.files.length>0?
                                            this.state.files.map((file, index) => {
                                                return (
                                                    <li key={index}>  
                                            
                                            <a>
                                                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#06b4ff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1={16} y1={13} x2={8} y2={13} /><line x1={16} y1={17} x2={8} y2={17} /><polyline points="10 9 9 9 8 9" /></svg>
                                                {index+1} {file.file_name}
                                                <svg onClick={()=>{$('.Doc_ed'+file.id).toggle()}} xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx={12} cy={12} r={1} /><circle cx={12} cy={5} r={1} /><circle cx={12} cy={19} r={1} /></svg>
                                            </a>
                                            <div className={`Doc_edit2 Doc_ed${file.id}`}>
                                                <ul>
                                                <li> <a onClick={()=>{this.setState({rename_file:file.file_name, rename_file_id:file.id})}} data-toggle="modal" data-target="#renameFile"><img src={rename} alt="rename-icon.png" className="rename-icon" /> <img src={hoverrename} alt="hover-rename-icon.png" className="hover-rename-icon" /> שינוי שם </a></li>
                                                {/* <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg> עריכה  </a></li>*/}
                                                <li><a href={`/uploads/${file.file_path}`} download><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1={12} y1={15} x2={12} y2={3} /></svg> הורדה  </a></li> 
                                                <li><a onClick={this.onFileDelete.bind(this, file.id)}><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg> מחיקה </a></li>
                                                </ul>
                                            </div>
                                            </li>
                                            )}):''}
                                        </ul>
                                        </div>{/* Documents_List */}
                                    </div>

                                :''}




                                <div className="col-sm-3 border-left">
                                    <div className="Documents_List">
                                    <button className="btn new_file_btn">
                                    תיקייה 
                                    </button>
                                    <ul>
                                    {this.state.customer_folders && this.state.customer_folders.length>0?
                                        this.state.customer_folders.map((folder, index) => {
                                            return (
                                                <li key={index}>                                            
                                                <a onClick={this.selectThisCustomer.bind(this, folder.id, folder.name, folder.owner_id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                                                    {folder.name}
                                                    <svg onClick={()=>{$('.Doc_edd'+folder.id).toggle()}} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                                </a>
                                            <div className={`Doc_edits Doc_edd${folder.id}`}>
                                                <ul>
                                                {/* <li> <a href="#"><img src={rename} alt="rename-icon.png" className="rename-icon" /> <img src={hoverrename} alt="hover-rename-icon.png" className="hover-rename-icon" /> שינוי שם </a></li>
                                                <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg> עריכה  </a></li>
                                                <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1={12} y1={15} x2={12} y2={3} /></svg> הורדה  </a></li> */}
                                                <li><a onClick={this.onDelete.bind(this, folder.id)}><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg> מחיקה </a></li>
                                                 </ul>
                                            </div>
                                            </li>
                                            )                                            
                                        }):''}                                      


                                    </ul>
                                    </div>{/* Documents_List */}
                                </div>
                                {this.state.customer_folders.length>0?
                                    <div className="col-sm-3">
                                    
                                        <div className="Documents_List Documents_uploading">
                                        {this.state.show_customer_folder_name!='' ? 
                                        <button data-toggle="modal" data-target="#NewClientFormuploadCustomer" className="btn new_file_btn">
                                            העלת קובץ
                                            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder-plus"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /><line x1={12} y1={11} x2={12} y2={17} /><line x1={9} y1={14} x2={15} y2={14} /></svg>
                                        </button>
                                        :''}

                                        <div className="uploading_heading">
                                        {this.state.show_customer_folder_name!='' ? 
                                            <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-folder"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                                        :''}
                                            {this.state.show_customer_folder_name}
                                        </div>
                                        <ul>
                                        {this.state.customer_files && this.state.customer_files.length>0?
                                            this.state.customer_files.map((file, index) => {
                                                return (
                                                    <li key={index}>  
                                            
                                            <a>
                                                <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#06b4ff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1={16} y1={13} x2={8} y2={13} /><line x1={16} y1={17} x2={8} y2={17} /><polyline points="10 9 9 9 8 9" /></svg>
                                                {index+1} {file.file_name}
                                                <svg onClick={()=>{$('.Doc_ed'+file.id).toggle()}} xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx={12} cy={12} r={1} /><circle cx={12} cy={5} r={1} /><circle cx={12} cy={19} r={1} /></svg>
                                            </a>
                                            <div className={`Doc_edit2 Doc_ed${file.id}`}>
                                                <ul>
                                                <li> <a onClick={()=>{this.setState({rename_file:file.file_name, rename_file_id:file.id})}} data-toggle="modal" data-target="#renameFile"><img src={rename} alt="rename-icon.png" className="rename-icon" /> <img src={hoverrename} alt="hover-rename-icon.png" className="hover-rename-icon" /> שינוי שם </a></li>
                                                {/* <li><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg> עריכה  </a></li>*/}
                                                <li><a href={`/uploads/${file.file_path}`} download><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1={12} y1={15} x2={12} y2={3} /></svg> הורדה  </a></li> 
                                                <li><a onClick={this.onFileDelete.bind(this, file.id)}><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg> מחיקה </a></li>
                                                </ul>
                                            </div>
                                            </li>
                                            )}):''}
                                        </ul>
                                        </div>{/* Documents_List */}
                                    </div>

                                :''}



                                </div>
                                
                            </div>
                            <div className="GoNextPage">
                                <a onClick={this.showTab.bind(this, 4)} className="btn custom-btn"> הבא   <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-left"><polyline points="15 18 9 12 15 6" /></svg></a> {/* the next */}                  
                            </div>
                            </div>
                            :''}

                             {/* Modal */}
                            <div className="modal fade" id="renameFile" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalCenterTitle">תיקייה חדשה</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">

                                    <form id="formFile" onSubmit={this.renameFile.bind(this)}>
                                        <div className="ClientForm">                           
                                            <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group text-right">
                                                    <label>שם </label>
                                                    <div className="col-sm-4 col-md-3">
                                                    <input style={{width:'350px'}} value={this.state.rename_file} required className="form-control custom-input" type="text"   onChange={this.handleChanges} name="rename_file"/>
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
                           
                           {this.state.step ==4 ?
                            <div className="GoTab_Content Tab_content4">
                            <div className="row ">
                                <div className="col-sm-6">
                                <ul className="GoTemplateBlock">
                                    <li>
                                    בחר קבוצה
                                    </li>
                                    <li>                        
                                    <div className="form-group form-inline inline-content">
                                    <span className="selectDropdown">
                                        <select  value={this.state.user_group} onChange={this.getClientsByGroup.bind(this)} name="user_group">
                                            <option value=""> בחרו קבוצה</option>
                                            {this.state.groups && this.state.groups.length>0?
                                            this.state.groups.map((goup, index) => {
                                                return (
                                                    <option key={index} value={goup.id}> {goup.name}</option>
                                                )})
                                                :''}
                                            
                                            </select>
                                            <img src="/images/DropdownBase.png" alt="DropdownBase" className="DropdownBase" />
                                        </span>
                                    </div>
                                    </li>
                                </ul>
                                </div>
                                <div className="col-sm-6"> 
                                <div className="Template_Button">   
                                <Link to={`/managers/${btoa(this.state.manager_id)}/projects/${btoa(this.state.project_id)}/clients/add`} className="btn secondary_btn updated_btn ">
                                    הוספת מתעדכן <img src={user} className="user-icon" alt="user-icon" /><img src={userdark} className="user-icon-dark" alt="user-icon" /></Link>   {/* Adding updated */}   

                                    <button className="btn Upload_btn">
                                        העלה מאקסל  
                                        <img src={excel} className="excel-icon" alt="excel-icon" />
                                        <img src={exceldark} className="excel-icon-dark" alt="excel-icon" />
                                       

                                        {this.state.spinn?<i className="fa fa-spinner fa-spin" aria-hidden="true"></i>:
                                         <CsvParse
                                         keys={keys}
                                         onDataUploaded={this.handleData}
                                         onError={this.handleError}
                                         render={onChange => <input className="excelbtn" type="file" onChange={onChange} />}
                                         />
                                         }
                                        </button>


                                </div>
                                </div>
                            </div>              
                            <div className="table_block ExcelTable">
                                <div className="table-responsive">
                                <table className="table table-hover text-right">
                                    <thead>
                                    <tr>
                                        <th>   </th>
                                        <th> שם  </th>{/* Name */}
                                        <th> מייל </th>
                                        <th> נייד </th>
                                        <th> סטטוס </th>{/* status */}
                                        <th> חתם </th>
                                        <th> קבוצה</th>{/* Group */}
                                        <th>   </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.state.customers && this.state.customers.length>0 &&
                                    this.state.customers.map((customer, index) => {
                                        return (
                                            <tr key={index}> 
                                                <td>                      
                                                <div className="custom-control custom-checkbox">
                                                    <input type="checkbox" className="custom-control-input" id={`customCheck${index}`} name="example1" />
                                                    <label className="custom-control-label" htmlFor={`customCheck${index}`} />
                                                </div>
                                                </td> 
                                                <td>{customer.full_name}</td>
                                                <td><p className="rubik-Medium">{customer.email}</p></td>
                                                <td><p className="rubik-regular">{customer.mobile}</p></td>
                                                <td><span className="active-text"> {customer.customer_status}</span></td>

                                                <td>
                                                    {customer.customer_status=='חתם'?
                                                    <span className="active-text"><i className="fa fa-check" aria-hidden="true" /> </span>
                                                    :''}
                                                </td>
                                                <td>
                                                    {customer.group?
                                                    <button className="Group-btn" style={{background:customer.group.color}}>{customer.group.name}</button>
                                                    :''}
                                                </td>
                                                <td>
                                                <div className="ExcelTable_Edits"> 
                                                    <a onClick={() => { $('.Doc_ed'+customer.mobile).toggle()}} className="dropCustomer">                               
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx={12} cy={12} r={1} /><circle cx={12} cy={5} r={1} /><circle cx={12} cy={19} r={1} /></svg>
                                                    </a>
                                                    <div className={`Doc_edit2 Doc_ed${customer.mobile}`}>
                                                    <ul>
                                                        <li><Link to={`/managers/${btoa(this.state.manager_id)}/clients/edit/${btoa(customer.id)}`}><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg><font style={{verticalAlign: 'inherit'}}><font style={{verticalAlign: 'inherit'}}>עריכה</font></font></Link></li>

                                                        <li><a onClick={this.updateCustomer.bind(this,customer.id)} data-toggle="modal" data-target=".bd-example-modal-sm">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-users"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> שיוך לקבוצה </a></li>

                                                        <li  ><a data-toggle="modal" data-target="#deletePopup" onClick={()=>{this.setState({deleteMe:customer.id})}}><svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg> מחיקה </a></li>
                                                    </ul>
                                                    </div>
                                                </div>
                                                </td>
                                            </tr>   
                                        )
                                    })
                                    
                                    }
                                 </tbody>
                                 </table>                   
                                    <h5 className="foott">סה’’כ מתעדכנים: {this.state.customers.length}</h5>
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
                                        <button onClick={this.onDeleteCustomer.bind(this, this.state.deleteMe)} type="button" className="btn  add-btn">
                                            {this.state.spin?<i className="fa fa-spinner fa-spin" aria-hidden="true"></i>:''} מחק
                                        </button>
                                        
                                    </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div className="GoNextPage">
                                <a onClick={this.goBack.bind(this)} className="btn custom-btn"> שמירה</a> {/* the next */}                  
                            </div>
                            </div>
                            :''}
                            
                        </div>
                        </div>
                    </div>        
                </div>
                {/* Modal */}
                <div className="modal fade" ref={modal=> this.modal = modal} id="NewClientForm" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalCenterTitle">תיקייה חדשה</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">

                    <form onSubmit={this.submitFolder}>
                        <div className="ClientForm">                           
                            <div className="row">
                            <div className="col-sm-12">
                                <div className="form-group text-right">
                                    <label>שם </label>
                                    <input type="text" className="form-control custom-input" 
                                    value={this.state.folder_name}
                                    onChange={this.handleChanges}
                                    name="folder_name"
                                    />
                                </div>
                                </div>
                                
                            </div>                        
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn cancel-btn" data-dismiss="modal">ביטול</button>
                            <button type="submit" className="btn  add-btn">
                            {this.state.spinn?<i className="fa fa-spinner fa-spin" aria-hidden="true"></i>:''}שמירה</button>
                        </div>
                    </form>  
                    </div>
                    </div>
                </div>
                </div>
                
                {/* tab 4 User modal */}
                <div className="modal fade bd-example-modal-sm GroupAffiliation_Modal" tabIndex={-1} role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalCenterTitle">שיוך לקבוצה </h5>{/* Group affiliation */}
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group form-inline inline-content">
                        <label>בחרו קבוצה</label><br />
                        <span className="selectDropdown">
                        <select  value={this.state.user_group} onChange={this.handleChanges} name="user_group">
                            <option value=""> בחרו קבוצה</option>
                            {this.state.groups && this.state.groups.length>0?
                            this.state.groups.map((goup, index) => {
                                return (
                                    <option key={index} value={goup.id}> {goup.name}</option>
                                )})
                                :''}
                            
                            </select>
                            <img src="/images/DropdownBase.png" alt="DropdownBase" className="DropdownBase" />
                        </span>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn cancel-btn" data-dismiss="modal">ביטול</button>{/* cancel button */}
                        <button type="button" onClick={this.onCustomerUpdate.bind(this)} className="btn  add-btn">הוסף</button>{/* add button */}
                    </div>
                    </div>
                </div>
                </div>

                 {/* Modal NewClientFormuploadCustomer */}

                 <div className="modal fade" id="NewClientFormuploadCustomer" tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalCenterTitle">תיקייה חדשה</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body">

                    <form id="formFile" onSubmit={this.submitFileCustomer}>
                        <div className="ClientForm">                           
                            <div className="row">
                            <div className="col-sm-12">
                                <div className="form-group text-right">
                                    <label>שם </label>
                                    <div className="col-sm-4 col-md-3">
                                    <input style={{width:'350px'}} className="form-control custom-input" type="file" accept=".jpg, .jpeg, .png"  onChange={this.onFileUploadCustomer} />
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

            </div>
            
        );
    }
}

