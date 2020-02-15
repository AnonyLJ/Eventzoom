import React from 'react';
import axios from 'axios';
import Conditional from '../components/Conditional';
import serverConfig from '../config/server';

export default class Registration extends React.Component {
	state = {
		email: '',
		password: '',
		passwordConfirmation: '',
		success: false,
		userExists: false,
	};

	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	// eslint-disable-next-line max-len
	showPasswordError = () => this.state.password.length && this.state.passwordConfirmation !== this.state.password && this.state.passwordConfirmation.length

	submitForm = async () => {
		this.setState({ userExists: false });
		try {
			await axios.post(`${serverConfig.url}users`, this.state);
			this.setState({ success: true });
		} catch (e) {
			if (e.response.data.error === 'validModel') {
				this.setState({ userExists: true });
			}
		}
	};

	render() {
		return (
			<div className="container">
				<div className="card border-0 shadow my-5 p-5">
					<Conditional if={this.state.success}>
						<div className="alert alert-success">
							Registered successfully
						</div>
					</Conditional>
					<Conditional if={this.state.userExists}>
						<div className="alert alert-danger">
							This email is already used!
						</div>
					</Conditional>

					<h1>Register</h1>
					<label htmlFor="email" className="col-form-label"> Email</label>
					<input id="email" className="form-control" type="email" name="email" placeholder="Email"
						value={this.state.email} onChange={this.handleChange} required />

					<label htmlFor="password" className="col-form-label">Password </label>
					<input id="password" className="form-control" type="password" name="password" placeholder="Password"
						value={this.state.password} onChange={this.handleChange} required />
					<label htmlFor="passwordConfirmation" className="col-form-label">Password</label>
					<input id="passwordConfirmation" className="form-control" type="password" name="passwordConfirmation" placeholder="Password Confirmation"
						value={this.state.passwordConfirmation} onChange={this.handleChange} required />
					<Conditional if={this.showPasswordError()}>
						<div className="alert alert-warning mt-2">Passwords must be identical</div>
					</Conditional>
					<button className={`btn btn-success ${this.state.success ? 'disabled' : ''} mt-5`} onClick={this.submitForm} type="submit"> Register</button>
				</div>
			</div>
		);
	}
}
