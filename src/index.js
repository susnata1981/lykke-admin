import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';
import App from './containers/app'
import registerServiceWorker from './registerServiceWorker';
import firebase from './firebase';
import { loginSuccess, logout, ADMIN_EMAIL } from './modules/action';
import style from './styles/main.scss'


firebase.auth().onAuthStateChanged(user => {
  if (user) {
    if (user.email !== ADMIN_EMAIL) {
      alert('You have to be admin to view this page');
      logout();
      store.dispatch(logout());
      return;
    }
    store.dispatch(loginSuccess({
      email: user.email
    }));
  }
});

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <App />
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)

registerServiceWorker();
