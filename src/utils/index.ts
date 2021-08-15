import { createBrowserHistory, createHashHistory } from 'history';

export function configureHistory() {
	return window.matchMedia('(display-mode: standalone)').matches
		? createHashHistory()
		: createBrowserHistory()
}

export const getEtherscanLink = (hash : string, type : string, chainId : number) => {
	let baseURL = 'https://etherscan.io';
	switch(chainId) {
		case 3:
			baseURL = 'https://ropsten.etherscan.io'
			break;
		case 42:
			baseURL = 'https://kovan.etherscan.io'
			break;
		case 4:
			baseURL = 'https://rinkeby.etherscan.io'
			break;
		case 5:
			baseURL = 'https://goerli.etherscan.io'
			break;
	}
	if(type === 'tx') {
		return `${baseURL}/tx/${hash}`
	}else if(type === 'address') {
		return `${baseURL}/address/${hash}`
	}
	console.error('getEtherscanLink should be provided either "tx" or "address" as the type')
	return undefined;
}