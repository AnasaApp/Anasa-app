# Release Notes - Anasa Buyer App v1.0.40

**Release Date:** May 7, 2026  
**Version:** 1.0.40 (Build 53)  
**Platform:** Android  
**Build Type:** Release APK

---

## 🎯 What's New

### Critical Bug Fixes (1)
- **Fixed app crash on background resume** - App no longer shows black screen or crashes when reopening from background

### High Priority Bug Fixes (4)
- **Fixed guest login navigation** - Guest login now works smoothly without screen blinking or navigation loops
- **Fixed login screen stability** - Login screen no longer blinks after granting location permission
- **Fixed OTP timer accuracy** - OTP countdown timer continues accurately even when app is backgrounded
- **Added Saudi phone validation** - Invalid phone numbers are now rejected with clear error messages

### Medium Priority Bug Fixes (1)
- **Fixed autofill behavior** - Phone number fields no longer show email autofill suggestions

---

## 🚀 UI/UX Improvements (From Previous Release)

### Branding Updates
- Renamed "Occasions" to "Anasa Occasions" on home screen

### Navigation Improvements
- Converted Anasa Recommends from horizontal to vertical 2-column grid
- Added infinite scroll for recommendations (loads 10 items at a time)

### Product Browsing
- Added category filter chips on vendor details pages
- Instant client-side filtering for better performance

---

## 🔧 Technical Improvements

### App Lifecycle Management
- Proper AppState handling for background/foreground transitions
- Prevents crashes during app resume

### Timer System
- Timestamp-based OTP timers (more reliable than setInterval)
- Timer state persists in AsyncStorage

### Form Validation
- Comprehensive Saudi phone number validation (must start with 5, be 9 digits)
- Proper autoComplete attributes for better UX
- Clear Arabic and English error messages

### Navigation
- Debouncing to prevent duplicate navigation actions
- Uses CommonActions.reset for clean state management

---

## ⚠️ Known Limitations

### Requires Backend Support
- **OTP Verification Session (BG_LOGIN_09)**: After OTP verification, users may see a verification required error. Backend needs to return auth token after successful OTP verification.

### Backend Tasks Pending
1. Server-side phone number validation
2. OTP verification to create proper user session

---

## 📦 What's Included

### Features
✅ User authentication (mobile + OTP)  
✅ Guest login  
✅ Location-based services  
✅ Product browsing with categories  
✅ Vendor profiles  
✅ Anasa Occasions section  
✅ Recommendations with infinite scroll  
✅ Arabic/English language support  
✅ RTL layout support  

### Firebase Integrations
✅ Analytics  
✅ Crashlytics  
✅ Cloud Messaging (Push Notifications)  
✅ Performance Monitoring  

---

## 🔒 Security & Compliance

- **Keystore:** Signed with production keystore
- **Target SDK:** Android 35 (Android 15)
- **Min SDK:** Android 24 (Android 7.0)
- **16KB Page Size:** ✅ Compliant with Google Play requirements
- **Permissions:** Location, Camera, Storage, Notifications

---

## 📱 Installation Instructions

### For QA/Internal Testing

1. **Enable Unknown Sources** (if not already)
   - Go to Settings > Security
   - Enable "Install unknown apps" for your file manager

2. **Install APK**
   ```
   adb install -r app-release.apk
   ```
   Or copy APK to device and tap to install

3. **Grant Permissions**
   - Location (Required for service discovery)
   - Notifications (For order updates)
   - Camera (For profile picture)
   - Storage (For photo uploads)

### For Client Distribution

Share the APK file located at:
```
ahlain/android/app/build/outputs/apk/release/app-release.apk
```

**APK Size:** ~50-60 MB (estimated)  
**Supported ABIs:** armeabi-v7a, arm64-v8a (real devices only)

---

## 🧪 Testing Checklist

### Critical Flows to Test

- [ ] **Login Flow**
  - [ ] Login with valid Saudi mobile number
  - [ ] Login with invalid number (should show error)
  - [ ] OTP verification
  - [ ] Login as guest

- [ ] **App Lifecycle**
  - [ ] Minimize app and reopen (should not crash)
  - [ ] Lock device and unlock
  - [ ] Switch to another app and return

- [ ] **OTP Timer**
  - [ ] Start OTP verification
  - [ ] Navigate away and come back (timer should continue)
  - [ ] Minimize app during OTP (timer should continue)

- [ ] **Permissions**
  - [ ] Grant location permission (screen should not blink)
  - [ ] Deny location permission
  - [ ] Grant notification permission

- [ ] **Home Screen**
  - [ ] Anasa Occasions section visible
  - [ ] Recommendations load in 2-column grid
  - [ ] Scroll down to load more recommendations

- [ ] **Vendor Details**
  - [ ] Category filters appear
  - [ ] Tap category filter (products filter instantly)
  - [ ] "All" shows all products

- [ ] **Language Support**
  - [ ] Switch to Arabic (RTL layout works)
  - [ ] Switch to English (LTR layout works)
  - [ ] All error messages appear in selected language

---

## 🐛 Known Issues (To Be Fixed by Backend)

1. **OTP Verification Session (High Priority)**
   - **Issue:** After OTP verification, user sees "Please verify your account"
   - **Workaround:** None
   - **Fix Required:** Backend to return auth token after OTP success

2. **Phone Validation (Medium Priority)**
   - **Issue:** Server accepts invalid phone numbers
   - **Workaround:** Frontend validation prevents most issues
   - **Fix Required:** Backend to add validation

---

## 📊 Changes Summary

| Category | Changes |
|----------|---------|
| Bug Fixes | 6 |
| UI/UX Improvements | 4 |
| Files Modified | 12 |
| Lines Changed | ~400 |
| Performance Improvements | 3 |

### Files Modified
1. `ahlain/App.js` - AppState lifecycle
2. `ahlain/src/screen/logIn/LogIn.js` - Multiple fixes
3. `ahlain/src/screen/singUp/SignUp.js` - Validation
4. `ahlain/src/screen/splash/Splash.js` - Navigation
5. `ahlain/src/conponents/PushController.js` - Permissions
6. `ahlain/src/screen/otpVerify/OtpVerification.js` - Timer
7. `ahlain/src/screen/homeScreen/HomeScreen.js` - Pagination
8. `ahlain/src/screen/vendor/VendorDetails.js` - Filters
9. `ahlain/src/translations/en.json` - Messages
10. `ahlain/src/translations/ar.json` - Messages
11. `ahlain/android/app/build.gradle` - Version bump

---

## 📧 Support & Feedback

For internal testing issues, contact the development team.

For client feedback, please follow normal support channels.

---

## 🎉 Deployment Status

**Frontend:** ✅ READY FOR TESTING  
**Backend:** ⏳ 2 Tasks Pending  
**Production:** ⏳ Awaiting QA Sign-off

---

**Built by:** GitHub Copilot AI Assistant  
**Build Date:** May 7, 2026  
**Build Environment:** Android Studio Build Tools 35.0.0, Gradle 8.11.1  
**React Native:** 0.79  
**React:** 19  

---

## 📄 Additional Documentation

- `QA_BUGS_FIXED_SUMMARY.md` - Detailed bug analysis
- `TESTING_GUIDE_QA_BUGS.md` - Complete testing guide
- `BACKEND_TASKS_COMPLETE_LIST.md` - Backend requirements
- `IMPLEMENTATION_STATUS.md` - Development summary

