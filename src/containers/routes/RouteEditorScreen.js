import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class RouteEditorScreen extends Component {
  static propTypes = {
    routeList: PropTypes.object.isRequired,
    currentRouteKey: PropTypes.string.isRequired,
    businessList: PropTypes.object.isRequired,
  }

  removeBusiness = (business) => {
    this.props.removeBusinessFromRoute(business.name, this.props.currentRouteKey);
  }

  addBusiness = (business) => {
    this.props.addBusinessToRoute(business.name, this.props.currentRouteKey);
  }

  hideRouteEditor = () => {
   this.props.hideRouteEditor();
  }

  render() {
    let businessesInRoute = [];
    let businessInCurrentRoute = this.props.routeList[this.props.currentRouteKey].businesses;
    if (businessInCurrentRoute) {
      businessesInRoute = Object.keys(businessInCurrentRoute).map(key => {
        return this.props.businessList[key];
      });
    }
    let allBusinesses = Object.keys(this.props.businessList).map(key => {
      return this.props.businessList[key];
    });

    let currentRoute = this.props.routeList[this.props.currentRouteKey];
    return (
      <div>
        <p className='lead'>Businesses on route <strong>{currentRoute.name}</strong> 
          <button className="btn btn-link" onClick={this.hideRouteEditor}>hide</button>
        </p>
        
        <p className="small">Add or remove business from route</p>
        <div className='row'>
          <div className='col-md-5'>
            <div className='bg-light p-4'>
              <h6>Business in this route</h6>
              <hr/>
              <ol>
                {
                  businessesInRoute.length > 0 ?
                    businessesInRoute.map(item => (
                      <li key={item.name}>
                        {item.name}
                        &nbsp;<button className="btn btn-link" onClick={() => this.removeBusiness(item)}>Remove</button>
                      </li>))
                    : <p>No businesses under this route</p>
                }
              </ol>
            </div>
          </div>
          <div className='col-md-5'>
            <div className='bg-light p-4'>
              <h6>All Businesses</h6>
              <hr/>
              <ol>
                {
                  allBusinesses.map(item => (
                    <li key={item.name}>
                      {item.name}
                      &nbsp;<button className="btn btn-link" onClick={() => this.addBusiness(item)}>Add</button>
                    </li>
                  ))
                }
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
