import store from '@/system/store';
import funcList from '@/common/funcList';
import helperBridge from '@/system/helperBridge';
import multiColor from '@/common/multiColors';
import { getWidthPixels, getHeightPixels } from "@auto.pro/core";
import _ from 'lodash';

var script = {
    runThread: null,
    runCallback: null,
    stopCallback: null,
    scheme: null,
    enabledFuncList: null,
    multiColor: null, // 多点找色用的，提前初始化，减轻运行中计算量
    hasRedList: false, // KeepScreen(true)时会初始化redList，如果没有初始化的话这个值为false，方便在有需要的时候初始化redlist且不重复初始化
    device: {
        width: getWidthPixels(),
        height: getHeightPixels()
    },
    keepScreen(mode) {
        helperBridge.helper.KeepScreen(mode);
        if (mode) {
            this.hasRedList = true;
        } else {
            this.hasRedList = false;
        }
    },
    initRedList() {
        if (!this.hasRedList) {
            helperBridge.helper.GetRedList();
            this.hasRedList = true;
        }
    },
    setRunCallback(callback) {
        this.runCallback = callback;
    },
    setStopCallback(callback) {
        this.stopCallback = callback;
    },
    
    // 将funcList中operator里面的desc和oper转换为适用当前正在分辨率的坐标
    initFuncList() {
        this.scheme = store.get('currentScheme', null);
        if (null === this.scheme) return;
        this.scheme.funcList = [];
        for (let i = 0; i < this.scheme.list.length; i++) {
            for (let j = 0; j < funcList.length; j++) {
                if (this.scheme.list[i] == funcList[j].id) {
                    let thisFuncList = _.cloneDeep(funcList[j]);
                    let operator = thisFuncList.operator;
                    if (operator && typeof operator !== 'function') {
                        for (let k = 0; k < operator.length; k++) {
                            if (operator[k].desc) {
                                operator[k].desc = helperBridge.helper.GetCmpColorArray(operator[k].desc[0], operator[k].desc[1], operator[k].desc[2]);
                                // for (let p = 0; p < operator[k].desc.length; p++) {
                                //     let kkk = operator[k].desc[p];
                                //     let tolog = [];
                                //     for (let q = 0; q < kkk.length; q++) {
                                //         tolog.push(kkk[q]);
                                //     }
                                //     console.log(tolog);
                                // }
                            }
                            if (operator[k].oper) {
                                operator[k].oper = helperBridge.regionClickTrans(operator[k].oper);
                            }
                        }
                    }
                    this.scheme.funcList.push(thisFuncList);
                }
            }
        }
    },
    initMultiColor() {
        let thisMultiColor = {};
        for (let key in multiColor) {
            thisMultiColor[key] = {
                region: [0, 0, this.device.width, this.device.height],
                desc: []
            };
            for (let desc of multiColor[key].desc) {
                thisMultiColor[key].desc.push(this.helperBridge.helper.GetFindColorArray(desc[0], desc[1], desc[2]));
            }
            if (multiColor[key].region) {
                let sr  = this.helperBridge.helper.GetPoint(multiColor[key].region[1], multiColor[key].region[2], multiColor[key].region[0]);
                let er  = this.helperBridge.helper.GetPoint(multiColor[key].region[3], multiColor[key].region[4], multiColor[key].region[0]);
                thisMultiColor[key].region = [sr.x, sr.y, er.x, er.y];
            }
        }
        this.multiColor = thisMultiColor;
    },
    findMultiColor(key) {
        this.initRedList();
        let region = this.multiColor[key].region;
        let desc = this.multiColor[key].desc;
        for (let item of desc) {
            let point = this.helperBridge.helper.FindMultiColor(region[0], region[1], region[2], region[3], item, this.scheme.commonConfig.multiColorSimilar, 1);
            if (point.x !== -1) {
                return point;
            }
        }
        return null;
    },
    run() {
        var self = this;
        // helperBridge放进来，funcList里面operator执行时可以从this中取到helperBridge，解决直接导入helperBridge在端报错的问题
        this.helperBridge = helperBridge;
        this.initFuncList();
        this.initMultiColor();
        if (null === this.scheme) {
            if (typeof self.stopCallback === 'function') {
                self.stopCallback();
            }
            return;
        }
        // test start
        let img = images.captureScreen();
        img.saveTo('/sdcard/testimg.png');
        img.recycle();
        // test end
        toastLog(`运行方案[${this.scheme.schemeName}]`);
        this.runThread = threads.start(function () {
            try {
                while (true) {
                    self.keepScreen(false);
                    for (let i = 0; i < self.scheme.funcList.length; i++) {
                        if (self.oper(self.scheme.funcList[i])) {
                            break;
                        }
                    }
                    sleep(self.scheme.commonConfig.loopDelay);
                }
            } catch (e) {
                self.runThread = null;
                console.log(e);
                if (typeof self.stopCallback === 'function') {
                    self.stopCallback();
                }
            }
        });
        if (typeof this.runCallback === 'function') {
            this.runCallback();
        }
    },
    stop() {
        if (null !== this.runThread) {
            this.runThread.interrupt();
            if (typeof this.stopCallback === 'function') {
                this.stopCallback();
            }
        }
        this.runThread = null;
    },
    oper(currFunc) {
        let operator = currFunc.operator; // 需要计算的坐标通过operater传进去使用
        let operatorFunc = currFunc.operatorFunc;
        if (typeof operatorFunc === 'function') {
            if (operatorFunc.call(null, this, operator)) {
                console.log('执行：' + currFunc.name);
                return true;
            }
        } else {
            for (let id = 0; id < operator.length; id++) {
                let item = operator[id];
                let rs = helperBridge.helper.CompareColorEx(item.desc, this.scheme.commonConfig.colorSimilar, 0);
                if (rs) {
                    console.log('执行：' + currFunc.name + '_' + id);
                    if (item.oper) {
                        helperBridge.regionClick(item.oper, this.scheme.commonConfig.afterClickDelayRandom);
                    }
                    return true;
                }
            }
        }
    }
}

export default script;