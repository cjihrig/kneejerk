'use strict';
const Boom = require('boom');
const React = require('react');
const ReactDom = require('react-dom/server');
const ReactRouter = require('react-router');
const defaults = {
  render: 'renderToStaticMarkup',
  root: null,
  rootDoctype: '<!DOCTYPE html>',
  rootMarkupProp: 'markup'
};

module.exports = function kneeJerk (options, callback) {
  const settings = Object.assign({}, defaults, options);
  const doRender = typeof settings.render === 'string';
  const renderFn = doRender ? ReactDom[settings.render] : null;
  const root = settings.root;

  if (typeof settings.location !== 'string') {
    throw new TypeError('location option must be a string');
  }

  if (root !== null && typeof root !== 'function') {
    throw new TypeError('root option must be a react component');
  }

  if (renderFn !== null && typeof renderFn !== 'function') {
    throw new TypeError('render option must be the name of a function');
  }

  if (typeof callback !== 'function') {
    throw new TypeError('callback must be a function');
  }

  ReactRouter.match({
    routes: settings.routes,
    location: settings.location
  }, function matchCb (err, redirectLocation, renderProps) {
    // Reference: https://github.com/rackt/react-router/blob/master/docs/guides/advanced/ServerRendering.md
    if (err) {
      return callback(Boom.wrap(err));
    }

    const results = {
      redirectLocation,
      renderProps,
      markup: null
    };

    if (redirectLocation) {
      return callback(null, results);
    } else if (!renderProps) {
      return callback(Boom.notFound());
    }

    if (!renderFn) {
      return callback(null, results);
    }

    // NOTE: RoutingContext will be renamed to RouterContext in ReactRouter
    const element = React.createElement(ReactRouter.RoutingContext, renderProps);
    let markup = renderFn(element);

    if (root) {
      const factory = React.createFactory(root);
      const rootComponent = factory({
        [settings.rootMarkupProp]: markup
      });

      markup = settings.rootDoctype + ReactDom.renderToStaticMarkup(rootComponent);
    }

    results.markup = markup;
    callback(null, results);
  });
};
