import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MaterialIcon from 'react-google-material-icons'

export default class RouteEntry extends Component {
  static propTypes = {
    route: PropTypes.object.isRequired,
    days: PropTypes.array.isRequired,
    users: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      dayOfWeek: props.route.assignment? props.route.assignment.dayOfWeek : 'NONE',
      assignee: props.route.assignment? props.route.assignment.assignee : 'NONE',
    }
  }

  edit = () => {
    this.props.editRoute(this.props.route);
  }

  remove = () => {
    this.props._remove(this.props.route.key);
  }

  save = () => {
    if (this.state.dayOfWeek === 'NONE') {
      alert('Must select a day');
      return;
    }

    if (this.state.assignee === 'NONE') {
      alert('Must select a assignee');
      return;
    }

    this.props.updateRoute(this.props.route.name, this.state.assignee, this.state.dayOfWeek);
  }

  handleDayChange = (e) => {
    this.setState({
      dayOfWeek: e.target.value
    });
  }

  handleAssignmentChange = (e) => {
    this.setState({
      assignee: e.target.value
    });
    console.log(e.target.value);
  }

  render() {
    const route = this.props.route;
    console.log(route);
    const { name } = route;
    const businessCount = route.businesses ? Object.keys(route.businesses).length : 0;
    
    console.log('assignee -> ' + this.state.assignee+" ," + this.state.dayOfWeek);

    return (
      <tr key={name}>
        <td className='w-20 text-center'>{name}</td>
        <td className='w-10 text-center'>{businessCount}</td>
        <td className='w-15 text-center'>{
          <select onChange={this.handleAssignmentChange} ref={this.assignmentInput} value={this.state.assignee} className='custom-select'>
            <option key='NONE' value='NONE'>None</option>
            {this.props.users.map((item, index) => (
              <option key={item.key} value={item.key}>{item.firstname + ' ' + item.lastname}</option>
            ))}
          </select>
        }</td>
        <td className='w-15 text-center'>
          <select onChange={this.handleDayChange} ref={this.dayInput} value={this.state.dayOfWeek} className='custom-select'> 
            <option key='NONE' value='NONE'>None</option>
            {this.props.days.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </td>
        <td className='w-15 text-center'>
          {new Date(route.timeCreated).toLocaleString('en-US')}
        </td>
        <td className='w-25 text-center'>
          <button class="btn btn-link" onClick={this.edit}>
            <MaterialIcon icon="mode_edit" size={24} />
          </button>
          <button class="btn btn-link" onClick={this.save}>
            <MaterialIcon icon="save" size={24} />
          </button>
          <button class="btn btn-link" onClick={() => this.props.showRoute(this.props.route)}>
            <MaterialIcon icon="place" size={24} />
          </button>
          <button class="btn btn-link" onClick={this.remove}>
            <MaterialIcon icon="delete" size={24} />
          </button>
        </td>
      </tr>
    )
  }
};
