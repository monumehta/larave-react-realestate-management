import React, { Component } from 'react';

export default class Dashboard extends Component {

    async componentDidMount() {
        window.page = 'dashboard'
        
    }

    render() {
        return (
            <div className="dashboard_content_block_Main">
            <header>
            </header>
            <div className="dashboard_Table_block">
            <div className="container">
                <div className="row align-items-end">
                    <div className="col-sm-6">
                    <div className="Customers-title text-right">
                        <h5> דאשבורד</h5>{/* Dashboard */}
                    </div>
                    </div>
                    <div className="col-sm-6">
                    </div>
                </div>
                <div className="row ">
                    <div className="col-sm-6">
                    <ul className="GoTemplateBlock Select_project_block">
                        <li>                        
                        <div className="form-group form-inline inline-content">
                            <span className="Select_project">בחר פרוייקט </span>
                            <span className="selectDropdown">
                            <select>
                                <option>נוף ציון</option>
                                <option>נוף ציון</option>
                            </select>
                            <img src="images/DropdownBase.png" alt="DropdownBase" className="DropdownBase" />
                            </span>
                        </div>
                        </li>
                    </ul>
                    </div>
                    <div className="col-sm-6">
                    </div>
                    <div className="col-sm-7">
                    <div className="table_block TemplateTable ">
                        <div className="table-responsive">
                        <table className="table text-right table-border fixed_header">
                            <thead>
                            <tr>
                                <th>בניין</th>
                                <th> חתם </th>
                                <th> חתם חלקית</th>
                                <th> בתהליך</th>
                                <th> סרבן </th>
                                <th> מדינה </th>
                                <th>  סה”כ</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td><p className="rubik-medium"> פנחס ספיר 10,12,14</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 55</p></td>
                            </tr> 
                            <tr>
                                <td><p className="rubik-medium"> פנחס ספיר 10,12,14</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 55</p></td>
                            </tr> 
                            <tr>
                                <td><p className="rubik-medium"> פנחס ספיר 10,12,14</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 55</p></td>
                            </tr> 
                            <tr>
                                <td><p className="rubik-medium"> פנחס ספיר 10,12,14</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 55</p></td>
                            </tr> 
                            <tr>
                                <td><p className="rubik-medium"> פנחס ספיר 10,12,14</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 55</p></td>
                            </tr> 
                            <tr>
                                <td><p className="rubik-medium"> פנחס ספיר 10,12,14</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 55</p></td>
                            </tr> 
                            <tr>
                                <td><p className="rubik-medium"> פנחס ספיר 10,12,14</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 55</p></td>
                            </tr> 
                            </tbody>
                            <tfoot>                      
                            <tr>
                                <td> סה’’כ: </td>
                                <td> 35</td>
                                <td> 35</td>
                                <td> 58</td>
                                <td> 43</td>
                                <td> 14</td>
                                <td> </td>
                            </tr> 
                            </tfoot>
                        </table>
                        </div>
                    </div>
                    </div>
                    <div className="col-sm-5">
                    <div className="tab-box Owner_status">
                        <h5>סטטוס בעלים</h5>
                        <figure className="dashboard-meter text-center">
                        <img src="images/dashboard-meter.png" alt="dashboard-meter.png" />
                        </figure>
                    </div>
                    <div className="tab-box Owner_status">
                        <h5>טבלה מסכמת לכל הפרויקטים</h5>
                        <div className="table_block TemplateTable ">
                        <div className="table-responsive">
                            <table className="table text-right table-border fixed_header">
                            <thead>
                                <tr>
                                <th> פרויקטים  </th>
                                <th>  יחידות </th>
                                <th>   חתם</th>
                                <th> חתם חלקית  </th>
                                <th>  בתהליך </th>
                                <th>  סרבן </th>
                                <th> מדינה</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td><p className="rubik-medium"> 20</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 55</p></td>
                                </tr> 
                                <tr>
                                <td><p className="rubik-medium"> 20 </p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 2</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 3</p></td>
                                <td><p className="rubik-regular"> 55</p></td>
                                </tr> 
                            </tbody>
                            </table>
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
