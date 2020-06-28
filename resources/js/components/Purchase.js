import React, { Component } from 'react';

export default class Purchase extends Component {
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
            emails:null,
            company_logo:null,
            status:null,
            manager_id: atob(this.props.match.params.id),
        }

        this.getClientData = this.getClientData.bind(this);
    }

    getClientData() {
        axios.post(serverUrl+'api/auth/user')
            .then(response => {
                this.setState({
                    user: response.data.user_info,
                });

                axios.post(serverUrl+'api/client/show/' + this.state.manager_id)
                .then(response => {
                    console.log(response)
                    
                    this.setState({
                        company_name : response.data.data.client.company_name,
                        full_name : response.data.data.client.full_name,
                        company_phone1 : response.data.data.client.company_phone1,
                        company_email : response.data.data.client.company_email,
                        company_package : response.data.data.client.company_package,
                        total_free : response.data.data.client.total_free,
                        emails:  response.data.data.client.emails!== null ?JSON.parse(response.data.data.client.emails):[{email:''}],
                        company_logo: response.data.data.client.company_logo,
                        status:response.data.data.client.status,
                    })
                });

            }).catch(error => {
                console.log('here',error)
            });
    }

    async choose(company_package) {
      const client = {
          company_name: this.state.company_name,
          full_name: this.state.full_name,
          company_phone: this.state.company_phone1,
          company_email: this.state.company_email,
          company_package: company_package,
          total_free: this.state.total_free,
          emails: JSON.stringify(this.state.emails),
          company_logo:this.state.company_logo,
          status:this.state.status
      }
      await axios.post(serverUrl+'api/client/update/'+ this.state.manager_id, client)
      this.setState({
        company_package : company_package
      })

    }

   async componentDidMount() {
        await this.getClientData()

       
    }

    render() {
        return (
            <div className="dashboard_content_block_Main">
                <div>
  <header>
  </header>
  <div className="dash_cont_block_inner">
    {/* Choose a route that best suits you */}
    <div className="heading_Title text-center"><h2>תבחר מסלול שהכי יתאים לך</h2></div>
    <div className="container container-1170">
      <div className="row">
        <div className="col-sm-3">
          <div className="Plan_size_block ">
            <figure>
              <img src="/images/small.png" alt="sizes image" />                  
            </figure>
            <h3 className="text-uppercase"> Small</h3>
            <ul>
              <li> פרוייקטים  <span>ללא הגבלה</span> </li>
              <li> מתעדכנים  <span>500</span> </li>
            </ul>
            <h4>  ₪700<span>לחודש </span></h4>
            {this.state.company_package==1?
            <button className="price_btn btn custom-btn"><i className="fa fa-check" /></button>
            :<button onClick={this.choose.bind(this,1)} className="price_btn btn custom-btn">בחירה  <span className="btn_check"><i className="fa fa-check" /></span></button> }
          </div>
        </div>
        <div className="col-sm-3">
          <div className="Plan_size_block ">
            <figure>
              <img src="/images/medium.png" alt="sizes image" />                  
            </figure>
            <h3 className="text-uppercase"> medium</h3>
            <ul>
              <li>פרוייקטים  <span>ללא הגבלה</span></li>
              <li> מתעדכנים  <span>1000</span></li>
            </ul>
            <h4>₪900<span>לחודש </span></h4>
            {this.state.company_package==2?
            <button className="price_btn btn custom-btn"><i className="fa fa-check" /></button>
            :<button onClick={this.choose.bind(this,2)} className="price_btn btn custom-btn">בחירה  <span className="btn_check"><i className="fa fa-check" /></span></button> }
          </div>
        </div>
        <div className="col-sm-3">
          <div className="Plan_size_block">
            <figure>
              <img src="/images/large.png" alt="sizes image" />                  
            </figure>
            <h3 className="text-uppercase"> large</h3>
            <ul>
              <li>פרוייקטים <span>ללא הגבלה</span></li>
              <li> מתעדכנים <span> 2000</span></li>
            </ul>
            <h4>₪1500<span>לחודש</span></h4>
            {/*  */}
            {this.state.company_package==3?
            <button className="price_btn btn custom-btn"><i className="fa fa-check" /></button>
            :<button onClick={this.choose.bind(this,3)} className="price_btn btn custom-btn">בחירה  <span className="btn_check"><i className="fa fa-check" /></span></button> }
          </div>
        </div>
        <div className="col-sm-3">
          <div className="Plan_size_block">
            <figure>
              <img src="/images/xl.png" alt="sizes image" />                  
            </figure>
            <h3 className="text-uppercase">xl </h3>
            <ul>
              <li>פרוייקטים <span>ללא הגבלה</span></li>
              <li>מתעדכנים <span>3000</span></li>
            </ul>
            <h4>₪2000 <span>לחודש</span></h4>
            {this.state.company_package==4?
            <button className="price_btn btn custom-btn"><i className="fa fa-check" /></button>
            :<button onClick={this.choose.bind(this,4)} className="price_btn btn custom-btn">בחירה  <span className="btn_check"><i className="fa fa-check" /></span></button> }
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

