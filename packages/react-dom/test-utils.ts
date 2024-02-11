import { ReactElementType } from 'shared/ReactTypes';
import ReactDOM from 'react-dom';

export function renderIntoDocument(element: ReactElementType) {
	const div = document.createElement('div');
	return ReactDOM.createRoot(div).render(element);
}
