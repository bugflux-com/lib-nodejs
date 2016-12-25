var should = require('chai').should();

var bugflux = require('../src/index.js');
var errorA = require('./samples/error-a.js');
var errorB = require('./samples/error-b.js');
var nestedErrorA = require('./samples/nested/error-a.js');

describe('report', function() {
	describe('hash', function() {
		it('should exists', function() {
			var r = new bugflux.report(errorA);
			should.exist(r.hash);
		});

		it('should be shorter or equal 64 chars', function() {
			var r = new bugflux.report(errorA);
			r.hash.should.have.length.at.most(64);
		});

		it('should be equals', function() {
			var rA = new bugflux.report(errorA);
			var rB = new bugflux.report(errorA);
			rA.hash.should.be.equal(rB.hash);
		});

		it('should not be equals', function() {
			var rA = new bugflux.report(errorA);
			var rB = new bugflux.report(nestedErrorA);
			rA.hash.should.not.be.equal(rB.hash);
		});
	});

	describe('client_id', function() {
		it('should exists', function() {
			var r = new bugflux.report();
			should.exist(r.client_id);
		});

		it('should be equals', function() {
			var rA = new bugflux.report();
			var rB = new bugflux.report();
			rA.client_id.should.be.equal(rB.client_id);
		});
	});

	describe('stack_trace', function() {
		it('should exists', function() {
			var r = new bugflux.report(errorA);
			should.exist(r.stack_trace);
		});

		it('should be equals', function() {
			var r = new bugflux.report(errorA);
			r.stack_trace.should.be.equal(errorA.stack);
		});

		it('should be filled in', function() {
			var r = new bugflux.report(errorA);
			r.fill(errorB);

			errorA.stack.should.not.be.equal(errorB.stack);
			r.stack_trace.should.be.equal(errorB.stack);
		});
	});

	describe('url', function() {
		it('should be equal', function() {
			var r = new bugflux.report({ url: 'new-url' });
			r.url.should.be.equal('new-url');
		});

		it('should be equal #2', function() {
			var r = new bugflux.report(errorA, { project: 'test', url: 'bugflux' });
			r.url.should.be.equal('bugflux');
		});
	});
});