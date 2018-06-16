import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import CheckinEntry from './CheckinEntry';
import moment from 'moment';
import OrderDetails from './OrderDetails';

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
    const users = [];
    _.map(this.props.users, v => {
      users.push(v);
    });

    const businesses = [];
    _.map(this.props.businessList, v => {
      businesses.push(v);
    });

    if (users.length == 0 || businesses.length == 0) {
      return (<h4 className='p-2'>No checkin data found.</h4>);
    }

    const filteredCheckins = this.filterCheckinData();
    const id = this.props.match.params.id

    if (id) {
      const checkin = this.checkins.filter(c => c.key == id)[0]
      return (
        <OrderDetails checkin={checkin} />
      )
    }

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
                  <th style={{ width: '15%' }} className='text-left align-middle small font-weight-bold'>User</th>
                  <th style={{ width: '15%' }} className='text-left align-middle small font-weight-bold'>Business</th>
                  <th style={{ width: '10%' }} className='text-left align-middle small font-weight-bold'>Total Order</th>
                  <th style={{ width: '15%' }} className='text-left align-middle small font-weight-bold'>Payment</th>
                  <th style={{ width: '15%' }} className='text-left align-middle small font-weight-bold'>
                      <span class='d-inline'>Checkin</span>
                      <button className='btn btn-link d-inline' onClick={this.sortCheckins}>
                        <i class="fas fa-sort-down">sort</i>
                      </button>
                  </th>
                  <th style={{ width: '15%' }} className='text-center align-middle small font-weight-bold'>Checkout</th>
                  <th style={{ width: '10%' }} className='text-center align-middle small font-weight-bold'>Duration (minutes)</th>
                  <th style={{ width: '10%' }} className='text-center align-middle small font-weight-bold'></th>
                </tr>
              </thead>
              <tbody>
                {filteredCheckins.length == 0 && <p class="text-danger">There are no checkins.</p>}
                {filteredCheckins.length > 0 && filteredCheckins.map((item, i) => (<CheckinEntry
                  key={item.key}
                  checkin={item}
                  index={i}
                  user={this.props.users[item.userKey]} />))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
};
