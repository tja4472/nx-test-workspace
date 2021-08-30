// Copyright (c) 2014-present, Facebook, Inc. All rights reserved.

import { User } from '../user';

const users: Record<number, User> = {
  4: { name: 'Mark' },
  5: { name: 'Paul' },
};

export default function request(url: any) {
  return new Promise<User>((resolve, reject) => {
    const userID = parseInt(url.substr('/users/'.length), 10);
    process.nextTick(() =>
      users[userID]
        ? resolve(users[userID])
        : reject({
            error: 'User with ' + userID + ' not found.',
          })
    );
  });
}
