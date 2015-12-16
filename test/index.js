'use strict';
const Code = require('code');
const Lab = require('lab');
const ReactRouter = require('react-router');
const KneeJerk = require('../');

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;

require('babel-core/register')({
  presets: ['react', 'es2015']
});

const Fixtures = require('./fixtures/fixtures.jsx');

describe('KneeJerk', () => {
  describe('kneeJerk()', () => {
    it('renders a view', (done) => {
      KneeJerk({
        routes: Fixtures.routes,
        location: '/dashboard'
      }, (err, results) => {
        expect(err).to.equal(null);
        expect(results.markup).to.match(/<h1>The Dashboard<\/h1>/);
        done();
      });
    });

    it('wraps a root component around a view', (done) => {
      KneeJerk({
        root: Fixtures.Html,
        routes: Fixtures.routes,
        location: '/dashboard'
      }, (err, results) => {
        expect(err).to.equal(null);
        expect(results.markup).to.match(/^<!DOCTYPE html><html lang="en">/);
        expect(results.markup).to.match(/<h1>The Dashboard<\/h1>/);
        done();
      });
    });

    it('can use different rendering functions', (done) => {
      KneeJerk({
        routes: Fixtures.routes,
        location: '/dashboard',
        render: 'renderToString'
      }, (err, results) => {
        expect(err).to.equal(null);
        expect(results.markup).to.match(/<h1 data-reactid="(.+)">The Dashboard<\/h1>/);
        done();
      });
    });

    it('can disable rendering', (done) => {
      KneeJerk({
        routes: Fixtures.routes,
        location: '/dashboard',
        render: null
      }, (err, results) => {
        expect(err).to.equal(null);
        expect(results.markup).to.equal(null);
        done();
      });
    });

    it('handles redirects from react-router', (done) => {
      KneeJerk({
        routes: Fixtures.routes,
        location: '/company'
      }, (err, results) => {
        expect(err).to.equal(null);
        expect(results.redirectLocation).to.be.an.object();
        expect(results.redirectLocation.pathname).to.equal('/about');
        expect(results.markup).to.equal(null);
        done();
      });
    });

    it('returns a 404 on no match', (done) => {
      KneeJerk({
        routes: Fixtures.routes,
        location: '/foobar'
      }, (err, results) => {
        expect(err).to.be.an.object();
        expect(err.message).to.equal('Not Found');
        expect(err.isBoom).to.equal(true);
        expect(err.output.statusCode).to.equal(404);
        expect(results).to.not.exist();
        done();
      });
    });

    it('handles errors from react-router', (done) => {
      const match = ReactRouter.match;

      ReactRouter.match = (options, callback) => {
        ReactRouter.match = match;
        callback(new Error('match'));
      };

      KneeJerk({
        routes: Fixtures.routes,
        location: '/foobar'
      }, (err, results) => {
        expect(err).to.be.an.object();
        expect(err.isBoom).to.equal(true);
        expect(err.output.statusCode).to.equal(500);
        expect(results).to.not.exist();
        done();
      });
    });

    it('throws if location parameter is not a string', (done) => {
      expect(() => {
        KneeJerk({}, () => { return; });
      }).to.throw(TypeError, 'location option must be a string');
      done();
    });

    it('throws if root parameter is not a function', (done) => {
      expect(() => {
        KneeJerk({
          location: 'foo',
          root: 'bar'
        }, () => { return; });
      }).to.throw(TypeError, 'root option must be a react component');
      done();
    });

    it('throws if render is not a valid function name', (done) => {
      expect(() => {
        KneeJerk({
          location: 'foo',
          render: 'bar'
        }, () => { return; });
      }).to.throw(TypeError, 'render option must be the name of a function');
      done();
    });

    it('throws if callback is not a function', (done) => {
      expect(() => {
        KneeJerk({ location: 'foo' }, 'foo');
      }).to.throw(TypeError, 'callback must be a function');
      done();
    });
  });
});
