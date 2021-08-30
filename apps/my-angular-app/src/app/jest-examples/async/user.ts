// Copyright 2004-present Facebook. All Rights Reserved.

import request from './request';

export interface User {
  name: string;
}

export function getUserName(userID: number) {
  return request('/users/' + userID).then((user: User) => user.name);
}
