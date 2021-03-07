import {HttpBasicResponse} from '../models/httpBasicResponse';
import {Address} from '../models/address';
import * as moment from 'moment';
import APP_SETTINGS from './settings';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export function isSuccessResponse(res: HttpBasicResponse) {
  return res.meta.code === 1000;
}

export function isErrorResponse(res: HttpBasicResponse) {
  return res.meta.code !== 1000 && typeof res.meta.message !== 'undefined';
}

export function parseAddress(address: Address, short = false) {
  let addressStr = '';
  addressStr += address.street_address ? `${address.street_address}, ` : '';
  addressStr += address.city ? `${address.city} ` : '';
  if (!short) {
    addressStr += address.state ? `${address.state} ` : '';
    addressStr += address.country ? `${address.country} ` : '';
    addressStr += address.zip_code ? `${address.zip_code}` : '';
  }
  return addressStr.trim() ? addressStr : '...';
}

export function toBeautifyDate(value, time = false) {
  const isValidDate = moment(value).isValid();
  if (isValidDate) {
    const format = time ? 'YYYY/MM/DD h:m a' : 'YYYY/MM/DD';
    return moment(value).format(format);
  }
  return value;
}

export function textTruncate(str, length, ending) {
  if (length == null) {
    length = 100;
  }
  if (ending == null) {
    ending = '...';
  }
  if (str.length > length) {
    return str.substring(0, length - ending.length) + ending;
  } else {
    return str;
  }
}

export function convertToISODate(from) {
  if (from) {
    return new Date(from.year, from.month - 1, from.day).toISOString();
  }
  return from;
}

export function fromMomentToNGbDate(date: moment.Moment) {
  if (!date) {
    return null;
  }
  return { year: date.year(), month: date.month(), day: date.day() };
}

export function fromNGbDateToMoment(date: NgbDateStruct) {
  if (!date) {
    return null;
  }
  return moment(date.year + '-' + date.month + '-' + date.day, 'YYYY-MM-DD');
}

export function setQueryObject(queryObject, filters, filtersAPI) {
  if (typeof queryObject !== 'undefined') {
    for (const [key, value] of Object.entries(filtersAPI)) {
      if (queryObject.hasOwnProperty(`search[${value}]`)) {
        delete queryObject[`search[${value}]`];
      }
      if (filters[key]) {
        if (typeof filters[key] === 'object' && filters[key].hasOwnProperty('from')) {
          if (filters[key].hasOwnProperty('from')) {
            const from = filters[key]['from'];
            if (typeof from === 'object' && from) {
              queryObject[`search[${value}][from]`] = convertToISODate(from);
            } else {
              delete queryObject[`search[${value}][from]`];
            }
          }
          if (filters[key].hasOwnProperty('to')) {
            const to = filters[key]['to'];
            if (typeof to === 'object' && to) {
              queryObject[`search[${value}][to]`] = convertToISODate(to);
            } else {
              delete queryObject[`search[${value}][to]`];
            }
          }
        } else {
          queryObject[`search[${value}]`] = filters[key] ? encodeURIComponent(filters[key]) : '';
        }
      }
    }
  }

  return queryObject;
}

export function setParams(queryObject, params, fields) {
  const encodeSearchValue = encodeURIComponent(params['search']['value']);
  const totalRecords = params.length === APP_SETTINGS.totalRecordsToShow ? APP_SETTINGS.totalRecordsToShow : params.length;
  const page = (params['start'] / totalRecords) + 1;
  queryObject['fields'] = fields;
  if (encodeSearchValue) {
    queryObject['filter'] = encodeSearchValue;
  } else {
    delete queryObject['filter'];
  }
  queryObject['limit'] = params['length'];
  queryObject['page'] = page;

  const order = params['order'][0];
  const orderColumn = params['columns'][order.column];
  if (orderColumn.data !== 'id') {
    queryObject['order'] = order.dir === 'desc' ? -1 : 1;
    queryObject['sort'] = orderColumn.data;
  }

  return queryObject;
}
