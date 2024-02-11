import { Container, appendChildToContainer } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags, Placement } from './fiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';

let nextEffect: FiberNode | null = null;

export function commitMutationEffects(finishedWork: FiberNode) {
	nextEffect = finishedWork;
	while (nextEffect !== null) {
		const child: FiberNode | null = nextEffect.child;
		if ((nextEffect.subtreeFlag & MutationMask) !== NoFlags && child !== null) {
			nextEffect = child;
		} else {
			up: while (nextEffect !== null) {
				const sibling: FiberNode | null = nextEffect.sibling;
				if (sibling !== null) {
					nextEffect = sibling;
					break up;
				}
				nextEffect = nextEffect.return;
			}
		}
	}
}

function commitMutationEffectsOnFiber(finishedWork: FiberNode) {
	const flag = finishedWork.flags;
	if (flag & (Placement !== NoFlags)) {
		commitPlacement(finishedWork);
		finishedWork.flags &= ~Placement;
	}
}

function commitPlacement(finishedWork: FiberNode) {
	if (__DEV__) {
		console.warn('执行Placement操作', finishedWork);
	}
	const hostParent = getHostParent(finishedWork);

	appendPlacementNodeIntoContainer(finishedWork, finishedWork);
}

function getHostParent(fiber: FiberNode) {
	let parent = fiber.return;
	while (parent) {
		const parentTag = parent.tag;
		if (parentTag === HostComponent) {
			return parent.stateNode as Container;
		}
		if (parentTag === HostRoot) {
			return parent.stateNode as FiberRootNode;
		}
		parent = parent.return;
	}
	if (__DEV__) {
		console.warn('未找到parent');
	}
}

function appendPlacementNodeIntoContainer(
	finishedWork: FiberNode,
	hostParent: Container
) {
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		appendChildToContainer(finishedWork.stateNode, hostParent);
		return;
	}
	const child = finishedWork.child;
	if (child !== null) {
		appendPlacementNodeIntoContainer(child, hostParent);
		let sibling = child.sibling;
		while (sibling !== null) {
			appendPlacementNodeIntoContainer(sibling, hostParent);
			sibling = sibling.sibling;
		}
	}
}
