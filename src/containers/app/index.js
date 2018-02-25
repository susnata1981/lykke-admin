import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../home';
import {
  Route,
  Link,
  Switch,
} from 'react-router-dom';
import Home from '../home';
import Users from '../users';
import Businesses from '../businesses';
import Login from '../login';
import Routes from '../routes';
import ItemMaster from '../itemmaster';
import Checkins from '../checkins';
import ProtectedComponent from './ProtectedComponent';
import { logout } from '../../modules/action';

const SideNav = (props) => {
  return (
    <nav>
      <div class="sidebar-sticky my-4">
        <ul class="nav flex-column">
          <li class="nav-item accent p-2 my-2">
            <Link class="nav-link active" to="/">
              Dashboard
            </Link>
          </li>
          <li class="nav-item accent p-2 my-2">
            <Link class="nav-link" to="/businesses">
              Businesses
                  </Link>
          </li>
          <li class="nav-item accent p-2 my-2">
            <Link class="nav-link" to="/routes">
              Routes
                  </Link>
          </li>
          <li class="nav-item accent p-2 my-2">
            <Link class="nav-link" to="/itemmaster">
              ItemMaster
                  </Link>
          </li>
          <li class="nav-item accent p-2 my-2">
            <Link class="nav-link" to="/checkins">
              Checkins
            </Link>
          </li>
          <li class="nav-item accent p-2 my-2">
            <Link class="nav-link" to="/users">
              Users
                  </Link>
          </li>
          {props.user.email && <li class="nav-item accent p-2 my-2">
            <button className="btn btn-link" onClick={() => props._logout()}>Logout</button>
          </li>
          }
        </ul>
      </div>
    </nav>
  )
}

const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = dispatch => {
  return {
    _logout: () => dispatch(logout()),
  }
}

const StateAwareSideNav = connect(mapStateToProps, mapDispatchToProps)(SideNav);

class App extends Component {

  render() {
    return (
      <div class="container-fluid">
        <div class="row">
          <div className="col-md-2 d-none d-md-block sidebar">
            <StateAwareSideNav />
          </div>

          <main role="main" class="col-md-9 my-4">
            <Switch>
              <ProtectedComponent exact path="/" component={Home} />
              <ProtectedComponent exact path="/businesses" component={Businesses} />
              <ProtectedComponent exact path="/routes" component={Routes} />
              <ProtectedComponent exact path="/itemmaster" component={ItemMaster} />
              <ProtectedComponent exact path="/checkins" component={Checkins} />
              <ProtectedComponent exact path="/users" component={Users} />
              <Route exact path="/login" component={Login} />
              <ProtectedComponent path="*" component={Home} />
            </Switch>
          </main>
        </div>
      </div>
    )
  }
}

export default App;
