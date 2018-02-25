import React, { Component } from 'react';
import PropTypes from 'prop-types';
import UserEntry from './UserEntry';
import { validateEmail } from '../../common/util';
import Notification from '../notification';

export default class UserListScreen extends Component {
  static propTypes = {
    users: PropTypes.object.isRequired,
    routeList: PropTypes.object.isRequired,
  }

  ROLES = [
    {
      name: 'sales',
      title: 'Sales',
    },
    {
      name: 'admin',
      title: 'Administrator'
    }
  ]

  componentDidMount = () => {
    this.props._getUserList();
    this.props._getRouteList();
  };
  
  createUser = (e) => {
    e.preventDefault();

    let firstname = this.firstnameInput.value;
    let lastname = this.lastnameInput.value;
    let email = this.emailInput.value;
    let role = this.roleInput.value;

    if (!firstname || !lastname || !email || !role) {
      alert('Must provide all information for creating user');
      return;
    }

    if (!validateEmail(email)) {
      alert(`Must provide valid email ${email}`);
      return;
    }

    this.props._createUser(firstname, lastname, email, role);

  }

  render() {
    let assignedUsers = {};

    Object.keys(this.props.routeList).forEach(key => {
      let route = this.props.routeList[key];
      if (route.assignment && route.assignment.assignee) {
        assignedUsers[route.assignment.assignee] = true;
      }
    });

    return (
      <div className='row'>
        <div className='col-md-9'>
          <Notification />
          <table className='table'>
            <thead>
              <tr className='bgPrimaryLight'>
                <th className='w-10'>Firstname</th>
                <th className='w-10'>Lastname</th>
                <th className='w-20'>Email</th>
                <th className='w-10'>Role</th>
                <th className='w-10'>Assigned</th>
                <th className='w-40'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                Object.keys(this.props.users).map(key => {
                  return (<UserEntry user={this.props.users[key]} 
                    removeUser={this.props._removeUser}
                    assignedUsers={assignedUsers} />)
                })
              }
            </tbody>
          </table>
        </div>
        <div className='col-md-3'>
          <p className='lead'>Create user form</p>
          <form>
            <div className="form-group">
              <input ref={el => this.firstnameInput = el} type="text" className="form-control" placeholder="Firstname..." />
            </div>
            <div className="form-group">
              <input ref={el => this.lastnameInput = el} type="text" className="form-control" placeholder="Lastname..." />
            </div>
            <div className="form-group">
              <input ref={el => this.emailInput = el} type="text" className="form-control" placeholder="email..." />
            </div>
            <div className="form-group">
              <select ref={ref => this.roleInput = ref}>
                { this.ROLES.map(item => {
                  return (<option value={item.name}>{item.title}</option>)
                })}
              </select>
            </div>
            <button onClick={this.createUser} class="btn btn-block">Create User</button>
          </form>
        </div>
      </div>
    )
  }
};
