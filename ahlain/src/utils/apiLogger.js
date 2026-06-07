/**
 * Dev-only API logger. View live output:
 * - Metro terminal (npm start)
 * - adb logcat -s ReactNativeJS:V
 */

const TAG = '[API]';

const sanitizeBody = body => {
  if (!body || typeof body !== 'object') {
    return body;
  }
  const copy = {...body};
  if (copy.password) {
    copy.password = '***';
  }
  if (copy.confirm_password) {
    copy.confirm_password = '***';
  }
  return copy;
};

const log = (label, payload) => {
  if (!__DEV__) {
    return;
  }
  const time = new Date().toISOString().split('T')[1]?.slice(0, 12);
  if (payload !== undefined) {
    console.log(`${TAG} ${time} ${label}`, payload);
  } else {
    console.log(`${TAG} ${time} ${label}`);
  }
};

export const logApiRequest = (apiType, url, body) => {
  log(`→ ${apiType}`, {url, body: sanitizeBody(body)});
};

export const logApiResponse = (apiType, url, isSucceded, responseBody, extra) => {
  const token =
    responseBody?.results?.token ??
    responseBody?.result?.results?.token ??
    null;
  log(`← ${apiType} ${isSucceded ? 'OK' : 'FAIL'}`, {
    url,
    error: responseBody?.error,
    error_code: responseBody?.error_code,
    message: responseBody?.message,
    hasToken: !!token,
    ...extra,
  });
  if (apiType?.includes('LOGIN') && __DEV__) {
    log('LOGIN full body', responseBody);
  }
};

export const logLoginFlow = (stage, detail) => {
  log(`[LOGIN] ${stage}`, detail);
};
