import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import CheckinEntry from './CheckinEntry';
import moment from 'moment';

export default class CheckinScreen extends Component {
  ALL = 'ALL';

  static propTypes = {
    checkins: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    businessList: PropTypes.object.isRequired,
  }

  state = {
    sortAscending: true,
    filter: {
      userFilterKey: this.ALL,
      businessFilterKey: this.ALL,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setup();
  }

  setup = () => {
    const users = [];
    _.map(this.props.users, v => {
      users.push(v);
    });

    this.businesses = [];
    _.map(this.props.businessList, v => {
      this.businesses.push(v);
    });
    this.checkins = [];
    _.map(this.props.checkins, v => {
      this.checkins.push(v);
    });

    // this.setState({
    //   filteredCheckins: this.checkins
    // });
  }

  componentDidMount() {
    this.props._getUserList();
    this.props._getCheckins();
    this.props._getBusinessList();
  }

  handleUserFilter = (e) => {
    this.setState({
      filter: {
        userFilterKey: e.target.value,
        businessFilterKey: this.state.filter.businessFilterKey,
      }
    });
    console.log('setting state tp ' + e.target.value);
  }

  handleBusinessFilter = (e) => {
    this.setState({
      filter: {
        userFilterKey: this.state.filter.userFilterKey,
        businessFilterKey: e.target.value,
      }
    });
  }

  filterCheckinData = () => {
    if (!this.checkins || this.checkins.length == 0) {
      return [];
    }
    
    let filterCheckins = [...this.checkins];
    let userFilterKey = this.state.filter.userFilterKey;
    if (userFilterKey && userFilterKey != this.ALL) {
      filterCheckins = filterCheckins.filter(item => item.userKey === userFilterKey);
    }

    let businessFilterKey = this.state.filter.businessFilterKey;
    if (businessFilterKey && businessFilterKey != this.ALL) {
      filterCheckins = filterCheckins.filter(item => item.businessKey === businessFilterKey);
    }

    filterCheckins.sort((item1, item2) => {
      if (this.state.sortAscending) {
        return item1.timeCreated - item2.timeCreated;
      } else {
        return item2.timeCreated - item1.timeCreated;
      }
    });

    return filterCheckins;
  }

  sortCheckins = () => {
    this.setState({
      sortAscending: !this.state.sortAscending,
    });
  }

  render() {
    // filteredCheckins: filteredCheckins 
    console.log('render');
    const users = [];
    _.map(this.props.users, v => {
      users.push(v);
    });

    const businesses = [];
    _.map(this.props.businessList, v => {
      businesses.push(v);
    });

    if (users.length == 0 || businesses.length == 0) {
      return (<p>Wating...</p>);
    }

    const filteredCheckins = this.filterCheckinData();

    return (
      <div>
        <div className='row m-2 p-2 bgPrimaryDark'>
          <div className='col-md-2'>
            <p className='lead text-white'>filter users</p>
            <select class="custom-select custom-select-sm mb-3" onChange={this.handleUserFilter}>
              <option selected value={this.ALL}>ALL</option>
              {users.map(item => (<option key={item.key} value={item.key}>{item.firstname + ' ' + item.lastname}</option>))}
            </select>
          </div>
          <div className='col-md-2'>
            <p className='lead text-white'>filter businesses</p>
            <select class="custom-select custom-select-sm mb-3" onChange={this.handleBusinessFilter}>
              <option selected value={this.ALL}>ALL</option>
              {businesses.map(item => (<option key={item.name} value={item.name}>{item.name}</option>))}
            </select>
          </div>
        </div>
        <div className='row m-2'>
          <div className='col-md-12'>
            <p className='lead'>Checkins Page ({filteredCheckins.length})</p>
            <table className='table'>
              <thead>
                <tr className='p-2 bgPrimaryLight'>
                  <th className='w-10 text-center align-middle m-0 p-0'>User</th>
                  <th className='w-20 text-center align-middle m-0 p-0'>Business</th>
                  <th className='w-10 text-center align-middle m-0 p-0'>Total Order</th>
                  <th className='w-10 text-center align-middle m-0 p-0'>Payment</th>
                  <th className='w-20 text-center align-middle m-0 p-0'>
                    <span>Checkin Time
                    <button className='btn btn-link' onClick={this.sortCheckins}>
                      <i class="fas fa-sort-down">sort</i>
                    </button>
                    </span>
                  </th>
                  <th className='w-20 text-center align-middle m-0 p-0'>Checkout Time</th>
                  <th className='w-10 text-center align-middle m-0 p-0'>Duration (minutes)</th>
                </tr>
              </thead>
              <tbody>
                {filteredCheckins.map((item, i) => (<CheckinEntry
                  key={item.key}
                  checkin={item}
                  index={i}
                  user={this.props.users[item.userKey]}
                  businesses={this.props.businesses} />))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
};
