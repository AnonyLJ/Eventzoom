import eventModel from '../../src/models/event.model';
import seriesModel from '../../src/models/series.model';
import eventService from '../../src/services/event.service';

const mockSave = jest.fn();
jest.mock('../../src/models/event.model', () => jest.fn().mockImplementation(() => ({ save: mockSave })));
jest.mock('../../src/models/series.model');


describe('testing getEvents', () => {
	it('should getMessages successfully', async () => {
		eventModel.find = jest.fn().mockImplementation(async () => 'test result');
		await expect(await eventService.getEvents()).toEqual('test result');
	});
	it('should throw error successfully', async () => {
		eventModel.find = jest.fn().mockImplementation(async () => { throw Error('irrelevant'); });
		await expect(eventService.getEvents()).rejects.toEqual(new Error('Error while getting events'));
	});
});

describe('testing getEvents for the advanced search', () => {
	it('should getMessages successfully', async () => {
		eventModel.find = jest.fn().mockImplementation(async () => 'test result');
		await expect(await eventService.getEventsAdvanced({ title: 'test' })).toEqual('test result');
		await expect(eventModel.find.mock.calls[0][0].title).toEqual(/test/i);
	});
	it('should throw error successfully', async () => {
		eventModel.find = jest.fn().mockImplementation(async () => { throw Error('irrelevant'); });
		await expect(eventService.getEventsAdvanced({ title: 'test' })).rejects.toThrow();
		await expect(eventModel.find.mock.calls[0][0].title).toEqual(/test/i);
	});
});

describe('testing getEventByid', () => {
	it('should getMessages successfully', async () => {
		const result = { populate: jest.fn().mockImplementation(async () => 'test result') };
		eventModel.findById = jest.fn().mockImplementation(() => result);
		await expect(await eventService.getEventById(1)).toEqual('test result');
		await expect(eventModel.findById.mock.calls[0]).toEqual([1]);
	});
	it('should throw error successfully', async () => {
		const result = { populate: jest.fn().mockImplementation(async () => { throw Error('irrelevant'); }) };
		eventModel.findById = jest.fn().mockImplementation(() => result);
		await expect(eventService.getEventById(1)).rejects.toEqual(new Error('Error while getting single event'));
		return expect(eventModel.findById.mock.calls[0]).toEqual([1]);
	});
});

describe('testing addEvent', () => {
	it('should run successfully', async () => {
		mockSave.mockImplementation(async () => ({ _id: 5 }));
		await eventService.addEvent({ test: 'test', series: '123' });
		expect(eventModel.mock.calls[0]).toEqual([{ test: 'test', series: '123' }]);
		expect(seriesModel.findByIdAndUpdate.mock.calls[0]).toEqual(['123', { $push: { events: 5 } }]);
	});
});

describe('testing event at capacity', () => {
	it('event is at capacity should should return true', async () => {
		const result = {
			populate: jest.fn().mockImplementation(async () => ({
				attendees: [1, 2, 3],
				capacity: 3,
			})),
		};
		eventModel.findById = jest.fn().mockImplementation(() => result);
		const response = await eventService.eventAtCapacity(123);
		expect(response).toEqual(true);
	});
	it('event is not at capacity should should return false', async () => {
		const result = {
			populate: jest.fn().mockImplementation(async () => ({
				attendees: [1, 2],
				capacity: 3,
			})),
		};
		eventModel.findById = jest.fn().mockImplementation(() => result);
		const response = await eventService.eventAtCapacity(123);
		expect(response).toEqual(false);
	});
});

describe('testing if user attending event', () => {
	it('user is attending so return true', async () => {
		const fakeUser = { _id: 1 };
		const result = {
			populate: jest.fn().mockImplementation(async () => ({
				attendees: [1, 2, 3],
				capacity: 3,
			})),
		};
		eventModel.findById = jest.fn().mockImplementation(() => result);
		const response = await eventService.userAttending(123, fakeUser);
		expect(response).toEqual(true);
	});
	it('user is not attending so return false', async () => {
		const fakeUser = { _id: 5 };
		const result = {
			populate: jest.fn().mockImplementation(async () => ({
				attendees: [1, 2, 3],
				capacity: 3,
			})),
		};
		eventModel.findById = jest.fn().mockImplementation(() => result);
		const response = await eventService.userAttending(123, fakeUser);
		expect(response).toEqual(false);
	});
});

describe('testing user attending an event', () => {
	it('event under capactity so user can attend', async () => {
		const fakeUser = { _id: 1 };
		const result = {
			populate: jest.fn().mockImplementation(async () => ({
				attendees: [2],
				capacity: 3,
				save() {
					return true;
				},
			})),
		};
		eventModel.findById = jest.fn().mockImplementation(() => result);
		const response = await eventService.attendEvent(123, fakeUser, true);
		expect(response).toEqual(true);
	});
	it('event at capactity so user can not attend', async () => {
		const fakeUser = { _id: 1 };
		const result = {
			populate: jest.fn().mockImplementation(async () => ({
				attendees: [2],
				capacity: 1,
				save() {
					return true;
				},
			})),
		};
		eventModel.findById = jest.fn().mockImplementation(() => result);
		const response = await eventService.attendEvent(123, fakeUser, true);
		expect(response).toEqual(false);
	});
});
