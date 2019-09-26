const APP_KEY = 'TIME_TRACKER.';

export class LocalStorageService {

  static loadState(feature: string): object {
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

        let curState = state;
        keys.forEach((field, index) => {
          if (index === keys.length - 1) {
            curState[field] = JSON.parse(value);
          } else {
            curState[field] = curState[field] || {};
            curState = curState[field];
          }
        });
      }
      return state;
    }, {});
  }

  static setItem(feature: string, key: string, value: any) {
    localStorage.setItem(`${APP_KEY}${feature}.${key}`, JSON.stringify(value));
  }

}
