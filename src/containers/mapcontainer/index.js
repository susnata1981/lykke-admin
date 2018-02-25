import React, { Component } from 'react';
// import { Map, InfoWindow, Marker } from 'google-maps-react';
import PropTypes from 'prop-types';

export default class MapContainer extends Component {
  COUNTRY_CODE = 'IN';
  markers = [];

  static propTypes = {
    autocompleteNodeId: PropTypes.string,
    onPlaceChanged: PropTypes.func,
  }

  initMap = () => {
    this.map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: 22.5266317, lng: 88.3519158 },
      zoom: 13,
      mapTypeId: 'roadmap',
    });

    this.infowindow = new window.google.maps.InfoWindow();
    this.infowindowContent = document.getElementById('infowindow-content');
    this.infowindow.setContent(this.infowindowContent);

    // initialize the autocomplete functionality using the #pac-input input box
    if (this.props.autocompleteNodeId) {
      let inputNode = document.getElementById(this.props.autocompleteNodeId);
      this.autocomplete = new window.google.maps.places.Autocomplete(inputNode);

      this.autocomplete.setComponentRestrictions(
        { 'country': [this.COUNTRY_CODE] });

      this.autocomplete.addListener('place_changed', () => {
        console.log('place change....');
        // this.marker.setVisible(false);
        let place = this.autocomplete.getPlace();
        let location = place.geometry.location;
        this.props.onPlaceChanged({
          formattedPlace: place.formatted_address,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          placeId: place.place_id,
          placeLocation: location.toString(),
        });

        // bring the selected place in view on the map
        this.map.fitBounds(place.geometry.viewport);
        this.map.setCenter(location);

        this.showOnMap(
          place.geometry.location.lat(),
          place.geometry.location.lng(),
          place.formatted_address,
          place.place_id);

        // this.infowindowContent.children['place-address'].textContent = place.formatted_address;
        // this.infowindow.open(this.map, this.marker);
      });
    }
  }

  componentDidMount() {
    window.initMap = this.initMap;
    this.loadJS('https://maps.googleapis.com/maps/api/js?key=AIzaSyCMfCSDvfdv4v-PJSMJK6CLTukTCxgEfP4&libraries=places');
  }

  loadJS = (src) => {
    const ref = window.document.getElementsByTagName('script')[0];
    const script = window.document.createElement('script');
    script.src = src;
    script.async = true;
    window.initMap = this.initMap
    document.body.appendChild(script);
    script.onload = this.initMap;
  }

  showOnMap = (lat, lng, address, placeId) => {
    let center = { lat: lat, lng: lng };
    let marker = new window.google.maps.Marker({
      map: this.map,
      center: { lat: lat, lng: lng },
    });
    marker.setPlace({
      placeId: placeId || 'id',
      location: center,
    });
    
    marker.addListener('click', () => this.handleMarkerClick(marker, address));
    this.markers.push(marker);
  }

  handleMarkerClick = (marker, address) => {
    this.map.setCenter(marker.getPosition());
    this.infowindowContent.children['place-address'].textContent = address
    this.infowindow.open(this.map, marker);
  }

  show = (businesses) => {
    if (!businesses || Object.keys(businesses).length == 0) {
      alert('Must provide businesses for mapping');
      return;
    }

    this.clear();
    Object.keys(businesses).forEach(key => {
      const item = businesses[key];
      this.showOnMap(item.lat, item.lng, item.address, item.placeId);
    });
  }

  clear = () => {
    this.markers.map(marker => {
      marker.setMap(null);
    });
    this.markers.length = 0;
  }

  render() {
    return (
      <div>
        <div id="map" style={map}></div>
        <div id="infowindow-content">
          <span id="place-name" class="title"></span><br />
          <span id="place-address"></span>
        </div>
      </div>
    );
  }

}

const map = {
  height: 500,
}
