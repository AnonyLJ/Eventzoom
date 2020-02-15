import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { DiscussionEmbed } from 'disqus-react';
import DisabilityAccess from '../components/DisabilityAccess';
import AttendButton from '../components/AttendButton';
import serverConfig from '../config/server';
import disqusConfig from '../config/disqus';
import Conditional from '../components/Conditional';

class Event extends Component {
	state = {
		isLoaded: false,
		date: '1970-01-01',
		error: false,
		disqusShortname: disqusConfig.shortname,
	};

	componentDidMount = () => axios.get(`${serverConfig.url}events/${this.props.eventid}`)
		.then((res) => {
			this.setState({ isLoaded: true, ...res.data });
		}).catch(() => {
			this.setState({ error: true });
		})

	getDisqusConfig = () => ({
		url: `${disqusConfig.shortname}/events/${this.props.eventid}`,
		identifier: this.props.eventid,
		title: this.state.title,
	});

	render = () => <div className='container'>
		<div className="container">
			<div className="card border-0 shadow my-5">
				<Conditional if={this.state.error}>
					<div className="card-body p-5">

						<div className="d-flex align-items-center">
							<img src={'https://pluspng.com/img-png/kitten-png--243.png'} alt='Sad kitten'/>
							<h1>Sorry this event could not be found</h1>
						</div>
					</div>
				</Conditional>
				<Conditional if={this.state.isLoaded}>
					<div className="card-body p-5">
						<h1 className="font-weight-light">{this.state.title}</h1>
						<div className='row'>
							<div className='col-md-7'>
								<p>0 out of {this.state.capacity} attending</p>
								<p className="lead">{this.state.description}</p>
								<img src={this.state.image} alt='Event' className="img-responsive mw-100"/>
							</div>
							<div className='col-md-5'>
								<div className='card'>
									<div className='card-body'>
										<h5 className='card-title'>Event details</h5>
										<DisabilityAccess disabilityAccess={this.state.disabilityAccess} />
										<p>Date: {new Date(this.state.date).toLocaleDateString()}</p>
										<p>Speaker: {this.state.speaker}</p>
										<p>Location: {this.state.vaguelocation}</p>
										<p>Organiser: {this.state.organiser}</p>
									</div>
									<div className="card-footer text-center">
										<AttendButton />
									</div>
								</div>
							</div>
						</div>
						<p className="lead">Discussion board</p>
						<DiscussionEmbed
							config={this.getDisqusConfig()}
							shortname={this.state.disqusShortname}
						/>
					</div>
				</Conditional>
			</div>
		</div>
	</div>
}

Event.propTypes = {
	eventid: PropTypes.string.isRequired,
};

export default Event;
