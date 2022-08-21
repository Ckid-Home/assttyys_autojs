import {
	setCurrentScheme
} from '@/common/tool';

const left = 0;
const center = 1;
const right = 2;

export default {
	id: 52,
	name: '悬赏_庭院打开悬赏界面',
	desc: '用于其他方案转悬赏方案中转，如金币妖怪转悬赏',
	checked: false,
	config: [{
		desc: '结束后切换方案',
		config: [{
			name: 'scheme_switch_enabled',
			desc: '是否启用',
			type: 'switch',
			default: true,
		}, {
			name: 'next_scheme',
			desc: '下一个方案',
			type: 'scheme',
			default: '悬赏',
		}]
	}],
	operator: [{
		// 庭院
		desc: [1280, 720,
			[
				[left, 420, 33, 0xf8ce7b],
				[left, 419, 87, 0xf48255],
				[left, 400, 59, 0xf7b069],
				[left, 440, 63, 0xf7aa67],
				[right, 1155, 36, 0xd7b28a],
				[right, 1236, 51, 0xcaa073],
			]
		],
		oper: [
			[center, 1280, 720, 20, 20, 20, 20, 800]
		]
	}, {
		// 悬赏界面
		desc: [1280, 720,
			[
				[left, 116, 67, 0x3d3c42],
				[left, 114, 88, 0x634624],
				[center, 365, 85, 0x4f3928],
				[center, 640, 50, 0x7a5930],
				[right, 1022, 87, 0x4b3826],
				[right, 1156, 81, 0x583f27]
			]
		],
		oper: [
			[left, 1280, 720, 1120, 587, 1180, 645, 1000]
		]
	}],
	operatorFunc(thisScript, thisOperator) {
		if (thisScript.oper({
				name: '悬赏_庭院界面',
				operator: [{
					desc: thisOperator[0].desc
				}]
			})) {
			const point = thisScript.findMultiColor('悬赏_庭院检测悬赏图标') || null;
			if (point !== null) {
				thisScript.helperBridge.regionClick([
					[point.x, point.y, point.x + thisOperator[0].oper[0][2], point.y + thisOperator[0].oper[0][3], 1000]
				], thisScript.scheme.commonConfig.afterClickDelayRandom);
				return true
			} else {
				return false
			}
		} else {
			if (thisScript.oper({
					name: '悬赏_悬赏界面',
					operator: [{
						desc: thisOperator[1].desc
					}]
				})) {
				const thisconf = thisScript.scheme.config['52'];
				if (thisconf && thisconf.scheme_switch_enabled) {
					setCurrentScheme(thisconf.next_scheme);
					toastLog(`切换方案为[${thisconf.next_scheme}]`);
					thisScript.rerun();
				} else {
					return false
				}
			}
			return false
		}
	}
}