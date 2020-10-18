import { isBrowser } from './utils';

const testHost = 'localhost:8536';

const internalHost = process.env.LEMMY_INTERNAL_HOST || testHost; // used for local dev
export const externalHost = isBrowser()
  ? `${window.location.hostname}${
      ['1234', '1235'].includes(window.location.port)
        ? ':8536'
        : window.location.port == ''
        ? ''
        : `:${window.location.port}`
    }`
  : process.env.LEMMY_EXTERNAL_HOST || testHost;

const secure = isBrowser()
  ? window.location.protocol == 'https:'
    ? 's'
    : ''
  : process.env.LEMMY_HTTPS == 'true'
  ? 's'
  : '';

const host = isBrowser() ? externalHost : internalHost;

const httpBase = `http://${host}`; // Don't use secure here
export const wsUri = `ws${secure}://${host}/api/v1/ws`;
export const httpUri = `${httpBase}/api/v1`;
export const pictrsUri = `http${secure}://${host}/pictrs/image`;

console.log(`httpbase: ${httpBase}`);
console.log(`wsUri: ${wsUri}`);

// This is for html tags, don't include port
const httpExternalUri = `http${secure}://${externalHost.split(':')[0]}`;
export function httpExternalPath(path: string) {
  return `${httpExternalUri}${path}`;
}
