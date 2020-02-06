import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class App extends Component {
	static propTypes = {
		isLoggedIn: PropTypes.bool.isRequired,
	}

	render = () => <div>
		<Route exact path="/" >
				Hello World! { this.isLoggedIn ? 'yes' : 'no'}
		</Route>
	</div>
}

const mapStateToProps = (state) => ({
	isLoggedIn: state.simpleReducer.status,
});

export default connect(mapStateToProps)(App);
