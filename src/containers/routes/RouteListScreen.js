import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MapContainer from '../mapcontainer';
import RouteEntry from './RouteEntry';
import Notification from '../notification';
import RouteEditorScreen from './RouteEditorScreen';

export default class RouteListScreen extends Component {
	DAYS = [
		'MONDAY',
		'TUESDAY',
		'WEDNESDAY',
		'THURSDAY',
		'FRIDAY',
		'SATURDAY'
	];

	state = {
		currentRoute: undefined,
		route: {},
	}

	static propTypes = {
		routeList: PropTypes.object.isRequired,
		businessList: PropTypes.object.isRequired,
		users: PropTypes.object.isRequired,
		_getRouteList: PropTypes.func.isRequired,
		_getUserList: PropTypes.func.isRequired,
	}

	componentDidMount() {
		this.props._getRouteList();
		this.props._getBusinessList();
		this.props._getUserList();
	}

	showRoute = (route) => {
		let businesses = {};
		if (!route.businesses || Object.keys(route.businesses).length == 0) {
			alert('No business associated with this route');
			return;
		}

		Object.keys(route.businesses).forEach(item => {
			businesses[item] = this.props.businessList[item];
		});
		this.refs.mapContainer.show(businesses);
	}

	clearMap = () => {
		this.refs.mapContainer.clear()
	}

	editRoute = (route) => {
		this.setState({
			currentRoute: route,
		});
	}

	createRoute = (e) => {
		e.preventDefault();

		if (!this.routeNameInput.value) {
			alert('Must provide a route name');
			return;
		}

		this.props._createRoute(this.routeNameInput.value);
	}

	hideRouteEditor = () => {
		this.setState({
			currentRoute : undefined
		});
	}

	render() {
		let routes = Object.keys(this.props.routeList).map(
			item => { return this.props.routeList[item]; }
		);

		let users = Object.keys(this.props.users).map(key => this.props.users[key]);

		return (
			<div>
				<Notification />
				<div className='row'>
					<div className='col-md-9'>
						<MapContainer ref="mapContainer"></MapContainer>
						<button onClick={this.clearMap} className="btn btn-link">Clear</button>
					</div>
					<div className='col-md-3'>
					<p className='lead'>Add Route Form</p>
					<form>
              <div class="form-group">
                <input ref={el => this.routeNameInput = el} type="text" class="form-control" placeholder="Route name..." />
              </div>
              <button onClick={this.createRoute} class="btn btn-block">Create Route</button>
            </form>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
						<table className="table">
							<thead>
								<tr className='bgPrimaryLight'>
									<th className='w-20 text-center'>Name</th>
									<th className='w-10 text-center'>Business</th>
									<th className='w-15 text-center'>Assignee</th>
									<th className='w-15 text-center'>Day</th>
									<th className='w-15 text-center'>Time Created</th>
									<th className='w-25 text-center'>Actions</th>
								</tr>
							</thead>
							<tbody>
								{routes.map(item => {
									let key = item.name.split(' ').join('_');
									return (<RouteEntry
										key={key}
										route={item}
										days={this.DAYS}
										users={users}
										editRoute={this.editRoute}
										showRoute={this.showRoute}
										updateRoute={this.props._updateRoute} />)
								})}
							</tbody>
						</table>
					</div>
				</div>

				<div className='row'>
					<div className='col-md-9 m-4'>
						{this.state.currentRoute &&
							<RouteEditorScreen
								routeList={this.props.routeList}
								currentRouteKey={this.state.currentRoute.name} 
								businessList={this.props.businessList} 
								addBusinessToRoute={this.props._addBusinessToRoute} 
								removeBusinessFromRoute={this.props._removeBusinessFromRoute} 
								hideRouteEditor = {this.hideRouteEditor}
								/>}
					</div>
				</div>
			</div>
		);
	}
};
