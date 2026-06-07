# Anasa Buyer App — v1.0.45 (Client Test Build)

**Build date:** Jun 2, 2026  
**Package:** `com.anasa`  
**Version:** 1.0.45 (58)  
**Type:** Release APK for client testing (sideload)

---

## Package contents

| File | Description |
|------|-------------|
| `Anasa-Buyer-v1.0.45-CLIENT-TEST.apk` | Installable Android app |
| `README.md` | This guide |

---

## Install on device

1. Uninstall any older Anasa test build if needed.
2. Copy APK to device (Drive, WhatsApp, email, USB, etc.).
3. Open APK and allow **Install unknown apps** if prompted.
4. Launch **Anasa**.

### Install via ADB

```bash
adb install -r Anasa-Buyer-v1.0.45-CLIENT-TEST.apk
```

---

## Environment

This build points to the **live API**:

`https://anasa.site:2053/api/`

---

## Included updates

- Vendor products page:
  - category filter support via vendor profile API (`category` query param)
  - improved product card spacing and responsive 2-column layout
  - improved ratings/reviews section with horizontal sliding cards
- Home page:
  - top banner/content moved up to remove odd white gap below orange header
- Address map picker:
  - loader/location-flow stability updates

---

## Build source output

Generated from:

`ahlain/android/app/build/outputs/apk/release/app-release.apk`

