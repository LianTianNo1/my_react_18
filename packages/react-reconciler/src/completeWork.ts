import {
	Container,
	appendInitialChild,
	createInstance,
	createTextInstance
} from 'react-dom/src/hostConfig';
import {
	FunctionComponent,
	HostComponent,
	HostRoot,
	HostText
} from './workTags';
import { FiberNode } from './fiber';
import { NoFlags } from './fiberFlags';

export const completeWork = (wip: FiberNode) => {
	const newProps = wip.pendingProps;
	const current = wip.alternate;
	switch (wip.tag) {
		case HostComponent:
			if (current !== null && wip.stateNode) {
			} else {
				// 1、构建DOM
				const instance = createInstance(wip.type);
				// 2、将DOM加入到DOM树中
				appendAllChildren(instance, wip);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);
			return null;
		case HostText:
			if (current !== null && wip.stateNode) {
			} else {
				const instance = createTextInstance(newProps.content);
				wip.stateNode = instance;
			}
			bubbleProperties(wip);

			return null;
		case HostRoot:
			bubbleProperties(wip);
			return null;

		case FunctionComponent:
			bubbleProperties(wip);
			return null;
		default:
			if (__DEV__) {
				console.warn('未处理的comletework情况', wip);
			}
	}
};

function appendAllChildren(parent: Container, wip: FiberNode) {
	let node = wip.child!;
	while (node !== null) {
		if (node.tag === HostComponent || node.tag == HostText) {
			appendInitialChild(parent, node.stateNode);
		} else if (node.child !== null) {
			node.child.return = node;
			node = node.child;
			continue;
		}
		if (node === wip) return;
		while (node.sibling === null) {
			if (node.return === null || node.return === wip) {
				return;
			}
			node = node?.return;
		}
		node.sibling.return = node.return;
		node = node.sibling;
	}
}

function bubbleProperties(wip: FiberNode) {
	let subtreeFlag = NoFlags;
	let child = wip.child;
	while (child !== null) {
		subtreeFlag |= child.subtreeFlag;
		subtreeFlag |= child.flags;

		child.return = wip;
		child = child.sibling;
	}
	wip.subtreeFlag |= subtreeFlag;
}
