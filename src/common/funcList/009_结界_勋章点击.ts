import { Script } from '@/system/script';
import { IFuncOrigin, IFuncOperatorOrigin, IFuncOperator } from '@/interface/IFunc';
import { SchemeConfigOperator } from '@/interface/SchemeConfigOperator';
// const normal = -1; //定义常量
const left = 0;
// const center = 1;
// const right = 2;

export class Func009 implements IFuncOrigin {
	id = 9;
	name = '结界_勋章点击';
	desc = '在突破界面点击勋章，可配置点击勋章的优先级';
	config = [{
		desc: '',
		config: [{
			name: 'priority',
			desc: '挑战顺序',
			type: 'list',
			data: ['呱太->4->5->3->2->1->0', '呱太->5->4->3->2->1->0', '呱太->0->1->2->3->4->5'],
			default: '呱太->4->5->3->2->1->0',
			value: null,
		}, {
			name: 'auto_94',
			desc: '实行自动9退4',
			type: 'switch',
			default: false,
		}, {
			name: 'this_scheme',
			desc: '打开"自动9退4"时, 需输入当前的方案名',
			type: 'text',
			default: '个突_9退4',
		}
		]
	}];
	operator: IFuncOperatorOrigin[] = [{
		// 0 突破界面
		desc: '突破界面',
		oper: [
			[left, 1280, 720, 30, 10, 160, 80, 500],
			[left, 1280, 720, 80, 0, 40, 0, 500],
			[left, 1280, 720, 160, 492, 824, 54, 0], // 头像框 横轴坐标内
			[left, 1280, 720, 0, 0, 0, 0, 0],
		]
	}, {
		// 1 第一排第一列结界坐标
		desc: '突破界面',
		oper: [
			[left, 1280, 720, 147, 146, 465, 265, 500]
		]
	}];
	onSchemeSwitchOut(_thisScript: Script, _thisConfigOperator: SchemeConfigOperator, _nextConfigOperator: SchemeConfigOperator): void {
		const auto_94 = _thisConfigOperator.get(9, 'auto_94')
		const exitBeforeReady = _thisConfigOperator.get(0, 'exitBeforeReady')
		if (auto_94 && !exitBeforeReady) {
			_thisConfigOperator.set(1, 'exitBeforeReady', true);
			_thisConfigOperator.set(0, 'jspd_enabled_2', true);
			_thisConfigOperator.set(2, 'rechallenge', true);
			console.log('退4阶段')
		} else if (auto_94 && exitBeforeReady) {
			_thisConfigOperator.set(1, 'exitBeforeReady', false);
			_thisConfigOperator.set(0, 'jspd_enabled_2', false);
			_thisConfigOperator.set(2, 'rechallenge', false);
			console.log('打9阶段')
		}
	}
	onSchemeStop(_thisScript: Script, _thisConfigOperator: SchemeConfigOperator): void {
		_thisConfigOperator.set(1, 'exitBeforeReady', false);
		_thisConfigOperator.set(0, 'jspd_enabled_2', false);
		_thisConfigOperator.set(2, 'rechallenge', false);
		console.log('脚本停止，重置参数')
	}
	operatorFunc(thisScript: Script, thisOperator: IFuncOperator[]): boolean {
		// 读取当前0功能的退出次数,当第四次就重新修改成打9
		if (thisScript.oper({
			name: '突破界面_判断',
			operator: [{ desc: thisOperator[0].desc }]
		}, 0)) {
			const thisconf = thisScript.scheme.config['9']; // 获取配置
			const priority = String(thisconf.priority).split('->');
			const multiColorKey = [];
			for (const item of priority) {
				multiColorKey.push(`结界_${item}勋章`);
			}
			for (const key of multiColorKey) {
				const point = thisScript.findMultiColor(key);
				const add = thisOperator[0].oper[3];
				if (point) {
					const oper = [[
						point.x + thisOperator[0].oper[0][0] + add[0],
						point.y + thisOperator[0].oper[0][1] + add[1],
						point.x + thisOperator[0].oper[0][2] + add[2],
						point.y + thisOperator[0].oper[0][3] + add[3],
						thisOperator[0].oper[0][4]]];
					thisScript.regionClick(oper);
					// 第一排第一列结界坐标
					const fristFirstOper = thisOperator[1].oper[0] // [147, 146, 465, 265];
					if (Number(oper[0][0]) > fristFirstOper[0] && Number(oper[0][1]) > fristFirstOper[1] && Number(oper[0][2]) < fristFirstOper[2] && Number(oper[0][3]) < fristFirstOper[3]) {
						console.log('检测点击范围在第一排第一列结界内');
						if (thisconf && thisconf.auto_94) {
							thisScript.rerun(thisconf.this_scheme);
							sleep(3000);
							return;
						}
					}
					console.log(key);
					return true;
				}
			}
			return false;
		}
		return false;
	}
}
