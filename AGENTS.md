# AGENTS.md

## Scope and repo layout
- The working app lives in `ahlain/` (React Native 0.79, React 19); treat `Anasa/` as a container repo.
- Main entrypoints are `ahlain/index.js` (background FCM handler) and `ahlain/App.js` (providers, deep links, crash reporting, foreground iOS push handling).
- UI code is primarily under `ahlain/src/screen/`; navigation is centralized in `ahlain/src/navigation/`.
- State and side effects are in `ahlain/src/redux/reducers/` + `ahlain/src/redux/sagas/`.
- `ahlain/src/components/` (correctly spelled) exists only as a shim directory — it contains a single `NavigationRef.js` re-export (`module.exports = require('../conponents/NavigationRef')`). Do **not** place new component logic here; all shared components belong in `src/conponents/`.
- Shared utility helpers live in `ahlain/src/utils/` (currently only `ImagePicker.js`).

## Architecture and data flow (project-specific)
- Follow this pipeline for API-backed features: **Screen dispatch -> SagaActions constant -> saga watcher/worker -> `callApiService` -> `ApiCalls` URL map -> reducer slice update**.
- Concrete example: login flow in `ahlain/src/redux/sagas/LoginUserSaga.js` writes with `saveUserLogin` from `ahlain/src/redux/reducers/LoginUserReducer.js`.
- API request typing is string-based (`SagaActions`) and mapped via big switch in `ahlain/src/services/ApiCalls.js`; add both POST/GET branches as needed.
- Endpoint URL strings live in `ahlain/src/services/ApiUrls.js` (separate from `ApiCalls.js`). Add new URLs here first, then reference them in the `ApiCalls.js` switch.
- Auth headers and language are injected in one place: `ahlain/src/services/ApiInstance.js` (`x-auth-token-buyer`, `x-buyer-language` from AsyncStorage).
- **Guest user mode**: when `IS_GUEST_USER` is truthy in AsyncStorage, the auth token is omitted from all requests and `401` errors are silently swallowed (no redirect to login). Both `httpPostRequest` and `httpGetRequest` check this key before setting the header or calling `goToLogin`.
- Unauthorized API responses (`401`) trigger a navigation reset to auth via `goToLogin` in `ahlain/src/conponents/NavigationRef.js` (only for non-guest users).
- `callApiService` URI extension: set `jsonBody.uri` to append a path/query segment to the base URL (e.g. for per-resource endpoints). `user_language` is auto-injected into every POST body by `callApiService`.
- `EDIT_PROFILE` and `CREATE_SUPPORT` saga actions automatically use `multipart/form-data` via the internal `PrepareFormData` helper in `ApiInstance.js`; no manual header override is needed.
- Global UI state (`isLoading`, `isInternetConnected`) is managed by `ahlain/src/redux/reducers/UIReducer.js`. Use the exported `showLoader(true/false)` action and `selectLoader` / `selectInternetConnectivity` selectors — do not create ad-hoc loading state in feature slices.

## Navigation, deep links, and notifications
- Use route constants from `ahlain/src/config/routes.js` (do not hardcode route strings in new code).
- Root stack is large and flat in `ahlain/src/navigation/RootNavigation.js`; Android and iOS each boot through platform-specific push controller screens first.
- Auth screens are grouped in a nested `createNativeStackNavigator` in `ahlain/src/navigation/AuthNavigation.js`, mounted at the `AUTH_NAVIGATION` route in the root stack.
- Deep links are parsed manually in `ahlain/App.js` (`serviceId` / `comboId` query params) and stored in global vars (`global.NOTIFICATION_TYPE`, `global.NOTIFICATION_DATA`).
- Push navigation behavior lives in `ahlain/src/conponents/PushController.js` and `ahlain/src/conponents/PushControllerIos.js`; notification `type` drives route jumps.
- App links assets live in `ahlain/src/deepLinks/` and Android scheme intent filter is in `ahlain/android/app/src/main/AndroidManifest.xml` (`anasa://`).

## Build, test, and release workflows
- From `ahlain/`, core commands are: `npm start`, `npm run android`, `npm run ios`, `npm test`, `npm run lint` (see `ahlain/package.json`).
- Jest is minimal (`ahlain/__tests__/App.test.tsx`) and depends on native mocks in `ahlain/jest.setup.js`; extend mocks when adding native modules.
- Production Babel removes console logs (`ahlain/babel.config.js`), so avoid relying on runtime `console.log` for release diagnostics.
- Android is configured for API 35 + 16KB page-size requirements in `ahlain/android/app/build.gradle` and `ahlain/android/gradle.properties`.
- AAB validation helpers exist: `ahlain/check_aab_alignment.py`, `ahlain/check_aab_compression.py`, and Windows repack script `repack-aab.ps1`.
- Firebase Crashlytics is enabled at startup via `crashlytics().setCrashlyticsCollectionEnabled(true)` in `App.js`; key lifecycle milestones (mount, foreground, background) are logged with `crashlytics().log(...)`.
- Firebase Analytics events are logged through `trackEvents(eventName, payload)` exported from `ahlain/src/config/FCMEvents.js` (wraps `analytics().logEvent`). Current events: `app_launch`, `app_resume`. Add new events here.
- `@react-native-firebase/perf` is installed but not yet wired in `App.js`; initialise it before adding performance traces.

## Conventions and sharp edges
- The codebase intentionally uses `src/conponents/` (misspelled) for shared app wiring (NavigationRef, push controllers); preserve existing import paths.
- Existing style is mostly JS (not TS), single quotes, no bracket spacing (see `ahlain/.prettierrc.js`), ESLint extends `@react-native`.
- Reducer/saga files are 1 feature per file and registered centrally in both `ahlain/src/redux/reducers/index.js` and `ahlain/src/redux/sagas/index.js`.
- Config is aggregated via `ahlain/src/config/index.js`; API base URL is currently hardcoded in `ahlain/src/config/Constants.js` (`BASE_API_URL: 'https://anasa.site:2053/api/'`).
- AsyncStorage key constants are exported from `ahlain/src/config/AsyncKeys.js` (`USER_LOGGED_IN`, `USER_DATA`, `USER_LOCATION`) and accessed as `config.AsyncKeys.*`. Exception: the language key is stored directly as the string `'user_language'` and is **not** in `AsyncKeys.js` — be consistent here when adding new keys.
- i18n uses `i18next` + `react-i18next`, initialised in `ahlain/src/translations/index.js` with `en` and `ar` locales. RTL layout is explicitly **disabled** with `I18nManager.allowRTL(false)` in `App.js`; language detection falls back to `I18nManager.isRTL` at init time.
- `src/conponents/index.js` barrel-exports only `AppTextInput`, `AppHeader`, `AppButton`; other components (`AppImage`, `AppLoader`, `SkeltonLoader`, etc.) must be imported directly.

## Existing AI guidance sources checked
- One glob search over standard AI-instruction filenames found no repo-specific instruction file besides `ahlain/README.md` (other matches were third-party Pod READMEs under `ios/Pods/`).
- In this repo, prefer this `AGENTS.md` for agent behavior and use `ahlain/README.md` only for baseline React Native bootstrapping commands.

