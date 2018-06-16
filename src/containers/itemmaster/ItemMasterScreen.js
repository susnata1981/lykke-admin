import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ItemMasterEntry from './ItemMasterEntry';
import { isNumber } from '../../common/util';
import Notification from '../notification';
import {APP_CONFIG} from '../../config'

export default class ItemMasterScreen extends Component {
  static propTypes = {
    items: PropTypes.object.isRequired,
    _getItems: PropTypes.func.isRequired,
    _createItem: PropTypes.func.isRequired,
    _removeItem: PropTypes.func.isRequired,
  }

  componentDidMount() {
    this.props._getItems();
  }

  createItem = (e) => {
    e.preventDefault();

    let itemName = this.itemNameInput.value;
    let price = parseFloat(this.itemPriceInput.value);
    let quantity = parseInt(this.itemQuanityInput.value);

    if (!itemName) {
      alert('Must provide an item name');
      return;
    }

    if (!isNumber(price) || !isNumber(quantity)) {
      alert('Must provide valid price & quantity');
      return;
    }

    this.props._createItem(itemName, price, quantity);
    this.itemNameInput.value = '';
    this.itemPriceInput.value = '';
    this.itemQuanityInput.value = '';
  }

  render() {
    const items = Object.keys(this.props.items).map(key => {
      return this.props.items[key];
    });

    const taxHeader = `Taxc(${APP_CONFIG.tax * 100}%)`;
    return (
      <div className='row'>
        <div className='col-md-9'>
          <Notification />

          <table className='table table-bordered'>
            <thead>
              <tr className='bgPrimaryLight'>
                <th className='w-15'>Name</th>
                <th className='w-15'>Base Price</th>
                <th className='w-15'>{taxHeader}</th>
                <th className='w-15'>Final Price</th>
                <th className='w-10'>Quantiy</th>
                <th className='w-30'>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                return (<ItemMasterEntry
                  key={item.name}
                  item={item}
                  removeItem={this.props._removeItem}
                  updateItem={this.props._updateItem} />)
              })}
            </tbody>
          </table>
        </div>
        <div className='col-md-3'>
          <p className='lead'>Create item form</p>
          <form>
            <div class="form-group">
              <input ref={el => this.itemNameInput = el} type="text" class="form-control" placeholder="item name..." />
            </div>
            <div class="form-group">
              <input ref={el => this.itemPriceInput = el} type="text" class="form-control" placeholder="price..." />
            </div>
            <div class="form-group">
              <input ref={el => this.itemQuanityInput = el} type="text" class="form-control" placeholder="quantity..." />
            </div>
            <button onClick={this.createItem} class="btn btn-block">Create Item</button>
          </form>
        </div>
      </div>
    )
  }
};
