import { Dispatch, Dispatcher } from 'react/src/currentDispatcher';
import internals from 'shared/internals';
import { FiberNode } from './fiber';
import {
	UpdateQueue,
	createUpdate,
	createUpdateQueue,
	enqueueUpdate,
	processUpdateQueue
} from './updateQueue';
import { Action } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';
import { Lane, NoLane, requestUpdateLane } from './fiberLanes';
interface Hook {
	memoizedState: any;
	updateQueue: any;
	next: Hook | null;
}
const { currentDispatcher } = internals;
let currentlyRenderingFiber: FiberNode | null = null;
let workInProgressHook: Hook | null = null;
let currentHook: Hook | null = null;
const renderLane: Lane = NoLane;
export function renderWithHooks(wip: FiberNode, lane: Lane) {
	// 赋值当前fiber对象
	currentlyRenderingFiber = wip;
	wip.memoizedState = null;
	renderLane = lane;

	const current = wip.alternate;
	// 赋值当前Hooks集合
	if (current !== null) {
		// update
		currentDispatcher.current = HooksDispatcherOnUpdate;
	} else {
		// mount
		currentDispatcher.current = HooksDispatcherOnMount;
	}

	// 调用FC函数
	const Component = wip.type as Function;
	const props = wip.pendingProps;
	const children = Component(props);
	// 重置操作
	currentlyRenderingFiber = null;
	renderLane = NoLane;
	return children;
}

const HooksDispatcherOnMount: Dispatcher = {
	useState: mountState
};

const HooksDispatcherOnUpdate: Dispatcher = {
	useState: updateState
};

function dispatchSetState<State>(
	fiber: FiberNode,
	updateQueue: UpdateQueue<State>,
	action: Action<State>
) {
	const lane = requestUpdateLane();
	const update = createUpdate(action, lane);
	enqueueUpdate(updateQueue, update);
	scheduleUpdateOnFiber(fiber, lane);
}

function mountState<State>(
	initialState: () => State | State
): [State, Dispatch<State>] {
	const hook = mountWorkInProgressHook();
	let memoizedState;
	if (initialState instanceof Function) {
		memoizedState = initialState();
	} else {
		memoizedState = initialState;
	}
	const queue = createUpdateQueue<State>();
	hook.updateQueue = queue;
	hook.memoizedState = initialState;
	// @ts-ignore
	const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue);
	queue.dispatch = dispatch;
	return [memoizedState, dispatch];
}

function updateState<State>(): [State, Dispatch<State>] {
	const hook = updateWorkInProgressHook();

	const queue = hook.updateQueue;
	const pending = queue?.shared?.pending;
	if (pending) {
		const { memoizedState } = processUpdateQueue(hook.memoizedState, pending);
		hook.memoizedState = memoizedState;
	}
	return [hook.memoizedState, queue.dispatch as Dispatch<State>];
}

function mountWorkInProgressHook(): Hook {
	const hook: Hook = {
		memoizedState: null,
		updateQueue: null,
		next: null
	};
	// 如果是当前FC的第一个hook则绑定到memoizedState上，如果不是，则链接到当前hook的next
	if (workInProgressHook === null) {
		if (currentlyRenderingFiber == null) {
			throw new Error('请在函数组件内调用hook');
		} else {
			workInProgressHook = hook;
			currentlyRenderingFiber.memoizedState = workInProgressHook;
		}
	} else {
		workInProgressHook.next = hook;
		workInProgressHook = hook;
	}
	return workInProgressHook;
}
function updateWorkInProgressHook(): Hook {
	let nextCurrentHook: Hook | null;
	// 如果是第一个hook直接赋值currentHook，如果不是则赋值为currentHook的下一个hook
	if (currentHook === null) {
		const current = currentlyRenderingFiber?.alternate;
		if (current) {
			nextCurrentHook = current.memoizedState;
		} else {
			nextCurrentHook = null;
		}
	} else {
		nextCurrentHook = currentHook.next;
	}

	if (nextCurrentHook === null) {
		throw new Error(`请在函数顶层使用hook`);
	}

	currentHook = nextCurrentHook as Hook;

	const hook: Hook = {
		memoizedState: currentHook.memoizedState,
		updateQueue: currentHook.updateQueue,
		next: null
	};
	// 如果是当前FC的第一个hook则绑定到memoizedState上，如果不是，则链接到当前hook的next
	if (workInProgressHook === null) {
		if (currentlyRenderingFiber == null) {
			throw new Error('请在函数组件内调用hook');
		} else {
			workInProgressHook = hook;
			currentlyRenderingFiber.memoizedState = workInProgressHook;
		}
	} else {
		workInProgressHook.next = hook;
		workInProgressHook = hook;
	}
	return workInProgressHook;
}
