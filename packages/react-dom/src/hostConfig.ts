import { FiberNode } from 'react-reconciler/src/fiber';
import { HostText } from 'react-reconciler/src/workTags';
import { DOMElement, updateFiberProps } from './syntheticEvent';
import { Props } from 'shared/ReactTypes';

export type Container = Element;
export type Instance = Element;
export type TextInstance = Text;

export const createInstance = (type: string, props: Props): Instance => {
	const element = document.createElement(type);
	updateFiberProps(element as unknown as DOMElement, props);
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
/**
 * 提交离屏DOM更新
 * @param fiber
 */
export function commitUpdate(fiber: FiberNode) {
	switch (fiber.tag) {
		case HostText:
			commitTextUpdate(fiber.stateNode, fiber.memoizedProps.content);
			break;

		default:
			break;
	}
}

/**
 * 提交text节点的文本内容更新
 * @param textInstance
 * @param content
 */
export function commitTextUpdate(textInstance: TextInstance, content: string) {
	textInstance.textContent = content;
}

export function removeChild(container: Container, child: Instance) {
	container.removeChild(child);
}
