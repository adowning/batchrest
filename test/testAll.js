var assert = require('assert');
var request = require('supertest');


var theTests = [
	{ name: 'Batch Sync', command: '/batchGetSync' },
	{ name: 'Batch Async', command: '/batchGetAsync' }
];


describe('Batch Sync', function () {

	it('should be able to contact api', function (done) {
		request('http://localhost:3154')
			.post('/batchGetSync')
			.expect('Content-Type', /json/)
			.expect(200) //Status code
			.end(function (err, res) {
				if (err) {
					throw err;
				}
				done();
			});
	});

	it('should get success false when no request', function (done) {
		var body = {  };
		request('http://localhost:3154')
			.post('/batchGetSync')
			.send(body)
			.expect('Content-Type', /json/)
			.expect(200) //Status code
			.end(function (err, res) {
				if (err) {
					throw err;
				}
				assert.equal(res.body.success, false);
				done();
			});
	});

	it('should get a command response for each requested command', function (done) {
		var body = {
			requests: [
				{
					host: 'jsonplaceholder.typicode.com',
					port: 80,
					command: '/posts/1',
					requestId: 'command1'
				},
				{
					host: 'jsonplaceholder.typicode.com',
					port: 80,
					command: '/albums/1',
					requestId: 'command2'
				}
			]
		};
		request('http://localhost:3154')
			.post('/batchGetSync')
			.send(body)
			.expect('Content-Type', /json/)
			.expect(200) //Status code
			.end(function (err, res) {
				if (err) {
					throw err;
				}
				assert.equal(res.body.success, true);
				for (var i = 0; i < body.requests.length; i++) {
					assert.notEqual(res.body.responses[body.requests[i].requestId], null);
				}

				done();
			});
	});
});

describe('Batch Async', function () {

	it('should be able to contact api', function (done) {
		request('http://localhost:3154')
			.post('/batchGetAsync')
			.expect('Content-Type', /json/)
			.expect(200) //Status code
			.end(function (err, res) {
				if (err) {
					throw err;
				}
				done();
			});
	});

	it('should get success false when no request', function (done) {
		var body = {  };
		request('http://localhost:3154')
			.post('/batchGetAsync')
			.send(body)
			.expect('Content-Type', /json/)
			.expect(200) //Status code
			.end(function (err, res) {
				if (err) {
					throw err;
				}
				assert.equal(res.body.success, false);
				done();
			});
	});

	it('should get a command response for each requested command', function (done) {
		var body = {
			requests: [
				{
					host: 'jsonplaceholder.typicode.com',
					port: 80,
					command: '/posts/1',
					requestId: 'command1'
				},
				{
					host: 'jsonplaceholder.typicode.com',
					port: 80,
					command: '/albums/1',
					requestId: 'command2'
				}
			]
		};
		request('http://localhost:3154')
			.post('/batchGetAsync')
			.send(body)
			.expect('Content-Type', /json/)
			.expect(200) //Status code
			.end(function (err, res) {
				if (err) {
					throw err;
				}
				assert.equal(res.body.success, true);
				for (var i = 0; i < body.requests.length; i++) {
					assert.notEqual(res.body.responses[body.requests[i].requestId], null);
				}

				done();
			});
	});
});
