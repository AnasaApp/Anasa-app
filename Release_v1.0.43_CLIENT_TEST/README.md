# Anasa Buyer App — v1.0.43 (Client Test Build)

**Build date:** May 25, 2026  
**Package:** `com.anasa`  
**Version:** 1.0.43 (56)  
**Type:** Release APK for QA / client testing (sideload)

---

## Package contents

| File | Description |
|------|-------------|
| `Anasa-Buyer-v1.0.43-CLIENT-TEST.apk` | Installable Android app (~66 MB) |
| `README.md` | This guide |

---

## Install on device

1. Uninstall any older test build if needed (Settings → Apps → Anasa → Uninstall).
2. Copy the APK to the phone (email, Drive, USB, etc.).
3. Open the APK and allow **Install unknown apps** when prompted.
4. Launch **Anasa** and sign in (guest mode is also available).

### Install via USB (ADB)

```bash
adb install -r Anasa-Buyer-v1.0.43-CLIENT-TEST.apk
```

---

## Test environment

This build points to the **staging API**:

`http://ec2-18-189-236-47.us-east-2.compute.amazonaws.com:2053/api/`

Use valid buyer test accounts on that server. Party / occasions features require a logged-in user (not guest).

---

## What to test in this build

### Home
- **My Occasions** — user parties from `getParties` only
- **Anasa Occasions** — catalog from `getOccasions` (images → view occasion)
- **Anasa Recommends** — recommendations list
- Section loading / empty states

### Create occasion
- Required: **type**, **name**, **description**, **date**
- Creates party via `createParty`, then planning flow

### Occasion flow
- View occasion, browse services, add to occasion
- **Browse Services** button (full-width in empty state)
- Plan Myself / Plan For Me

### General
- Login / guest / OTP
- Cart, categories, service detail
- Push notifications (if configured on device)

---

## Known notes

- Signed with the project debug keystore (fine for internal QA; not for Play Store upload).
- For Play Store, use `bundleRelease` with the upload keystore and internal testing track.
- If party APIs return 401/404, confirm the staging server has the Party module deployed.

---

## Rebuild (developers)

From `ahlain/`:

```bash
npm run android:release
```

APK output: `android/app/build/outputs/apk/release/app-release.apk`

---

## Support

Report issues with: device model, Android version, steps to reproduce, and screenshots where possible.
