import React, { Component } from 'react';
import { IndexLink } from 'react-router'

class Nav extends Component {
  render () {
    return (
        <div>
          <IndexLink activeClassName='active' to='/'>Home</IndexLink>&nbsp;
          <IndexLink activeClassName='active' to='/address'>Address</IndexLink>&nbsp;
          <IndexLink activeClassName='active' to='/about'>About</IndexLink>&nbsp;
          <IndexLink activeClassName='active' to='/namedComponent'>Named Components</IndexLink>&nbsp;
          <IndexLink activeClassName='active' to={{ pathname: '/address/query', query: { message: 'Hello from Route Query' } }}>Route Query</IndexLink>
        </div>
    );
  }
}


export default Nav;
