import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {duration_minutes, fprice} from '../../common/util'
import {
  Link,
} from 'react-router-dom';
const NA = "Not Available"
export default class CheckinEntry extends Component {

  static propTypes = {
    checkin: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  }

  format_order = (checkin) => {
    if (!checkin.order) {
      return NA
    }
    return fprice(checkin.order.total)
  }

  format_payment = (checkin) => {
    if (!checkin.payment) {
      return NA
    }
    return fprice(checkin.payment.amount)
  }

  render() {
    const user = this.props.user;
    const checkin = this.props.checkin;
    const duration = duration_minutes(checkin.timeCompleted, checkin.timeCreated)
    const orderLink = `/checkins/${checkin.key}`

    return (
      <tr scope='row'>
        <td className='text-left small'>{user.firstname + ' ' + user.lastname}</td>
        <td className='text-left small'>{checkin.businessKey}</td>
        <td className='text-left small'>{this.format_order(checkin)}</td>
        <td className='text-left small'>{this.format_payment(checkin)}</td>
        <td className='text-left small'>{moment(checkin.timeCreated).format('DD/MM/YY hh:mm')}</td>
        <td className='text-left small'>{moment(checkin.timeCompleted).format('DD/MM/YY hh:mm A')}</td>
        <td className='text-left small'>{duration}</td>
      <td>{checkin.order && <Link to={`${orderLink}`}><span class='small'>View Order</span></Link>}</td>
      </tr>
    )
  }
};
