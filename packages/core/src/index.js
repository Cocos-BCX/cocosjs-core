import PluginRepository from './plugins/PluginRepository';
import SocketService from './services/SocketService';
import Plugin from './plugins/Plugin';
import * as PluginTypes from './plugins/PluginTypes';
import {
	Blockchains
} from './models/Blockchains';
import Network from './models/Network';
import WalletInterface, {
	WALLET_METHODS
} from './models/WalletInterface';
import Desktop from "./wallets/Desktop";
import Extension from "./wallets/Extension";
import Token from "./models/Token";

let origin;

const EVENTS = {
	Disconnected: 'dced',
	LoggedOut: 'logout',
};

let socketService = SocketService;
let socketSetters = [];
let holderFns = {};
class Index {

	constructor() {
		this.account_name = null;
		this.network = null;

		PluginRepository.loadPlugin(new Desktop(this, holderFns));
		PluginRepository.loadPlugin(new Extension(this, holderFns));
	}

	loadPlugin(plugin) {
		const noIdFunc = () => {
			if (!holderFns.get().account_name) throw new Error('No Identity')
		};
		if (!plugin.isValid()) throw new Error(`${plugin.name} doesn't seem to be a valid CocosJS plugin.`);

		PluginRepository.loadPlugin(plugin);

		if (plugin.type === PluginTypes.BLOCKCHAIN_SUPPORT) {
			this[plugin.name] = plugin.signatureProvider(noIdFunc, () => holderFns.get().account_name);
			this[plugin.name + 'Hook'] = plugin.hookProvider;
			socketSetters.push(plugin.setSocketService);
		}

		if (plugin.type === PluginTypes.WALLET_SUPPORT) {
			plugin.init(this, holderFns, socketSetters);
		}
	}

	async connect(pluginName, options) {
		if (!options) options = {};
		this.network = options.hasOwnProperty('network') ? options.network : null;
		const wallets = PluginRepository.wallets();
		return await Promise.race(wallets.map(wallet => {
			return wallet.connect(pluginName, options).then(async () => {
				if (typeof wallet.runBeforeInterfacing === 'function') await wallet.runBeforeInterfacing();
				new WalletInterface(wallet.name, wallet.methods(), holderFns.get());
				if (typeof wallet.runAfterInterfacing === 'function') await wallet.runAfterInterfacing();
				WalletInterface.bindBasics(holderFns.get());
				return true;
			})
		}).concat(new Promise(r => setTimeout(() => r(false), options.initTimeout || 5000))));

	}
}


class Holder {
	constructor(_cocos) {
		this.cocos = _cocos;
	}

	plugins(...plugins) {
		if (!this.cocos.isExtension) {
			plugins.map(plugin => this.cocos.loadPlugin(plugin));
		}
	}

	connect(...params) {
		return this.cocos.connect(...params);
	}

	catchAll(...params) {

	}
}


let holder = new Proxy(new Holder(new Index()), {
	get(target, name) {
		if (typeof target[name] !== 'undefined') return target[name];
		return target.cocos[name];
	}
});
holderFns.set = s => holder.cocos = s;
holderFns.get = () => holder.cocos;
if (typeof window !== 'undefined') window.CocosJS = holder;


holder.Plugin = Plugin;
holder.PluginTypes = PluginTypes;
holder.Blockchains = Blockchains;
holder.Network = Network;
holder.Token = Token;
holder.SocketService = SocketService;
holder.EVENTS = EVENTS;
holder.WalletInterface = WalletInterface;
holder.WALLET_METHODS = WALLET_METHODS;
export {
	Plugin,
	PluginTypes,
	Blockchains,
	Network,
	SocketService,
	EVENTS,
	WalletInterface,
	WALLET_METHODS
};
export default holder;