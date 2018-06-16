import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { fprice } from '../../common/util'
import _ from 'lodash'
import {
  Link,
} from 'react-router-dom';
import moment from 'moment'

class Item extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  }

  render() {
    return (
      <div class='row'>
        <span class='col-md-2 text-left text-secondary'>{this.props.name}</span>
        <span class='col-md-2 text-left'>{this.props.quantity}</span>
      </div>
    )
  }
}

export default class OrderDetails extends Component {
  static propTypes = {
    checkin: PropTypes.object.isRequired,
  }

  render() {
    const c = this.props.checkin
    console.log(c)
    if (!c.order) {
      return (
        <div>
          <h4>There are no orders for this checkin</h4>
        </div>
      )
    }

    let orderedItems = []
    if (c.order) {
      orderedItems = _.pickBy(c.order.items, (v, k) => v > 0)
    }

    return (
      <div>
        <h5 class='text-dark'>Checkin Details</h5>
        <ul class='list-unstyled'>
          <li class='row'>
            <span class="col-md-2 text-secondary text-left">Business Name</span>&nbsp;&nbsp;
              <span class='col-md-2 text-left'>{c.businessKey}</span>
          </li>
          <li class='row'>
            <span class="col-md-2 text-secondary text-left">Checkin Time</span>&nbsp;&nbsp;
              <span class='col-md-2 text-left'>{moment(c.timeCreated).format('DD/MM/YY hh:mm')}</span>
          </li>
          <li class='row'>
            <span class="col-md-2 text-secondary text-left">Checkout Time</span>&nbsp;&nbsp;
              <span class='col-md-2 text-left'>{moment(c.timeCompleted).format('DD/MM/YY hh:mm')}</span>
          </li>
        </ul>
        <h5 class='text-dark'>Order Details</h5>
        <ul class='list-unstyled'>
          <li class='row'>
            <span class="col-md-2 text-secondary text-left">Gross Amount</span>&nbsp;&nbsp;
              <span class='col-md-2 text-left'>{fprice(c.order.gross)}</span>
          </li>
          <li class='row'>
            <span class="col-md-2 text-secondary text-left">Tax</span>&nbsp;&nbsp;
              <span class='col-md-2 text-left'>{fprice(c.order.total - c.order.gross)}</span>
          </li>
          <li class='row'>
            <span class="col-md-2 text-secondary text-left">Total Amount</span>&nbsp;&nbsp;
              <span class='col-md-2 text-left'>{fprice(c.order.total)}</span>
          </li>
        </ul>

        <h5 class='text-dark'>Purchased Items</h5>
        <ul class='list-unstyled'>
          {Object.keys(orderedItems).length == 0 && <div>No items under this order</div>}
          {_.map(orderedItems, (v, k) => <Item key={k} name={k} quantity={v} />)}
        </ul>

        <Link to="/checkins">Back</Link>
      </div>
    )
  }
};
