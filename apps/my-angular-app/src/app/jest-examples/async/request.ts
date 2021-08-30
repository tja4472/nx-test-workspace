// Copyright 2004-present Facebook. All Rights Reserved.

import { User } from './user';

const http = require('http');

export default function request(url: any) {
  return new Promise<User>((resolve) => {
    // This is an example of an http request, for example to fetch
    // user data from an API.
    // This module is being mocked in __mocks__/request.js
    http.get({ path: url }, (response: any) => {
      let data = '';
      const x: User = { name: 'x' };

      response.on('data', (_data: any) => (data += _data));
      // response.on('end', () => resolve(data));
      response.on('end', () => resolve(x));
    });
  });
}
