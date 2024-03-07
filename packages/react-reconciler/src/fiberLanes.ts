import { FiberRootNode } from './fiber';

export type Lane = number;
export type Lanes = number;

export const SyncLane = 0b0001;
export const NoLane = 0b0000;
export const NoLanes = 0b0000;
/**
 * 合并lane
 * @param laneA
 * @param laneB
 * @returns
 */
export function mergeLanes(laneA: Lane, laneB: Lane): Lanes {
	return laneA | laneB;
}
/**
 * 获取SyncLane
 * @returns
 */
export function requestUpdateLane() {
	return SyncLane;
}
/**
 * 获取最高优先级的lane，用于获取x的二进制表示中最低位的1所对应的值
 * @param lanes
 * @returns
 */
export function getHighestPriorityLane(lanes: Lanes): Lane {
	return lanes & -lanes;
}
/**
 * 在完成任务后清除lane
 * @param root
 * @param lane
 */
export function markRootFinished(root: FiberRootNode, lane: Lane) {
	root.pendingLanes &= ~lane;
}
