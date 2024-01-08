import { IFuncOrigin, IFuncOperatorOrigin } from '@/interface/IFunc';
// const normal = -1; //定义常量
const left = 0;
const center = 1;
const right = 2;

export class Func501 implements IFuncOrigin {
	id = 501;
	name = '打开BUFF界面';
	desc = '支持从探索地图、庭院、组队打开buff界面';
	operator: IFuncOperatorOrigin[] = [{
		// 探索地图打开buff界面
		desc: '探索地图界面',
		oper: [
			[center, 1280, 720, 428, 24, 453, 65, 1500],
		]
	}, {
		// 庭院
		desc: [1280, 720,
			[
				[left, 327, 45, 0x7a5825],
				[right, 1156, 37, 0xd7b28a],
				[right, 1229, 48, 0xcfa676],
				[right, 1228, 650, 0xd6c6c3],
				[center, 337, 72, 0x765828]
			]
		],
		oper: [
			[center, 1280, 720, 359, 45, 396, 74, 1500]
		]
	}, {
		// 组队界面
		desc: [1280, 720,
			[[center, 642, 3, 0x101011],
				[left, 42, 38, 0xf7e8aa],
				[center, 641, 52, 0x080c0a],
				[center, 648, 571, 0x422c29]]
		],
		oper: [
			[center, 1280, 720, 799, 38, 828, 76, 1500]
		]
	}]
}