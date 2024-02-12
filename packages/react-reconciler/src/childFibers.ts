import { Props, ReactElementType } from 'shared/ReactTypes';
import {
	FiberNode,
	createFiberFromElement,
	createWorkInProgress
} from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { HostText } from './workTags';
import { ChildDeletion, Placement } from './fiberFlags';
/**
 * 这个函数的主要作用是根据父节点和
 * @param shouldTrackEffects mount流程的时候不需要标记所有节点，只标记root节点进行一次placement操作即可
 * @returns
 */
function ChildReconciler(shouldTrackEffects: boolean) {
	return function reconcileChildren(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) {
		/**
		 * 用来删除子节点，主要做了两件事，一个是添加ChildDeletion flag，另一个是在FiberNode的deletions中添加需要被删除的节点
		 * @param returnFiber
		 * @param childToDelete
		 * @returns
		 */
		function deleteChild(returnFiber: FiberNode, childToDelete: FiberNode) {
			if (!shouldTrackEffects) {
				return;
			}
			const deletions = returnFiber.deletions;
			if (deletions === null) {
				returnFiber.deletions = [childToDelete];
				returnFiber.flags |= ChildDeletion;
			} else {
				// 在删除第一个节点的时候，已经标注了ChildDeletion，所以此处不需要再次添加
				deletions.push(childToDelete);
			}
		}
		/**
		 *
		 * @param returnFiber 父fiber
		 * @param currentFiber 之前渲染的fiber，即现在屏幕上的fiber
		 * @param element 需要被添加的reactElement
		 * @returns
		 */
		function reconcileSingleElement(
			returnFiber: FiberNode,
			currentFiber: FiberNode | null,
			element: ReactElementType
		) {
			// 说明element类型错误
			if (element.$$typeof !== REACT_ELEMENT_TYPE) {
				throw Error('elementype错误');
			}
			// 说明是更新流程
			if (currentFiber !== null) {
				if (
					currentFiber.key === element.key &&
					currentFiber.type === element.type
				) {
					// key相同且type相同，说明可以复用之前的节点
					const cloneFiber = usePreFiber(currentFiber, element.props);
					cloneFiber.return = returnFiber;
					return cloneFiber;
				} else {
					// 不可以复用的情况，需要删除旧的节点
					deleteChild(returnFiber, currentFiber);
				}
			}
			// 根据element创建一个fiber
			const fiber = createFiberFromElement(element);
			fiber.return = returnFiber;
			return fiber;
		}
		function reconcileSingleTextNode(
			returnFiber: FiberNode,
			currentFiber: FiberNode | null,
			content: string | number
		) {
			// update流程
			if (currentFiber !== null) {
				if (currentFiber.tag === HostText) {
					// 类型没有变化，说明可以复用
					const existing = usePreFiber(currentFiber, { content });
					existing.return = returnFiber;
					return existing;
				} else {
					// 不可复用则删除节点
					deleteChild(returnFiber, currentFiber);
				}
			}
			// 当update不可复用或者mount时根据element创建一个fiber
			const fiber = new FiberNode(HostText, { content }, null);
			fiber.return = returnFiber;
			return fiber;
		}

		function placeSingleChild(fiber: FiberNode) {
			if (shouldTrackEffects && fiber.alternate === null) {
				fiber.flags = Placement;
			}
			return fiber;
		}
		if (typeof newChild === 'object' && newChild !== null) {
			switch (newChild?.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiber, newChild)
					);
				default:
					if (__DEV__) {
						console.warn('未实现的reconcile类型', newChild);
					}
					break;
			}
		}
		if (typeof newChild === 'string' || typeof newChild === 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiber, newChild)
			);
		}
		if (__DEV__) {
			console.warn('未实现的reconcile类型', newChild);
		}
		return null;
	};
}
/**
 * 复用之前的节点，在之前节点的alternate上添加一个clone的节点，这两者互为alternate
 * @param fiber
 * @param pendingProps
 * @returns
 */
function usePreFiber(fiber: FiberNode, pendingProps: Props) {
	const clone = createWorkInProgress(fiber, pendingProps);
	clone.index = 0;
	clone.sibling = null;
	return clone;
}

export const reconcileChildFibers = ChildReconciler(true);
export const mountChildFibers = ChildReconciler(false);
