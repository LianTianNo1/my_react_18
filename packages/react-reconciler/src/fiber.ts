import { Key, Props, Ref } from 'shared/ReactTypes';
import { workTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
export class FiberNode {
	type: any;
	tag: workTag;
	pendingProps: Props;
	memoizedProps: null | Props;
	key: Key;
	stateNode: any;
	ref: Ref;
	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;
	alternate: FiberNode | null;
	flags: Flags;

	constructor(tag: workTag, pendingProps: Props, key: Key) {
		this.tag = tag;
		this.key = key;
		this.stateNode = null;
		this.type = null;
		this.ref = null;
		// 构成树状结构
		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;
		// 作为工作单元
		this.pendingProps = pendingProps;
		this.memoizedProps = null;

		this.alternate = null;
		// 宿主dom更新状态
		this.flags = NoFlags;
	}
}
