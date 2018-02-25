import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default class CheckinEntry extends Component {
  static propTypes = {
    checkin: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    businesses: PropTypes.object.businesses,
  }

  render() {
    const user = this.props.user;
    const checkin = this.props.checkin;
    const duration = moment(checkin.timeCompleted).diff(moment(checkin.timeCreated), 'minutes');
    return (
      <tr>
        <td className='w-10 text-center'>{user.firstname + ' ' + user.lastname}</td>
        <td className='w-20 text-center'>{checkin.businessKey}</td>
        <td className='w-10 text-center'>{checkin.order.total}</td>
        <td className='w-10 text-center'>{checkin.payment.amount}</td>
        <td className='w-20 text-center'>{moment(checkin.timeCreated).format('DD/MM/YY hh:mm')}</td>
        <td className='w-20 text-center'>{moment(checkin.timeCompleted).format('DD/MM/YY hh:mm A')}</td>
        <td className='w-10 text-center'>{duration}</td>
      </tr>
    )
  }
};
