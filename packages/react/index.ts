import { Dispatcher, resolveDispatcher } from './src/currentDispatcher';
import { jsxDEV } from './src/jsx';
import currentDispatcher from './src/currentDispatcher';

export default {
	version: '1.0.0',
	createElement: jsxDEV
};

export const __SECRET_INTERNALS__ = {
	currentDispatcher
};
export const useState: Dispatcher['useState'] = (initialState) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useState(initialState);
};
