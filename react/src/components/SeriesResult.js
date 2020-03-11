import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class SeriesResult extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		image: PropTypes.string.isRequired,
		title: PropTypes.string.isRequired,
		description: PropTypes.string.isRequired,
	};

	thumbnailBGImage = () => ({
		backgroundImage: `url(${this.props.image})`,
	});


	render = () => <div className="col mb-3">
		<Link to={`/series/${this.props.id}`}>
			<div className="card flex-md-row mb-4 box-shadow h-md-250">
				<div className="d-none d-md-block" style={{ width: '250px', height: '250px', background: `url(${this.props.image}) 50% 20% no-repeat` }}>a</div>
				<div className="card-body d-flex flex-column align-items-start">
					<h3 className="mb-0">
						<a className="text-dark" href="#">{this.props.title}</a>
					</h3>
					<p className="card-text mb-auto">{this.props.description}</p>
					<a href="#">Continue reading</a>
				</div>
				{/*<img className="card-img-right flex-auto d-none d-md-block" data-src="holder.js/200x250?theme=thumb" src={this.props.image} style={{ width: '200px', height: '250px' } } />*/}

			</div>
		</Link>
	</div>
}

export default SeriesResult;
