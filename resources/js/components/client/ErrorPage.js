import React, { Component } from 'react';

export default class ErrorPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user:{}
        }

        this.getClientData = this.getClientData.bind(this);
        this.logout = this.logout.bind(this);
    }

    logout() {
      axios.post(serverUrl+'api/auth/logout')
      .then(response => {
          location.reload()
      }).catch(error => {
          console.log('here',error)
      });
  }

    getClientData() {
        axios.post(serverUrl+'api/auth/user')
            .then(response => {
                this.setState({
                    user: response.data.user_info,
                });

            }).catch(error => {
                console.log('here',error)
            });
    }

    async componentDidMount() {
      await this.getClientData()
    }

    render() {
        return (
            <div className="">
                     <div>
                     <section className="accountSec">
          <div className="header d-flex justify-content-center align-items-center">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-4 col-xl-4 col-lg-3 text-right acc-text">
                  <a href="#" className="mobile-div email-link"><i className="fa fa-envelope-o" aria-hidden="true" /></a>
              <p className="mobile-div">{this.state.user.name}</p>
                </div>
                <div className="col-8 col-xl-4 col-lg-6 text-center">
                <img src="/images/accReactive-logo.png" alt="accReactive-logo" className="img-fluid"/>
                <img src="/images/accReactive-logo2.png" alt="accReactive-logo" className="img-fluid"></img>
                </div>
                <div className="col-xl-3 col-lg-2  text-right acc-text">
                  <p className="webview-div">{this.state.user.name}</p>
                </div>
                <div className="col-xl-1 col-lg-1  text-right acc-text">
                  <p className="webview-div" onClick={this.logout} >Logout</p>
                </div>
              </div>
            </div>
          </div>
        </section>
  {/* content-section */}
  <section className="inactiveAcc-part">
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-10 col-12 text-center">
          <div className="box">
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={152} height={136} viewBox="0 0 152 136">
              <image id="Vector_Smart_Object" data-name="Vector Smart Object" width={152} height={136} xlinkHref="data:img/png;base64,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" />
            </svg>
            <p> חשבון החברה אינו פעיל כרגע. אתכם סליחה  </p>
            <p>אנא צרו קשר עם מנהל הפרוייקט או נסו במועד מאוחר יותר</p>
          </div>
          <img src="/images/logo-black.png" alt="logo-black" className="img-fluid mb-4" />
        </div>
      </div>
    </div>
  </section>
</div>

                </div>

        );
    }
}

