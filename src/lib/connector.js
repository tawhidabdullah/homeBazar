import config from '../config.json';
import apiMap from '../apiMap.json';
import Converter from './converter.js';

// import utils
import { manupulateURL } from './utils';

let converter = new Converter();

class Connector {
  //TODO
  constructor() {
    this.options = {};
  }

  /**
   * @method request sends request to server
   * this function determines api url and method from config.json
   * and sends request and converts recieved data to general format
   * @param {String} item
   * @param {String} format
   * @param {Object} data optional
   * @returns {Object}  converted data
   */

  async request(item, format = 'json', options = {}) {
    let api = apiMap[config.server][item]; //api url & method

    // configuring options for fetch request

    this.options = {
      ...this.options,
      method: api.method,
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json',
        ...(options.headers && {
          ...options.headers,
        }),
      }),
      body: api.method !== 'get' ? JSON.stringify(options.body) : null,
    };

    //*replace variable parts in url with actual data if params exists |or| just return the url

    const url = manupulateURL(api.url, options.urlOptions);

    // change the formate to text if the server is wooCommerce
    if (config['server'] === 'wooCommerce') {
      // format = 'text';
    }

    try {
      let res = await fetch(config.baseURL + url, this.options);

      if (res.status >= 200 && res.status < 300) {
        let formattedData = await res[format](); //await res.json(), res.text()
        if (formattedData.status === 'error') {
          throw formattedData.error;
        }

        let convertedData = await converter[item](formattedData); //convert recieved data to app general format
        return convertedData;
      } else {
        let error = await res[format]();

        throw error;
      }
    } catch (err) {

      throw err;
      //TODO: breakdown errors
    }
  }
}

export default Connector;
