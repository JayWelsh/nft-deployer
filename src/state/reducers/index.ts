import {combineReducers} from 'redux';
import showLeftMenu from './showLeftMenu';
import activeAccount from './activeAccount';
import darkMode from './darkMode'

const rootReducer = combineReducers({
    showLeftMenu,
    activeAccount,
    darkMode,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;