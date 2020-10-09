//key
//sd - self described
/**
 * @authored by Kaybarax
 * Twitter @_ https://twitter.com/Kaybarax
 * Github @_ https://github.com/Kaybarax
 * LinkedIn @_ https://linkedin.com/in/kaybarax
 */

import {observable, toJS} from 'mobx';
import {persistedStoreFromAsyncStorage} from './store-utils';
import StoreProviders from './stores-providers';
import {MobX_StoreKey_Identifier_In_AsyncStorage} from './actions-and-stores-data';
import {isNullUndefined} from '../util/util';

/**
 * sd _ Kaybarax
 */
export default class AppStores {

  constructor() {
    this.stores = null;
    this.appStoresLoaded = false;
  }

  //to assist with differentiation during storage to persistence media,
  // if application uses several stores classes
  static namespace = 'AppStores_' + MobX_StoreKey_Identifier_In_AsyncStorage;

  loadAppStores = async () => {

    try {

      this.stores = {};
      this.appStoresLoaded = false;

      for (let key in StoreProviders) {
        let storeKey = StoreProviders[key].storeKey(AppStores.namespace);
        let storeProvider = StoreProviders[key];
        let store = await persistedStoreFromAsyncStorage(storeKey, storeProvider, AppStores.namespace);
        isNullUndefined(store) && (store = storeProvider.storeProvider(AppStores.namespace));
        this.stores[key] = observable(store);
        console.log('CREATED STORE -> ', key, ' -> ', toJS(this.stores[key]));
      }

      this.appStoresLoaded = true;

    } catch (err) {

      console.log('loadAppStores err', err);

      //create brand new stores

      this.stores = {};
      this.appStoresLoaded = false;

      for (let key in StoreProviders) {
        let storeProvider = StoreProviders[key];
        let store = storeProvider.storeProvider(AppStores.namespace);
        this.stores[key] = observable(store);
        console.log('CREATED STORE -> ', key, ' -> ', toJS(this.stores[key]));
      }

      this.appStoresLoaded = true;

    }

  };

}
