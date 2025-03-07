import { IFuncOrigin, IFuncOperatorOrigin, IFuncOperator } from '@/interface/IFunc';
import { Script } from '@/system/script';

// const normal = -1; //定义常量
const left = 0;
const center = 1;
const right = 2;

export class Func507 implements IFuncOrigin {
	id = 507;
	name = '狩猎战_挑战';
	operator: IFuncOperatorOrigin[] = [{ // 检测_是否为挑战奉献榜场景_待开始
		desc: [1280, 720,
			[
				[right, 1104, 568, 0xd7bfa5],
				[right, 1175, 600, 0xdfc29d],
				[right, 1122, 697, 0x5b0d07],
				[right, 1086, 615, 0x272420],
				[right, 1068, 593, 0xdec7aa]
			]
		],
		oper: [
			[right, 1280, 720, 1073, 568, 1171, 646, 1000]  // 进入鬼王挑战页
		]
	}, {	// 检测_挑战是否可用
		desc: [1280, 720,
			[
				[left, 64, 482, 0x291522],
				[left, 33, 38, 0xd7c5a2],
				[left, 109, 24, 0xd7c5a2],
				[left, 179, 37, 0xd7c6a5],
				[center, 634, 624, 0x4c2a26],
				[center, 708, 35, 0x2a2237],
				[right, 1144, 692, 0xf2d59f],
			]
		],
		oper: [
			[right, 1280, 720, 1138, 561, 1218, 641, 1000]
		]
	}, {	// 检测_挑战奉献榜场景_已结束
		desc: [1280, 720,
			[
				[right, 1000, 648, 0xd42c23],
				[right, 983, 627, 0x000000],
				[right, 995, 671, 0x2d1c1c],
				[right, 1095, 640, 0xf0d09e],
				[right, 1155, 640, 0xe7c182],
				[right, 1128, 620, 0x272420],
				[right, 1080, 595, 0x272420],
				[right, 1157, 595, 0x272420]
			]
		],
		oper: [
			[right, 1280, 720, 1166, 52, 1200, 86, 2200],
			[left, 1280, 720, 58, 43, 96, 82, 2200]
		]
	},
	{	// 检测_狩猎战是否有酒瓶
		desc: [1280, 720,
			[
				[left, 64, 482, 0x291522],
				[left, 33, 38, 0xd7c5a2],
				[left, 109, 24, 0xd7c5a2],
				[left, 179, 37, 0xd7c6a5],
				[center, 634, 624, 0x4c2a26],
				[center, 708, 35, 0x2a2237],
				[right, 1144, 692, 0xd8d8d8],
			]
		]
	},
	{	// 检测_狩猎战关闭酒瓶奖励
		desc: [
			1280, 720,
			[
				[right, 1131, 593, 0x393939],
				[center, 853, 241, 0x382a1c],
				[center, 801, 362, 0xcbb59e],
				[center, 368, 388, 0x906b41],
				[center, 576, 42, 0x0c0a12],
			]
		],
		oper: [
			[center, 1280, 720, 448, 488, 894, 574, 1200],
		]
	}, {
		// 狩猎战 鬼王来袭 右下角点击集结中
		desc: [
			1280, 720,
			[
				[left, 70, 60, 0xc2cbe0],
				[center, 640, 34, 0x4f5d7f],
				[center, 716, 25, 0xe3d395],
				[center, 624, 55, 0x888ca3],
				[left, 91, 88, 0x231c3a],
			]
		],
		oper: [
			[center, 1280, 720, 1068, 606, 1265, 695, 1000],
		]
	}];
	operatorFunc(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
		// const thisconf = thisScript.scheme.config['507'];

		if (thisScript.oper({
			name: '检测_是否为挑战奉献榜场景_待开始',
			operator: [thisOperator[0]]
		})) {
			return true;
		}

		if (thisScript.oper({
			name: '检测_挑战是否可用',
			operator: [thisOperator[1]]
		})) {
			return true;
		}

		if (thisScript.oper({
			name: '狩猎战_鬼王来袭_右下角点击集结中',
			operator: [thisOperator[5]]
		})) {
			return true;
		}

		if (thisScript.oper({
			name: '检测_是否有酒瓶',
			operator: [thisOperator[3]]
		})) {
			const point = thisScript.findMultiColor('狩猎_酒瓶');

			if (point) {
				console.log('查找酒瓶结界成功');
				const oper = [[
					point.x - 5,
					point.y - 5,
					point.x + 5,
					point.y + 5,
					1200
				]];
				thisScript.regionClick(oper);
				return true;
			}
			return false;
		}

		if (thisScript.oper({
			name: '检测_是否领取酒瓶奖励页',
			operator: [thisOperator[4]]
		})) {
			return true;
		}

		if (thisScript.oper({
			name: '检测_挑战奉献榜场景_已结束',
			operator: [thisOperator[2]]
		})) {

			if (thisScript.runtimeParams && thisScript.runtimeParams.liao_activity_state) {
				thisScript.runtimeParams.liao_activity_state['hunt'] = true;

				const next_scheme = '返回庭院';
				thisScript.rerun(next_scheme as string, {
					next_scheme_name: '庭院进入寮每日活动',
					liao_activity_state: thisScript.runtimeParams.liao_activity_state
				});
			} else {
				const next_scheme = '返回庭院';
				thisScript.rerun(next_scheme);
			}
			return true;
		}
		return false;
	}
}