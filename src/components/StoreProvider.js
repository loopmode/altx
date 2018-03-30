import PropTypes from 'prop-types';
import React from 'react';
import { reduceDefinedProps } from '../decorators/connect';
 
export default class StoreProvider extends React.Component { 
    static propTypes = {
        children: PropTypes.node,
        store: PropTypes.shape({ state: PropTypes.object, listen: PropTypes.func, unlisten: PropTypes.func }),
        props: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func])),
            PropTypes.func
        ]),
        propagate: PropTypes.oneOfType([PropTypes.bool, PropTypes.array, PropTypes.string])
    };
    static defaultProps = {
        propagate: true
    };

    state = {
        storeValues: undefined
    };

    constructor(props, context) {
        super(props, context); 
        this.state.storeValues = this.getStoreValues();
        this.state.propagationValues = this.getPropagationValues(props )
    }
    componentDidMount() {
        this._isMounted = true;
        this._subscription = this.props.store.listen(this.updateStoreValues.bind(this));
    }
    componentWillUnmount() {
        this._isMounted = false;
        this.props.store.unlisten(this._subscription);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            propagationValues: this.getPropagationValues(nextProps)
        })
    }
    render() {
        return React.Children.map(this.props.children, child => {
            return React.cloneElement(child, {
                ...this.state.storeValues,
                ...this.state.propagationValues
            });
        });
    }
    getPropagationValues(ownProps = this.props) {
        let {propagate, children, store, props, ...childProps} = ownProps;
        
        if (propagate === true) {
            return childProps;
        }
        if (typeof propagate === 'function') {
            return propagate(ownProps)
        }
        // comma-separated prop names. split to array
        if (typeof propagate === 'string') {
            propagate = propagate.split(',').map(str => str.trim())
        }
        // array of props to pass through
        if (Array.isArray(propagate)) {
            return propagate.reduce((result, prop) => {
                if (typeof prop === 'function') {
                    return {...result, ...prop(ownProps)}
                }
                else {
                    result[prop] = ownProps[prop];
                }
                return result;
            }, {});
        }
        return {};
    }

    getStoreValues() {
        const { store, props } = this.props; 

        return {
            ...reduceDefinedProps({ store, props }, this.props)
        };
    }
 
    updateStoreValues() {
        if (this._isMounted) {
            this.setState({ storeValues: this.getStoreValues() });
        }
    }
} 