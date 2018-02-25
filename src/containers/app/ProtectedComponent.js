import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types';
import Login from '../login';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";

const ProtectedComponent = ({ component: Component, user, ...rest }) => {
  console.log(`protected component ${JSON.stringify(user)} ${JSON.stringify(Component)} ${JSON.stringify(rest)}`);

  return (
  <Route {...rest} render={props =>
    user.email ? (<Component {...props} />)
      : (<Redirect to={{
        pathname: "/login",
        state: { from: props.location }
      }}
      />
      )
  }
  />
  )
}

const mapStateToProps = state => ({
  user: state.user
})

export default connect(
  mapStateToProps,
)(ProtectedComponent);