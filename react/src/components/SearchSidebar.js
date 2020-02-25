import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import './SearchSidebar.css';
import { DateRange } from 'react-date-range';

class SearchSidebar extends Component {
	static propTypes = {
		updateInput: PropTypes.func.isRequired,
		updateDates: PropTypes.func.isRequired,
		search: PropTypes.func.isRequired,
		startDate: PropTypes.object.isRequired,
		endDate: PropTypes.object.isRequired,
	};

	render = () => <div className="card">
		<div className="card-header">Search</div>
		<div className="card-body">
			Talk title:
			<input type="text" className="form-control" placeholder="My new horse" id="title" onChange={(event) => this.props.updateInput(event)} />
			Speaker:
			<input type="text" className="form-control" placeholder="Horsey McHorseman" id="speaker" onChange={(event) => this.props.updateInput(event)} />
			Organiser:
			<input type="text" className="form-control" placeholder="My new horse" id="organiser" onChange={(event) => this.props.updateInput(event)} />
			Date range:<br/>
			<DateRange
				ranges={
					[
						{
							startDate: this.props.startDate,
							endDate: this.props.endDate,
							key: 'selection',
						},
					]
				}
				onChange={this.props.updateDates}
			/>

			<button className="btn btn-success mt-2" onClick={this.props.search}>Search</button>
		</div>
	</div>
}

export default SearchSidebar;
