import * as PluginTypes from "../plugins/PluginTypes";
import Plugin from "../plugins/Plugin";
import {
	Blockchains
} from "../models/Blockchains";
import {
	WALLET_METHODS
} from "../models/WalletInterface";


let isAvailable = false;
const getIsAvailable = () => {
	if (typeof window !== 'undefined' && typeof document !== 'undefined') {
		if ((typeof window.BcxWeb !== 'undefined' && typeof window.BcxWeb.BCX !== 'undefined') || (typeof window.BcxWeb !== 'undefined' && typeof window.BcxWeb.getAccountInfo() !== 'undefined')) isAvailable = true;
		else document.addEventListener('cocosLoaded', () => isAvailable = true);
	}
}

const pollExistence = async (resolver = null, tries = 0) => {
	return new Promise(r => {
		if (!resolver) resolver = r;
		if (isAvailable) return resolver(true);
		if (tries > 5) return resolver(false);
		setTimeout(() => pollExistence(resolver, tries + 1), 100);
	})
};

export default class Extension extends Plugin {

	constructor(context, holderFns) {
		super(Blockchains.COCOSBCX, PluginTypes.WALLET_SUPPORT);
		this.name = 'CocosExtension';
		this.context = context;
		this.holderFns = holderFns;
	}

	connect() {
		getIsAvailable()
		return new Promise(async resolve => {
			const found = await pollExistence();
			if (found) {
				if (!this.holderFns.get().wallet) this.holderFns.get().wallet = this.name;
				resolve(true);
			}
		})
	}

	async runBeforeInterfacing() {

		let cocos
		if (this.holderFns.get().wallet === this.name) {
			window.BcxWeb.wallet = this.name;
			cocos = this.holderFns.get()
			if (typeof window.BcxWeb !== 'undefined') cocos.cocosBcx = () => window.BcxWeb;
			else if (typeof window.BcxWeb !== 'undefined' && typeof window.BcxWeb.getAccountInfo() !== 'undefined') cocos.cocosBcx = () => window.BcxWeb;
		}

		this.holderFns.set(cocos);
		this.context = this.holderFns.get();

		return true;
	}

	async runAfterInterfacing() {
		this.context.isExtension = true;
		return true;
	}

	methods() {
		return {
			[WALLET_METHODS.getIdentity]: (requiredFields) => {
				console.log('getid')
			},
		};
	}

}