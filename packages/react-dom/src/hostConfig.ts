export type Container = Element;
export type Instance = Element;

export const createInstance = (type: string): Instance => {
	const element = document.createElement(type);
	return element;
};

export const createTextInstance = (content: string) => {
	return document.createTextNode(content);
};
export const appendInitialChild = (
	parent: Instance | Container,
	child: Instance
) => {
	parent.appendChild(child);
};
export const appendChildToContainer = (
	parent: Instance | Container,
	child: Instance
) => {
	parent.appendChild(child);
};
