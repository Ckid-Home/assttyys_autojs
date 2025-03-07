const CommonConfig = [{
	desc: '通用配置',
	config: [
		{
			name: 'loopDelay',
			desc: '循环延时',
			type: 'integer',
			default: 200,
			value: null,
		},
		{
			name: 'afterClickDelayBase',
			desc: '点击后延时基数',
			type: 'integer',
			default: 0,
			value: null,
		},
		{
			name: 'afterClickDelayRandom',
			desc: '点击后延时随机数',
			type: 'integer',
			default: 200,
			value: null,
		},
		{
			name: 'colorSimilar',
			desc: '多点比色相似度(%)',
			type: 'integer',
			default: 93,
			value: null,
		},
		{
			name: 'multiColorSimilar',
			desc: '多点找色相似度(%)',
			type: 'integer',
			default: 97,
			value: null,
		}
	]
}];

export default CommonConfig;

export const commonConfigVal = CommonConfig[0].config.reduce((acc, cur) => {
	acc[cur.name] = cur.default;
	return acc;
}, {});