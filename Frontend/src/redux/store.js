import { configureStore } from "@reduxjs/toolkit";

import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import persistReducer from "redux-persist/es/persistReducer";
import rootReducer from "./rootReducer";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["auth", "compare", "cart", "wishlist", "cartCount"]
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
})

const persistor = persistStore(store)

export {store, persistor};