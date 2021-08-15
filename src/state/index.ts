import { createStore } from 'redux'
import rootReducer, { RootState } from './reducers'
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';

const persistConfig = {
    key: 'root',
    storage: storage,
    blacklist: [],
    stateReconciler: autoMergeLevel2
};

//@ts-ignore
const pReducer = persistReducer<RootState>(persistConfig, rootReducer);

const storeExport = createStore(
    pReducer,
    composeWithDevTools(
        //applyMiddleware(sagaMiddleware),
    )
);

//sagaMiddleware.run(rootSaga);

export const store = storeExport;
export const persistor = persistStore(storeExport);

export default store;