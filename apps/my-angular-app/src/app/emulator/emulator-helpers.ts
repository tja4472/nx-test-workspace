import * as http from 'http';

import { EmulatorInfo } from './emulator-info';

// https://firebase.google.com/docs/reference/rest/auth#section-auth-emulator-clearaccounts
export function clearUserAccounts(projectId: string) {
  const options: http.RequestOptions = {
    host: EmulatorInfo.host,
    path: `/emulator/v1/projects/${projectId}/accounts`,
    method: 'DELETE',
    port: EmulatorInfo.auth.port,
  };

  return new Promise<http.IncomingMessage>((resolve, reject) => {
    const req = http.request(options, (res) => {
      resolve(res);
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}
