# Play Store Upload — Anasa Buyer App v1.0.47 (60)

**AAB:** `Anasa-Buyer-v1.0.47-PLAYSTORE.aab`

**Package:** `com.anasa`  
**API:** `https://anasa.site:2053/api/` (live)

---

## Version info

| Field | Value |
|-------|--------|
| versionName | 1.0.47 |
| versionCode | 60 |
| applicationId | com.anasa |

---

## What's new in v1.0.47 (vs v1.0.46)

### Cart & checkout
- Fix cart address not updating after user selects a different saved address
- Saved Address screen stays in sync with the address shown on cart
- Checkout / booking / payment APIs now send the **cart-selected** `location` id (not profile default only)

### Address
- Improved map geocoding (city/locality parsing, less duplicated address text)
- Cleaner locality save when adding/editing addresses

### Occasions & parties (carried from v1.0.46)
- Occasion detail, add/remove services & combos, add all to cart, delete from header
- Combo customization for occasions

---

## Play Console steps

1. Open [Google Play Console](https://play.google.com/console) → **Anasa** (buyer app)
2. **Release** → **Production** (or **Internal testing** / **Closed testing**)
3. **Create new release**
4. Upload `Anasa-Buyer-v1.0.47-PLAYSTORE.aab`
5. **Release name:** `1.0.47 (60)`
6. Add release notes (see below)
7. Review → **Save** → **Submit**

### Suggested release notes (EN)

```
• Fixed checkout address: your selected delivery address is now used for payment and booking
• Improved saved address picker sync with cart
• Address entry and map location accuracy improvements
• Occasion and combo flow stability improvements
```

---

## Build notes

- Built with `bundleRelease` from `ahlain/` (`npm run android:bundle`)
- ARM ABIs only: `arm64-v8a`, `armeabi-v7a`
- 16 KB page-size compatible (`jniLibs.useLegacyPackaging=false`)
- Source output: `ahlain/android/app/build/outputs/bundle/release/app-release.aab`

### Signing

Play upload requires the **upload keystore** (`android/app/release.keystore`).  
If this machine built with the debug fallback, **do not upload** — rebuild on a machine that has the correct `release.keystore` matching prior Play releases.

Gradle expects (from `gradle.properties`):

- `MYAPP_RELEASE_STORE_FILE=release.keystore`
- `MYAPP_RELEASE_KEY_ALIAS=upload`

---

## Rebuild (developers)

From `ahlain/`:

```bash
npm run android:bundle
```

Copy output:

```bash
# Windows PowerShell
Copy-Item android\app\build\outputs\bundle\release\app-release.aab `
  ..\Release_v1.0.47_PLAYSTORE\Anasa-Buyer-v1.0.47-PLAYSTORE.aab
```
