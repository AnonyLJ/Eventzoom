import React from 'react';
import axios from 'axios';
import Conditional from '../components/Conditional';
import serverConfig from '../config/server';

export default class AddSeries extends React.Component {
	state = {
		title: '',
		description: '',
		file: '',
		requiredError: false,
		imageError: false,
		success: false,
	};

	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	uploadFile = (e) => {
		this.setState({ file: e.target.files[0] });
	};


	submitForm = async () => {
		const data = new FormData();
		data.append('title', this.state.title);
		data.append('description', this.state.description);
		data.append('image', this.state.file);
		this.setState({ requiredError: false, imageError: false });
		try {
			await axios.post(`${serverConfig.url}series`, data, {
				headers: {
					'Content-type': 'multipart/form-data',
				},
			});
			this.setState({ success: true });
		} catch (e) {
			if (e.response.data.error === 'required') {
				this.setState({ requiredError: true });
			} else {
				this.setState({ imageError: true });
			}
		}
	};

	render() {
		return (
			<div className="container">
				<div className="card border-0 shadow my-5 p-5">
					<Conditional if={this.state.success}>
						<div className="alert alert-success">
							Series added successfully.
						</div>
					</Conditional>
					<Conditional if={this.state.imageError}>
						<div className="alert alert-danger">
							Selected file must be an image!
						</div>
					</Conditional>
					<Conditional if={this.state.requiredError}>
						<div className="alert alert-danger">
							All fields are required!
						</div>
					</Conditional>

					<h1>Create a series</h1>
					<label htmlFor="title" className="col-form-label"> Title</label>
					<input id="title" className="form-control" type="text" name="title" placeholder="Title"
						value={this.state.title} onChange={this.handleChange} required />

					<label htmlFor="description" className="col-form-label">Description </label>
					<textarea id="description" className="form-control" name="description" placeholder="Description"
						onChange={this.handleChange} required value={this.state.description} />
					<label htmlFor="image" className="col-form-label">Image</label>
					<input id="passwordConfirmation" className="form-control" type="file" onChange={this.uploadFile} accept="image/*"/>
					<button className={`btn btn-success ${this.state.success ? 'disabled' : ''} mt-5`} onClick={this.submitForm} type="submit">Add series</button>
				</div>
			</div>
		);
	}
}
