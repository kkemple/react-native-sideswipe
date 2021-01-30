import { AsyncStorage } from 'react-native';

const CACHE = '@POKEDEX:urql_cache';

const getCache = async () => {
  const cacheJson = await AsyncStorage.getItem(CACHE);
  return cacheJson ? JSON.parse(cacheJson) : {};
};

const setCache = newCache => {
  return AsyncStorage.mergeItem(CACHE, JSON.stringify(newCache));
};

const deleteCache = () => {
  return AsyncStorage.removeItem(CACHE);
};

export default {
  invalidate: async hash => {
    try {
      const cache = await getCache();
      delete cache[hash];
      await setCache(cache);
    } catch (error) {
      console.error(error);
    }
  },
  invalidateAll: async () => {
    try {
      await deleteCache();
    } catch (error) {
      console.error(error);
    }
  },
  read: async hash => {
    try {
      const cache = await getCache();
      return cache[hash] || null;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
  update: async callback => {
    try {
      if (typeof callback === 'function') {
        const cache = await getCache();
        Object.keys(cache).map(key => {
          callback(cache, key, cache[key]);
        });
        await setCache(cache);
      }
    } catch (error) {
      console.error(error);
    }
  },
  write: async (hash, data) => {
    try {
      const cache = await getCache();
      cache[hash] = data;
      await setCache(cache);
    } catch (error) {
      console.error(error);
    }
  },
};
