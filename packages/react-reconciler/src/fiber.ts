import {
	ElementType,
	Key,
	Props,
	ReactElementType,
	Ref
} from 'shared/ReactTypes';
import {
	Fragment,
	FunctionComponent,
	HostComponent,
	WorkTag
} from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'react-dom/src/hostConfig';
import { UpdateQueue } from './updateQueue';

/**
 * `FiberNode` 类代表了React Fiber架构中的一个节点。
 * 每个Fiber节点代表了一个工作单元，用于跟踪组件的状态和控制更新过程。
 */
export class FiberNode {
	/**
	 * 组件类型，可能是类组件或函数组件。
	 */
	type: any;

	/**
	 * Fiber节点的标签，表示不同类型的工作（如类组件、函数组件等）。
	 */
	tag: WorkTag;

	/**
	 * 即将应用于Fiber节点的属性。
	 */
	pendingProps: Props;

	/**
	 * 上一次渲染使用的属性。
	 */
	memoizedProps: null | Props;

	/**
	 * 组件的key，用于在重渲染时优化性能。
	 */
	key: Key;

	/**
	 * 组件的实际实例或DOM节点。
	 */
	stateNode: any;

	/**
	 * 组件引用。
	 */
	ref: Ref;

	/**
	 * 父Fiber节点。
	 */
	return: FiberNode | null;

	/**
	 * 同级别的下一个Fiber节点。
	 */
	sibling: FiberNode | null;

	/**
	 * 子Fiber节点。
	 */
	child: FiberNode | null;

	/**
	 * 子树中Fiber节点的索引。
	 */
	index: number;

	/**
	 * 该Fiber节点在工作过程中的替代节点。
	 */
	alternate: FiberNode | null;

	/**
	 * 表示Fiber节点及其子树上的副作用标记。
	 */
	flags: Flags;

	/**
	 * 表示子树上的副作用标记。
	 */
	subtreeFlag: Flags;

	/**
	 * 更新队列，用于记录组件状态的更新。
	 */
	updateQueue: UpdateQueue<any> | null;

	/**
	 * 缓存的组件状态(对于HostRoot fiber存放对应的reactElement，对于FC存放对应的hooks集合)。
	 */
	memoizedState: any;

	/**
	 * 需要删除的子Fiber节点数组。
	 */
	deletions: FiberNode[] | null;

	/**
	 * 构造一个新的Fiber节点。
	 * @param tag 节点的类型标签。
	 * @param pendingProps 即将应用的属性。
	 * @param key 组件的key。
	 */
	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		this.tag = tag;
		this.key = key || null;
		this.stateNode = null;
		this.type = null;
		this.ref = null;

		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		this.pendingProps = pendingProps;
		this.memoizedProps = null;

		this.alternate = null;

		this.flags = NoFlags;
		this.subtreeFlag = NoFlags;
		this.updateQueue = null;
		this.deletions = null;
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null;

	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}
/**
 * 双缓存机制的关键，其实对于每一个fiber节点，无论怎么变化，始终只创建了两个FiberNode，且两者的alternate互为对方节点，每次更新就是两者之间的切换和属性重置
 * @param current
 * @param pendingProps
 * @returns
 */
export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;
	if (wip === null) {
		// mount的时候由于还不存缓存，所以需要创建一个新节点，并且复用current身上属性
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.type = current.type;
		wip.stateNode = current.stateNode;
		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update 由于之前wip有可能被使用过，所以需要进行属性的重置
		wip.pendingProps = pendingProps;
		wip.flags = NoFlags;
		wip.subtreeFlag = NoFlags;
		wip.deletions = null;
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;
	return wip;
};

export function createFiberFromElement(element: ReactElementType) {
	const { type, key, props } = element;
	let fiberTag: WorkTag = FunctionComponent;
	if (typeof type === 'string') {
		fiberTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('未定义的type类型', element);
	}
	const fiber = new FiberNode(fiberTag, props, key);
	fiber.type = type;
	return fiber;
}
export function createFiberFromFragment(elements: any[], key: Key): FiberNode {
	const fiber = new FiberNode(Fragment, elements, key);
	return fiber;
}
