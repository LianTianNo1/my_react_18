import React from 'react';
import ReactDOM from 'react-dom/client';
function App() {
	return (
		<div>
			<Child></Child>
		</div>
	);
}
function Child() {
	return <span>jimm1y1</span>;
}
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
