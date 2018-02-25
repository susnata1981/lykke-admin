import React from 'react';
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { login } from '../../modules/action'
import LoginBtnImage from '../../images/btn_google_signin_dark_normal_web.png';
import firebase from 'firebase';
import { Redirect, Route } from 'react-router-dom';

const loginContainer = {
  position: 'absolute',
  top: '50%',
  left: '25%',
}

const Login = (props) => {
  if (props.user.email) {
    return <Redirect to='/' />
  }
  return (
    <div style={loginContainer}>
      <img onClick={props._login} src={LoginBtnImage} />
    </div>
  )
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => {
  return {
    _login: () => dispatch(login()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)