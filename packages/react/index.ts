import { Dispatcher, resolveDispatcher } from './src/currentDispatcher';
import { jsx, isValidElement as isValidElementFn } from './src/jsx';
import currentDispatcher from './src/currentDispatcher';
import { REACT_ELEMENT_TYPE, REACT_FRAGMENT_TYPE } from 'shared/ReactSymbols';
export const version = '1.0.0';
export const createElement = jsx;
export const isValidElement = isValidElementFn;
export const Fragment = REACT_FRAGMENT_TYPE;
export default {
	createElement: jsx
};

export const __SECRET_INTERNALS__ = {
	currentDispatcher
};
export const useState: Dispatcher['useState'] = (initialState) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useState(initialState);
};
export const useEffect: Dispatcher['useEffect'] = (create, deps) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useEffect(create, deps);
};
