# Anasa Buyer App — v1.0.44 (Client Test Build)

**Build date:** May 25, 2026  
**Package:** `com.anasa`  
**Version:** 1.0.44 (57)  
**Type:** Release APK for QA / client testing (sideload)

---

## Package contents

| File | Description |
|------|-------------|
| `Anasa-Buyer-v1.0.44-CLIENT-TEST.apk` | Installable Android app |
| `README.md` | This guide |

---

## Install on device

1. Uninstall any older test build if needed (Settings → Apps → Anasa → Uninstall).
2. Copy the APK to the phone (email, Drive, USB, etc.).
3. Open the APK and allow **Install unknown apps** when prompted.
4. Launch **Anasa** and sign in (guest mode is also available).

### Install via USB (ADB)

```bash
adb install -r Anasa-Buyer-v1.0.44-CLIENT-TEST.apk
```

---

## Test environment

This build points to the **staging API**:

`http://ec2-18-189-236-47.us-east-2.compute.amazonaws.com:2053/api/`

Use valid buyer test accounts on that server. Party / occasions features require a logged-in user (not guest).

---

## What's new in v1.0.44 (vs v1.0.43)

### Combos
- **Add to Occasion** on combo detail screen (same flow as services)
- Occasion picker modal; adds all combo services to the selected occasion

### Occasions (from v1.0.43)
- My Occasions / Anasa Occasions on home
- Create occasion (type, name, description, date)
- Add service to occasion from service detail
- Add all occasion services to cart (cart refreshes correctly)
- Plan For Me → service request flow
- Language change applies immediately after Settings

---

## What to test

### Combo → Add to Occasion
1. Open any combo from home banners / recommendations
2. Select customizations if required
3. Tap **Add to Occasion** (orange outline, left of Add to cart)
4. Pick an existing occasion or create new
5. Confirm all combo services appear on the occasion view

### Occasions
- Create / view occasions, add services, add all to cart
- Expired / today / upcoming date tags on occasion cards

### General
- Login / guest / OTP, cart, categories, service detail
- Arabic / English language switch in Settings

---

## Known notes

- Signed with the project debug keystore (fine for internal QA; not for Play Store upload).
- For Play Store, use `bundleRelease` with the upload keystore and internal testing track.

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
