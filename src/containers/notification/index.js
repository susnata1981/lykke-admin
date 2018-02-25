import React from 'react';
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const notificationBox = {
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: 10,
  height: 0,
}

const slider = {
  overflowY: 'hidden',
  maxHeight: 50,
  transitionProperty: 'all',
  transitionDuration: .5,
  transitionTimingFunction: 'cubic-bezier(0, 1, 0.5, 1)',
};

const closed = {
  maxHeight: 0
}

class Notification extends React.Component {

  render() {
    const { message, success } = this.props.notification;
    const bgClass = success ? 'alert-success' : 'alert-danger';

    return (function() {
      if (!message) {
        return null;
      } else {
        if (!success) {
          return (
          <div className="alert alert-danger" role="alert">
            <strong>Error:</strong> {message}
          </div>);
        } else {
          return (
            <div className="accent p-3 my-3 textPrimary" role="alert">
              {message}
          </div>);
        }
      }
    }());
  }
}

const mapStateToProps = state => ({
  notification: state.notification,
});

export default connect(
  mapStateToProps
)(Notification)