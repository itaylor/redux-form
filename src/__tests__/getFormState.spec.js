/* eslint react/no-multi-comp:0*/
import expect from 'expect';
import React, {Component} from 'react';
// import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import {combineReducers, createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from '../reducer';
import createReduxForm from '../createReduxForm';

describe('getFormState', () => {
  const reduxForm = createReduxForm(false, React);
  const makeStore = () => createStore(combineReducers({
    myFormLocation: reducer
  }));

  it('should return a decorator function', () => {
    expect(reduxForm).toBeA('function');
  });

  class Form extends Component {
    render() {
      return <div />;
    }
  }

  it('should use state from the getFormState function without error', () => {
    const store = makeStore();
    expect(() => {
      const Decorated = reduxForm({
        form: 'testForm',
        fields: ['foo', 'bar'],
        getFormState: state => state.myFormLocation
      })(Form);
      TestUtils.renderIntoDocument(
        <Provider store={store}>
          <Decorated/>
        </Provider>
      );
    }).toNotThrow();
  });

  it('should initialize field values', () => {
    const store = makeStore();
    const Decorated = reduxForm({
      form: 'testForm',
      fields: ['foo', 'bar'],
      getFormState: state => state.myFormLocation
    })(Form);
    const dom = TestUtils.renderIntoDocument(
      <Provider store={store}>
        <Decorated/>
      </Provider>
    );
    const stub = TestUtils.findRenderedComponentWithType(dom, Form);
    const fooField = stub.props.fields.foo;
    const barField = stub.props.fields.bar;
    expect(fooField).toBeA('object');
    expect(fooField.name).toBe('foo');
    expect(barField.name).toBe('bar');
  });
});
