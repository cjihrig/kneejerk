const React = require('react');
const ReactRouter = require('react-router');
const Link = ReactRouter.Link;

class Html extends React.Component {
  render () {
    return (
      <html lang="en">
        <head>
          <meta charSet="UTF-8"/>
          <title>Title Goes Here</title>
        </head>
        <body>
          <div id="root" dangerouslySetInnerHTML={{__html: this.props.markup}}>
          </div>
        </body>
      </html>
    );
  }
};

class App extends React.Component {
  render () {
    return (
      <div className="App">
        <h1>App</h1>
        <Link to="/about" activeClassName="about-is-active">About</Link>{' '}
        <Link to="/dashboard" activeClassName="dashboard-is-active">Dashboard</Link>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

class Dashboard extends React.Component {
  render () {
    return (
      <div className="Dashboard">
        <h1>The Dashboard</h1>
      </div>
    );
  }
}

class About extends React.Component {
  render () {
    return (
      <div className="About">
        <h1>About</h1>
      </div>
    );
  }
}

const DashboardRoute = {
  path: '/dashboard',
  component: Dashboard
};

const AboutRoute = {
  path: '/about',
  component: About
};

const RedirectRoute = {
  path: '/company',
  onEnter (nextState, replaceState) {
    replaceState(null, '/about');
  }
};

const routes = {
  path: '/',
  component: App,
  childRoutes: [DashboardRoute, AboutRoute, RedirectRoute]
};

module.exports = {
  routes,
  Html,
  App,
  Dashboard,
  About
};
