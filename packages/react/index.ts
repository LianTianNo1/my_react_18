import { Dispatcher, resolveDispatcher } from './src/currentDispatcher';
import { jsx, isValidElement as isValidElementFn } from './src/jsx';
import currentDispatcher from './src/currentDispatcher';

export const version = '1.0.0';
export const createElement = jsx;
export const isValidElement = isValidElementFn;

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
