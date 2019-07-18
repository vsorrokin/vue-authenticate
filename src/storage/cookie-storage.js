import { $document } from '../globals.js';
import {
  objectExtend,
  formatCookie,
  parseCookies,
  getLocationHostname
} from '../utils.js';
import { getCookieDomainUrl } from '../options.js';

class CookieStorage {
  constructor(defaultOptions) {
    this._defaultOptions = objectExtend({
      domain: getLocationHostname(),
      expires: null,
      path: '/',
      secure: false
    }, defaultOptions);
  }

  setItem(key, value) {
    const options = objectExtend({}, this._defaultOptions);
    const cookie = formatCookie(key, value, options);
    this._setCookie(cookie);
  }

  getItem(key) {
    if (this._defaultOptions.serverStore &&
  		  this._defaultOptions.serverStore() &&
  			this._defaultOptions.serverStore().cookies) {
      return this._defaultOptions.serverStore().cookies[key];
    }
    const cookies = parseCookies(this._getCookie());
    return cookies.hasOwnProperty(key) ? cookies[key] : null;
  }

  removeItem(key) {
    const value = '';
    const defaultOptions = objectExtend({}, this._defaultOptions);
    const options = objectExtend(defaultOptions, {
      expires: new Date(0)
    });
    const cookie = formatCookie(key, value, options);
    this._setCookie(cookie);
  }

  _getCookie() {
    try {
      return $document.cookie === 'undefined' ? '' : $document.cookie
    } catch (e) {}

    return '';
  }

  _setCookie(cookie) {
    try {
      $document.cookie = cookie;
    } catch (e) {}
  }
}

export default CookieStorage
