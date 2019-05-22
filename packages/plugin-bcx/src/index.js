import {
    Plugin,
    SocketService,
    WALLET_METHODS,
    Blockchains,
    PluginTypes
} from 'cocosjs-core';
import Cocosjs from 'cocosjs-core'
const proxy = (dummy, handler) => new Proxy(dummy, handler);

let socketService = SocketService;
export default class CocosBcx extends Plugin {

    constructor() {
        super(Blockchains.COCOSBCX, PluginTypes.BLOCKCHAIN_SUPPORT)
    }

    setSocketService(_s) {
        socketService = _s;
    }

    hookProvider() {
        throw new Error('cocos hook provider not enabled yet.');
    }

    signatureProvider(...args) {
        const throwIfNoIdentity = args[0];
        return (_bcx) => {
            // throwIfNoIdentity(
            return proxy(_bcx, {
                get(instance, method) {
                    if (typeof instance[method] === 'function') return (...args) => {
                        if (Cocosjs.cocos.isExtension) return instance[method](...args)
                        if (method === WALLET_METHODS.transferAsset) {
                            // return new Promise(resolve => {
                            //     resolve(CocosBcx.methods()[WALLET_METHODS.transferAsset](...args))
                            // })
                            return new Promise((resolve, reject) => {
                                CocosBcx.methods()[WALLET_METHODS.transferAsset](...args).then(res => {
                                    return resolve(res)
                                }).catch(err => {
                                    return reject(err)
                                })
                            })
                        }
                        if (method === WALLET_METHODS.callContractFunction) {
                            // return new Promise(resolve => {
                            //     resolve(CocosBcx.methods()[WALLET_METHODS.callContractFunction](...args))
                            // })
                            return new Promise((resolve, reject) => {
                                CocosBcx.methods()[WALLET_METHODS.callContractFunction](...args).then(res => {
                                    return resolve(res)
                                }).catch(err => {
                                    return reject(err)
                                })
                            })
                        }
                        return instance[method](...args)
                    };
                    else return instance[method];

                }
            });
        }
    }

    static methods() {
        return {
            [WALLET_METHODS.transferAsset]: (args) => socketService.sendApiRequest({
                type: 'requestTransfer',
                payload: args
            }),
            [WALLET_METHODS.callContractFunction]: (args) => socketService.sendApiRequest({
                type: 'callContractFunction',
                payload: args
            })
        }
    }
}

if (typeof window !== 'undefined') {
    window.CocosBcx = CocosBcx;
}