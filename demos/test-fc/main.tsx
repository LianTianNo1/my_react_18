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
	return <span>jimmy</span>;
}
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
