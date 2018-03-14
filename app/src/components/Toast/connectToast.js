/* eslint-disable react/prefer-stateless-function */
import PropTypes from 'prop-types';

import React, { Component } from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

const connectToast = (WrappedComponent) => {
  class ConnectedToast extends Component {
    render() {
      return (
        <WrappedComponent
          {...this.props}
          showToast={this.context.showToast}
        />
      );
    }
  }

  ConnectedToast.contextTypes = {
    showToast: PropTypes.func,
  };

  return hoistNonReactStatic(ConnectedToast, WrappedComponent);
};

export default connectToast;
