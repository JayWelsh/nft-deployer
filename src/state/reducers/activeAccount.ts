interface ISetActiveAccount {
    type: string;
    account: string;
}

const setActiveAccount = (state = false, action: ISetActiveAccount) => {
    switch (action.type) {
        case 'SET_ACTIVE_ACCOUNT':
            return action.account
        default:
            return state
    }
}

export default setActiveAccount;