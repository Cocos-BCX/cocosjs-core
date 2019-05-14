import Plugin from "../plugins/Plugin";
import {
	Blockchains
} from "../models/Blockchains";
import * as PluginTypes from "../plugins/PluginTypes";
import SocketService from "../services/SocketService";
import {
	EVENTS,
	WALLET_METHODS
} from "../index";


export default class Desktop extends Plugin {
	constructor(context, holderFns) {
		super(Blockchains.EOS, PluginTypes.WALLET_SUPPORT);
		this.name = 'CocosSockets';
		this.context = context;
		this.holderFns = holderFns;
	}

	connect(pluginName, options = {}) {
		return new Promise(resolve => {
			if (!pluginName || !pluginName.length) throw new Error("You must specify a name for this connection");
			options = Object.assign({
				initTimeout: 10000,
				linkTimeout: 30000
			}, options);


			// Tries to set up Desktop Connection
			SocketService.init(pluginName, options.linkTimeout);
			SocketService.link().then(async authenticated => {
				if (!authenticated) return false;
				this.holderFns.get().isExtension = false;
				if (!this.holderFns.get().wallet) this.holderFns.get().wallet = this.name;
				return resolve(true);
			});
		})
	}

	async runAfterInterfacing() {
		this.holderFns.get().addEventHandler((t, x) => this.eventHandler(t, x), 'internal');
		this.holderFns.get().account_name = await this.holderFns.get().getIdentityFromPermissions();
		return true;
	}

	methods() {
		const setAndReturnId = (id, forget) => {
			if (id || forget) this.holderFns.get().account_name = id;
			// if(forget) SocketService.removeAppKeys();
			return forget || id;
		};

		return {
			[WALLET_METHODS.disconnect]: () => SocketService.disconnect(),
			[WALLET_METHODS.isConnected]: () => SocketService.isConnected(),
			[WALLET_METHODS.isPaired]: () => SocketService.isPaired(),
			[WALLET_METHODS.addEventHandler]: (handler, key = null) => SocketService.addEventHandler(handler, key),
			[WALLET_METHODS.removeEventHandler]: (key = null) => SocketService.removeEventHandler(key),
			[WALLET_METHODS.listen]: (handler) => SocketService.addEventHandler(handler),
			[WALLET_METHODS.getVersion]: () => SocketService.sendApiRequest({
				type: 'getVersion',
				payload: {}
			}),
			[WALLET_METHODS.getIdentity]: (requiredFields) => SocketService.sendApiRequest({
				type: 'getOrRequestIdentity',
				payload: {
					fields: requiredFields ? requiredFields : {
						accounts: [this.holderFns.get().network]
					}
				}
			}).then(setAndReturnId),
			[WALLET_METHODS.getAccountInfo]: () => SocketService.sendApiRequest({
				type: 'getAccountInfo',
				payload: {}
			}).then(setAndReturnId),
			[WALLET_METHODS.getIdentityFromPermissions]: () => SocketService.sendApiRequest({
				type: 'identityFromPermissions',
				payload: {}
			}).then(setAndReturnId),
			[WALLET_METHODS.lockAccount]: () => SocketService.sendApiRequest({
				type: 'lockAccount',
				payload: {

				}
			}).then(setAndReturnId),
			[WALLET_METHODS.forgetIdentity]: () => SocketService.sendApiRequest({
				type: 'forgetIdentity',
				payload: {}
			}).then(res => setAndReturnId(null, res)),
			[WALLET_METHODS.updateIdentity]: ({
				name,
				kyc
			}) => SocketService.sendApiRequest({
				type: 'updateIdentity',
				payload: {
					name,
					kyc
				}
			}).then(id => id ? setAndReturnId(id) : null),
			[WALLET_METHODS.authenticate]: (nonce, data = null, publicKey = null) => SocketService.sendApiRequest({
				type: 'authenticate',
				payload: {
					nonce,
					data,
					publicKey
				}
			}),
			[WALLET_METHODS.getArbitrarySignature]: (publicKey, data) => SocketService.sendApiRequest({
				type: 'requestArbitrarySignature',
				payload: {
					publicKey,
					data
				}
			}),
			[WALLET_METHODS.getPublicKey]: (blockchain) => SocketService.sendApiRequest({
				type: 'getPublicKey',
				payload: {
					blockchain
				}
			}),
			[WALLET_METHODS.linkAccount]: (account, network) => SocketService.sendApiRequest({
				type: 'linkAccount',
				payload: {
					account,
					network: network || this.holderFns.get().network
				}
			}),
			[WALLET_METHODS.hasAccountFor]: (network) => SocketService.sendApiRequest({
				type: 'hasAccountFor',
				payload: {
					network: network || this.holderFns.get().network
				}
			}),
			[WALLET_METHODS.suggestNetwork]: (network) => SocketService.sendApiRequest({
				type: 'requestAddNetwork',
				payload: {
					network: network || this.holderFns.get().network
				}
			}),
			[WALLET_METHODS.requestTransfer]: (network, to, amount, options = {}) => SocketService.sendApiRequest({
				type: 'requestTransfer',
				payload: {
					network: network || this.holderFns.get().network,
					to,
					amount,
					options
				}
			}),
			//contract
			[WALLET_METHODS.callContractFunction]: (network, nameOrId, functionName, valueList, runTime, onlyGetFee) => SocketService.sendApiRequest({
				type: 'callContractFunction',
				payload: {
					network: network || this.holderFns.get().network,
					nameOrId,
					functionName,
					valueList,
					runTime,
					onlyGetFee,
				}
			}),
			[WALLET_METHODS.requestSignature]: (payload) => SocketService.sendApiRequest({
				type: 'requestSignature',
				payload
			}),
			[WALLET_METHODS.createTransaction]: (blockchain, actions, account, network) => SocketService.sendApiRequest({
				type: 'createTransaction',
				payload: {
					blockchain,
					actions,
					account,
					network: network || this.holderFns.get().network
				}
			}),
			[WALLET_METHODS.addToken]: (token, network) => SocketService.sendApiRequest({
				type: 'addToken',
				payload: {
					token,
					network: network || this.holderFns.get().network
				}
			}),
		}
	}

	async eventHandler(event, payload) {
		switch (event) {
			case EVENTS.Disconnected:
				this.holderFns.get().account_name = null;
				break;
			case EVENTS.LoggedOut:
				this.holderFns.get().account_name = await this.holderFns.get().getIdentityFromPermissions();
				break;
		}
	}
}