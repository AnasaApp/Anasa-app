# Anasa Buyer App — v1.0.46 (Client Test Build)

**Build date:** Jun 3, 2026  
**Package:** `com.anasa`  
**Version:** 1.0.46 (59)  
**Type:** Optimized release APK for client testing (sideload)

---

## Package contents

| File | Description |
|------|-------------|
| `Anasa-Buyer-v1.0.46-CLIENT-TEST.apk` | Installable Android app (~66 MB) |
| `README.md` | This guide |

---

## Install on device

1. Uninstall any older Anasa test build if needed.
2. Copy APK to device (Drive, WhatsApp, email, USB, etc.).
3. Open APK and allow **Install unknown apps** if prompted.
4. Launch **Anasa**.

### Install via ADB

```bash
adb install -r Anasa-Buyer-v1.0.46-CLIENT-TEST.apk
```

---

## Environment

This build points to the **live API**:

`https://anasa.site:2053/api/`

Use valid buyer accounts on the live server. Occasion / party features require a logged-in user (not guest).

---

## What's new in v1.0.46 (vs v1.0.45)

### Occasions & parties
- **Delete occasion** moved to the **occasion detail header** (trash icon top-right); removed from home occasion cards
- Occasion detail page: separate **Services** and **Combos** sections with item counts
- **Add Service** / **Add Combo** empty states and **Add More** actions when items exist
- Remove individual services/combos from occasion via **view + delete** icons on each card
- **Add all to cart** for occasion (services + combos with saved combo customizations)
- Date status tags on occasion cards (Today, Tomorrow, In X days, Expired)
- Fixed occasion detail infinite loading loop

### Combos
- **Add to Occasion** restored on combo detail screen
- Combo picker modal and party combo storage for package selections
- Combos shown on occasion view; open combo to configure before add-to-cart

### Service detail
- Customization-only flow improvements (option cards, flavor single-select, Confirm Selection)
- Add service to occasion from service detail

### Home & lists
- My Occasions horizontal list on home (no delete icon on cards — open occasion to delete)
- Guest mode and login flow stability fixes

### Other
- Map/address picker and language switch improvements
- API logging helpers (dev); production build strips console logs

---

## What to test

### Occasion lifecycle
1. Create occasion from home / My Occasions
2. Add services from service detail and combos from combo detail
3. Open occasion → verify Services and Combos sections
4. Use **eye icon** to open item detail; **delete icon** to remove item
5. Tap header **delete** → confirm → occasion removed and navigate back
6. **Add to Cart** with configured combos

### Combos
1. Open combo → customize packages → **Add to Occasion**
2. On occasion view, open combo again to change selections
3. Add all to cart only after required customizations are set

### General
- Login / guest / OTP, cart, categories, vendor pages
- Arabic / English in Settings (applies immediately)
- Home occasion cards: date tags should not overlap other UI

---

## Build notes

- **Optimized release build** (`assembleRelease`), ARM devices only (`arm64-v8a`, `armeabi-v7a`)
- Signed with project release keystore (suitable for client sideload QA; use Play Console internal track for store upload)
- Source output: `ahlain/android/app/build/outputs/apk/release/app-release.apk`

### Rebuild (developers)

From `ahlain/`:

```bash
npm run android:release
```

For Play Store AAB:

```bash
npm run android:bundle
```

---

## Support

Report issues with: device model, Android version, app version **1.0.46 (59)**, steps to reproduce, and screenshots where possible.
