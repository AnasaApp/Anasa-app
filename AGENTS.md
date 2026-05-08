# AGENTS.md

## Scope and repo layout
- The working app lives in `ahlain/` (React Native 0.79, React 19); treat `Anasa/` as a container repo.
- Main entrypoints are `ahlain/index.js` (background FCM handler) and `ahlain/App.js` (providers, deep links, crash reporting, foreground iOS push handling).
- UI code is primarily under `ahlain/src/screen/`; navigation is centralized in `ahlain/src/navigation/`.
- State and side effects are in `ahlain/src/redux/reducers/` + `ahlain/src/redux/sagas/`.

## Architecture and data flow (project-specific)
- Follow this pipeline for API-backed features: **Screen dispatch -> SagaActions constant -> saga watcher/worker -> `callApiService` -> `ApiCalls` URL map -> reducer slice update**.
- Concrete example: login flow in `ahlain/src/redux/sagas/LoginUserSaga.js` writes with `saveUserLogin` from `ahlain/src/redux/reducers/LoginUserReducer.js`.
- API request typing is string-based (`SagaActions`) and mapped via big switch in `ahlain/src/services/ApiCalls.js`; add both POST/GET branches as needed.
- Auth headers and language are injected in one place: `ahlain/src/services/ApiInstance.js` (`x-auth-token-buyer`, `x-buyer-language` from AsyncStorage).
- Unauthorized API responses (`401`) trigger a navigation reset to auth via `goToLogin` in `ahlain/src/conponents/NavigationRef.js`.

## Navigation, deep links, and notifications
- Use route constants from `ahlain/src/config/routes.js` (do not hardcode route strings in new code).
- Root stack is large and flat in `ahlain/src/navigation/RootNavigation.js`; Android and iOS each boot through platform-specific push controller screens first.
- Deep links are parsed manually in `ahlain/App.js` (`serviceId` / `comboId` query params) and stored in global vars (`global.NOTIFICATION_TYPE`, `global.NOTIFICATION_DATA`).
- Push navigation behavior lives in `ahlain/src/conponents/PushController.js` and `ahlain/src/conponents/PushControllerIos.js`; notification `type` drives route jumps.
- App links assets live in `ahlain/src/deepLinks/` and Android scheme intent filter is in `ahlain/android/app/src/main/AndroidManifest.xml` (`anasa://`).

## Build, test, and release workflows
- From `ahlain/`, core commands are: `npm start`, `npm run android`, `npm run ios`, `npm test`, `npm run lint` (see `ahlain/package.json`).
- Jest is minimal (`ahlain/__tests__/App.test.tsx`) and depends on native mocks in `ahlain/jest.setup.js`; extend mocks when adding native modules.
- Production Babel removes console logs (`ahlain/babel.config.js`), so avoid relying on runtime `console.log` for release diagnostics.
- Android is configured for API 35 + 16KB page-size requirements in `ahlain/android/app/build.gradle` and `ahlain/android/gradle.properties`.
- AAB validation helpers exist: `ahlain/check_aab_alignment.py`, `ahlain/check_aab_compression.py`, and Windows repack script `repack-aab.ps1`.

## Conventions and sharp edges
- The codebase intentionally uses `src/conponents/` (misspelled) for shared app wiring (NavigationRef, push controllers); preserve existing import paths.
- Existing style is mostly JS (not TS), single quotes, no bracket spacing (see `ahlain/.prettierrc.js`), ESLint extends `@react-native`.
- Reducer/saga files are 1 feature per file and registered centrally in both `ahlain/src/redux/reducers/index.js` and `ahlain/src/redux/sagas/index.js`.
- Config is aggregated via `ahlain/src/config/index.js`; API base URL is currently hardcoded in `ahlain/src/config/Constants.js`.

## Existing AI guidance sources checked
- One glob search over standard AI-instruction filenames found no repo-specific instruction file besides `ahlain/README.md` (other matches were third-party Pod READMEs under `ios/Pods/`).
- In this repo, prefer this `AGENTS.md` for agent behavior and use `ahlain/README.md` only for baseline React Native bootstrapping commands.

