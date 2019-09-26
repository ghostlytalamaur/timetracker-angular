const APP_KEY = 'TIME_TRACKER.';

export class LocalStorageService {

  static loadState(feature: string, initialState: any): object {
    feature = `${APP_KEY}${feature}`;
    return Object.keys(localStorage).reduce((state: any, key: string) => {
      if (key.startsWith(feature)) {
        const value = localStorage.getItem(key);
        if (!value) {
          return state;
        }

        const keys = key
          .replace(APP_KEY, '')
          .toLowerCase()
          .split('.');

        state = { ...state };
        let curState = state;
        for (let i = 0; i < keys.length - 1; i++) {
          const keyData = curState[keys[i]];
          if (keyData) {
            curState[keys[i]] = { ...keyData };
          } else {
            curState[keys[i]] = {};
          }
          curState = curState[keys[i]];
        }

        curState[keys[keys.length - 1]] = { ...curState[keys[keys.length - 1]], ...JSON.parse(value) };
      }
      return state;
    }, initialState);
  }

  static setItem(feature: string, key: string, value: any) {
    localStorage.setItem(`${APP_KEY}${feature}.${key}`, JSON.stringify(value));
  }

}
