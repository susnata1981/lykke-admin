import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BusinessEntry from './BusinessEntry';
import Notification from '../notification';
import { isNumber } from '../../common/util';
import MapContainer from '../mapcontainer';
import '../../styles/main.scss';

export default class BusinessListScreen extends Component {
  COUNTRY_CODE = 'IN';
  markers = [];

  static propTypes = {
    businessList: PropTypes.object.isRequired,
    _getBusinessList: PropTypes.func.isRequired,
  }

  state = {
    formattedPlace: undefined,
    placeId: undefined,
    placeLocation: undefined,
    lat: undefined,
    lng: undefined,
  }

  componentDidMount() {
    console.log('Businesses component mounted');
    this.props._getBusinessList();
  }

  showOnMap = (lat, lng, address, placeId) => {
    this.refs.mapContainer.showOnMap(lat, lng, address, placeId);
  }

  resetState = () => {
    this.setState({
      businessName: undefined,
      place_formatted: undefined,
      place_id: undefined,
      place_location: undefined,
    });
  }

  clearFormFields = () => {
    this.businessNameInput.value = '';
    this.addressInput.value = '';
    this.outstandingBalanceInput.value = '';
  }

  createBusiness = (e) => {
    e.preventDefault();

    const businessName = this.businessNameInput.value;
    if (!businessName) {
      alert('Must provider a business name');
      return;
    }

    if (!this.state.formattedPlace || !(this.state.lat && this.state.lng)) {
      alert('Must provide an address');
      return;
    }

    let outstandBalance = this.outstandingBalanceInput.value;
    if (!isNumber(outstandBalance)) {
      alert('Must provide a valid outstanding balance ' + outstandBalance);
      return;
    }

    this.props._createBusiness(businessName, outstandBalance, this.state.formattedPlace, this.state.placeId, this.state.lat, this.state.lng);
    this.resetState();
    this.clearFormFields();
  }

  onPlaceChanged = ({ formattedPlace, lat, lng, placeId, placeLocation }) => {
    this.setState({
      formattedPlace: formattedPlace,
      lat: lat,
      lng: lng,
      placeId: placeId,
      placeLocation: placeLocation
    });
  }

  render() {
    return (
      <div>
        <Notification />
        <div class="row">
          <div class="col-md-9">
            <MapContainer
              autocompleteNodeId="address"
              onPlaceChanged={this.onPlaceChanged}
              ref="mapContainer" />
          </div>
          <div class="col-md-3">
            <p className='lead'>Add Business Form</p>
            <form>
              <div class="form-group">
                <input ref={el => this.businessNameInput = el} type="text" class="form-control" placeholder="Business name..." />
              </div>
              <div class="form-group">
                <input ref={el => this.addressInput = el} type="text" class="form-control" id="address" placeholder="Address..." />
              </div>
              <div class="form-group">
                <input ref={el => this.outstandingBalanceInput = el} type="text" class="form-control" placeholder="Outstanding Balance..." />
              </div>
              <button onClick={this.createBusiness} className="btn btn-block">Create Business</button>
            </form>
          </div>
        </div>
        <h3>Business List</h3>

        <table className="table table-bordered table-sm">
          <thead>
            <tr className="m-0 bgPrimaryLight p-2">
              <th class="w-15">Name</th>
              <th class="w-25">Address</th>
              <th class="w-10">Outstanding Balanace</th>
              <th class="w-50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(this.props.businessList).map(
              item => (<BusinessEntry
                key={item}
                business={this.props.businessList[item]}
                removeBusiness={this.props._removeBusiness}
                updateOutstandingBalance={this.props._updateOutstandingBalance}
                showOnMap={this.showOnMap} />)
            )}
          </tbody>
        </table>
      </div>
    )
  }
}
