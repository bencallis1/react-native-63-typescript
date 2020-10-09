//key
//sd - self described
/**
 * @authored by Kaybarax
 * Twitter @_ https://twitter.com/Kaybarax
 * Github @_ https://github.com/Kaybarax
 * LinkedIn @_ https://linkedin.com/in/kaybarax
 */

import {isNullUndefined, objectAHasSameKeysAsObjectB, objectKeyExists, stringifyObject} from '../util/util';
import {MobX_StoreKey_Identifier_In_AsyncStorage} from './actions-and-stores-data';
import AsyncStorage from '@react-native-community/async-storage';
import {
  getItemFromAsyncStorage,
  getObjectFromAsyncStorage,
  removeItemFromAsyncStorage,
  storeObjectToAsyncStorage,
} from '../util/react-native-based-utils';
import StoreProviders from './stores-providers';
import {toJS} from 'mobx';

/**
 * sd _ Kaybarax
 * @param storeKey
 * @param storeProvider
 * @param storeNamespace
 * @returns {Promise<null|*>}
 */
export const persistedStoreFromAsyncStorage = async (storeKey, storeProvider, storeNamespace) => {
  let savedStore = await getObjectFromAsyncStorage(storeKey);
  if (isNullUndefined(savedStore)) {
    return null;
  }

  //if store schema is updated, then update persisted store model
  let storeFromSchema = storeProvider.storeProvider(storeNamespace);
  let matchingKeys = objectAHasSameKeysAsObjectB(savedStore, storeFromSchema);
  if (!matchingKeys) {
    //get persisted data to updated store object
    for (let key in savedStore) {
      //if key is still there in new object model
      if (objectKeyExists(storeFromSchema, key)) {
        storeFromSchema[key] = savedStore[key];
      }
    }

    //update persisted store
    await storeObjectToAsyncStorage(storeKey, storeFromSchema);
    // and return the updated one
    return storeFromSchema;
  }

  //check for internal structural change
  let currentStoreModelStructure = await storeProvider.currentStoreModelStructure;
  if (isNullUndefined(currentStoreModelStructure)) {
    return null;
  }
  let internalStructureChanged = false;
  for (let key in storeFromSchema) {
    let fromNewStoreSchema = stringifyObject(storeFromSchema[key]);
    let fromCurrentStoreObjectStructure = stringifyObject(currentStoreModelStructure[key]);
    if (key !== 'storeName' && key !== 'storeKey' && fromNewStoreSchema !== fromCurrentStoreObjectStructure) {
      //update
      currentStoreModelStructure[key] = storeFromSchema[key];
      //override and update
      savedStore[key] = storeFromSchema[key];
      internalStructureChanged = true;
    }
  }
  if (internalStructureChanged) {
    await storeObjectToAsyncStorage(storeFromSchema.storeName, currentStoreModelStructure);
    await storeObjectToAsyncStorage(storeKey, savedStore);
  }
  return savedStore;
};

/**
 * sd _ Kaybarax
 * @param store
 */
export async function persistStoreToAsyncStorage(store) {
  console.log('persistStoreToAsyncStorage store', toJS(store));
  try {
    let storeKey = store.storeKey;
    //only persist if data has changed
    let oldStoreData = await getObjectFromAsyncStorage(storeKey);
    let newStoreData = toJS(store);
    console.log('persistStoreToAsyncStorage oldStoreData', oldStoreData);
    console.log('persistStoreToAsyncStorage newStoreData', newStoreData);
    if (stringifyObject(oldStoreData) === stringifyObject(newStoreData)) {
      return;
    }
    console.log('persistStoreToAsyncStorage DATA CHANGE FOR STORE', store.storeName);
    await storeObjectToAsyncStorage(storeKey, store);
    console.log('persistStoreToAsyncStorage storeKey', storeKey);
    //store the current store model structure, if not there already,
    //for internal structure changes monitoring and update
    let storeModelStructure = await getItemFromAsyncStorage(store.storeName);
    console.log('persistStoreToAsyncStorage storeModelStructure', storeModelStructure);
    if (isNullUndefined(storeModelStructure)) {
      let storeProvider = StoreProviders[store.storeName];
      console.log('persistStoreToAsyncStorage storeProvider', storeProvider);
      await storeObjectToAsyncStorage(store.storeName, storeProvider.storeProvider(store.namespace));
      console.log('persistStoreToAsyncStorage storeModelStructure added');
    }
    console.log('persistStoreToAsyncStorage SUCCESS');
  } catch (err) {
    console.log('persistStoreToAsyncStorage failure!!');
    console.log('Critical failure in persistence of app store!!');
  }
}

/**
 * sd _ Kaybarax
 * @param stores
 * @returns {Promise<void>}
 */
export async function persistStoresToAsyncStorage(...stores) {
  console.log('persistStoresToAsyncStorage stores', stores);
  try {
    for (let store of stores) {
      let storeKey = store.storeKey;
      //only persist if data has changed
      let oldStoreData = await getObjectFromAsyncStorage(storeKey);
      let newStoreData = toJS(store);
      console.log('persistStoresToAsyncStorage oldStoreData', oldStoreData);
      console.log('persistStoresToAsyncStorage newStoreData', newStoreData);
      if (stringifyObject(oldStoreData) === stringifyObject(newStoreData)) {
        return;
      }
      console.log('persistStoresToAsyncStorage DATA CHANGE FOR STORE', store.storeName);
      await storeObjectToAsyncStorage(storeKey, store);
      //store the current store model structure, if not there already,
      //for internal structure changes monitoring and update
      let storeModelStructure = await getItemFromAsyncStorage(store.storeName);
      console.log('persistStoresToAsyncStorage storeModelStructure', storeModelStructure);
      if (isNullUndefined(storeModelStructure)) {
        let storeProvider = StoreProviders[store.storeName];
        console.log('persistStoresToAsyncStorage storeModelStructure', storeProvider);
        await storeObjectToAsyncStorage(store.storeName, storeProvider.storeProvider(store.namespace));
        console.log('persistStoresToAsyncStorage storeModelStructure added');
      }
      console.log('persistStoreToAsyncStorage SUCCESS');
    }
  } catch (err) {
    console.log('persistStoresToAsyncStorage failure!!');
    console.log('Critical failure in persistence of app stores!!');
  }
}

/**
 * sd _ Kaybarax
 */
export async function clearAllPersistedStoresToAsyncStorage() {
  try {
    let keys = Object.keys(AsyncStorage);
    for (let key of keys) {
      let storeKey = '' + key;
      if (storeKey.includes(MobX_StoreKey_Identifier_In_AsyncStorage)) {
        await removeItemFromAsyncStorage(storeKey);
      }
    }
  } catch (e) {
    console.log('clearAllPersistedStoresToAsyncStorage failed!!');
  }
}

/**
 * sd _ Kaybarax
 * @param namespaceProvider
 * @param assignedName
 * @returns {*}
 */
export function getPersistedStoreKey(namespaceProvider, assignedName) {
  return namespaceProvider + assignedName;
}

/**
 * sd _ Kaybarax
 * @param storeName
 * @param storeSchemaInstance
 * @returns {Promise<T | *>}
 */
export function createCurrentStoreModelStructure(storeName, storeSchemaInstance) {
  return getObjectFromAsyncStorage(storeName)
      .then(item => item || storeSchemaInstance)
      .catch(error => {
        console.log('createCurrentStoreModelStructure error', error);
        return storeSchemaInstance;
      });
}
