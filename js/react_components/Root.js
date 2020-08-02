'use strict'


import {AccountHome} from './AccountHome.js';

const domContainer = document.getElementById('HomeComponent');
ReactDOM.render(React.createElement(AccountHome, {DataService}), domContainer);