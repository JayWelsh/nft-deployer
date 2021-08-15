interface IShowLeftMenu {
    type: string;
    visible: boolean;
}
const showLeftMenu = (state = false, action: IShowLeftMenu) => {
    switch (action.type) {
        case 'SHOW_LEFT_MENU':
            return action.visible
        default:
            return state
    }
}

export default showLeftMenu;