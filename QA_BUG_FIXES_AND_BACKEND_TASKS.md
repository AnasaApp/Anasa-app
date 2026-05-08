#  QA Bug Fixes & Backend Tasks - Anasa App

**Date:** May 7, 2026  
**App Market:** Saudi Arabia  
**Priority:** Critical & High Bugs

---

##  EXECUTIVE SUMMARY

### Bugs Analysis
- **Total Bugs Reported:** 7
- **Critical:** 1 (BG_APP_06)
- **High Priority:** 5
- **Medium Priority:** 1
- **Frontend Fixable:** 5
- **Backend Required:** 2
- **Saudi-Specific (Can Ignore):** 0

---

##  CRITICAL BUG (Must Fix Immediately)

### BG_APP_06 - App Crashes After Background Resume
**Priority:** CRITICAL  
**Status:** ⚠️ NEEDS FIX

**Issue:**
When user minimizes app and reopens after some time, black screen appears then app crashes.

**Root Cause:**
- Missing proper AppState lifecycle handling
- Redux state may be lost when app is in background for too long
- Android memory management killing background processes

**Fix Required:**
✅ **Frontend Fix:**
1. Add AppState listener to App.js to detect background/foreground transitions
2. Re-initialize critical data when app comes to foreground
3. Add crash boundary to prevent black screen
4. Persist critical state to AsyncStorage
5. Add splash screen on app resume if needed

**Files to Modify:**
- `ahlain/App.js` - Add lifecycle handling
- `ahlain/src/redux/store.js` - Add state persistence
- `ahlain/src/conponents/PushController.js` - Handle background state

**Implementation Priority:** #1

---

##  HIGH PRIORITY BUGS

### BUG-Login-01 - Login Screen Blinks After Location Permission
**Priority:** HIGH  
**Status:** ⚠️ NEEDS FIX

**Issue:**
Login screen appears but blinks/shakes 3-4 times after enabling location permission.

**Root Cause:**
- Location permission request triggers multiple re-renders
- Navigation stack being reset multiple times
- Splash screen checking location permission and re-rendering

**Fix Required:**
✅ **Frontend Fix:**
1. Add state flag to prevent multiple re-renders during permission request
2. Use `useRef` to track if permission already requested
3. Debounce navigation calls after permission granted
4. Add InteractionManager.runAfterInteractions() for smooth transitions

**Files to Modify:**
- `ahlain/src/screen/splash/Splash.js`
- `ahlain/src/conponents/PushController.js`
- `ahlain/src/screen/logIn/LogIn.js`

**Implementation Priority:** #2

---

### BUG-Login-02 - Guest Login Navigation Issue
**Priority:** HIGH  
**Status:** ⚠️ NEEDS FIX

**Issue:**
"Login as Guest" button causes screen to change briefly then returns to login page with blinking.

**Root Cause:**
Looking at `LogIn.js` line 252-264, the guest login uses `goToLogin(config.routes.HOME_SCREEN)` which is the WRONG function. This function is meant to navigate TO login screen, not FROM it.

**Fix Required:**
✅ **Frontend Fix:**
1. Replace `goToLogin()` with proper navigation method
2. Use `navigation.dispatch(CommonActions.reset())` similar to regular login
3. Store guest flag in AsyncStorage
4. Ensure no authentication middleware blocks guest access

**Files to Modify:**
- `ahlain/src/screen/logIn/LogIn.js` - Fix navigation call
- `ahlain/src/conponents/NavigationRef.js` - Review goToLogin function

**Code Change:**
```javascript
// BEFORE (Line 252-264)
onPress={() => {
  goToLogin(config.routes.HOME_SCREEN);
}}

// AFTER
onPress={() => {
  navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{name: config.routes.HOME_SCREEN}],
    }),
  );
  AsyncStorage.setItem(
    config.AsyncKeys.USER_LOGGED_IN,
    JSON.stringify(false), // Guest mode
  );
  AsyncStorage.setItem(
    'IS_GUEST_USER',
    JSON.stringify(true),
  );
}}
```

**Implementation Priority:** #3

---

### BUG-OTP-05 - Timer Pauses When Navigating Away
**Priority:** HIGH  
**Status:** ⚠️ NEEDS FIX

**Issue:**
OTP resend timer stops when user minimizes app or navigates away, then resumes from same point when returning.

**Root Cause:**
Timer in `OtpVerification.js` uses `setInterval` which pauses when screen is backgrounded. This is standard React Native behavior.

**Fix Required:**
✅ **Frontend Fix:**
1. Store timer start timestamp in state
2. Calculate elapsed time based on timestamp difference, not counter
3. Use AsyncStorage to persist timer start time
4. Recalculate remaining time on screen focus

**Files to Modify:**
- `ahlain/src/screen/otpVerify/OtpVerification.js`

**Code Change:**
```javascript
// Add timestamp-based timer instead of setInterval counter
const [timerStartTime, setTimerStartTime] = useState(null);

useEffect(() => {
  if (!timerStartTime) return;
  
  const interval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - timerStartTime) / 1000);
    const remaining = Math.max(0, 40 - elapsed);
    setSecs(remaining);
    
    if (remaining === 0) {
      clearInterval(interval);
    }
  }, 1000);
  
  return () => clearInterval(interval);
}, [timerStartTime]);

// On resend:
const onResendPress = async () => {
  const startTime = Date.now();
  setTimerStartTime(startTime);
  await AsyncStorage.setItem('otp_timer_start', startTime.toString());
  // ... rest of code
};

// On screen mount, restore timer:
useEffect(() => {
  const restoreTimer = async () => {
    const savedStartTime = await AsyncStorage.getItem('otp_timer_start');
    if (savedStartTime) {
      setTimerStartTime(parseInt(savedStartTime));
    }
  };
  restoreTimer();
}, []);
```

**Implementation Priority:** #4

---

### BG_LOGIN_08 - Country Code Validation Missing
**Priority:** HIGH  
**Status:** ⚠️ NEEDS DUAL FIX (Frontend + Backend)

**Issue:**
User can login with incorrect country code. System accepts invalid country code + phone number combinations.

**Root Cause:**
- Frontend has country picker but no validation logic
- Backend accepts any country code without validation

**Fix Required:**
✅ **Frontend Fix:**
1. Add validation: Saudi numbers must start with 5 and be 9 digits
2. Show error if country code doesn't match phone number format
3. Lock country code to Saudi Arabia by default (app is Saudi-only)

❌ **Backend Fix Required:**
1. Validate country code and phone number format match
2. Reject login if format invalid
3. Add proper error message

**Files to Modify (Frontend):**
- `ahlain/src/screen/logIn/LogIn.js` - Add validation

**Code Change:**
```javascript
const callLoginApi = async () => {
  // Existing validation...
  
  // NEW: Validate Saudi phone format
  if (countryCode === 'SA' && callingCode === '966') {
    const cleanNumber = phoneNumber.replace(/\s/g, '');
    if (!cleanNumber.startsWith('5') || cleanNumber.length !== 9) {
      return Toast.show(
        t('Saudi mobile numbers must start with 5 and be 9 digits'),
        Toast.LONG
      );
    }
  }
  
  // ... rest of code
};
```

**Backend API Required:**
- Endpoint: `/api/auth/login`
- Add validation: `country_code` + `phone_number` format check
- Return error: `{"error": true, "message": "Invalid phone number format for selected country"}`

**Implementation Priority:** #5 (Frontend), Backend Team Required

---

### BG_LOGIN_09 - User Stuck on OTP After Login
**Priority:** HIGH  
**Status:** ⚠️ NEEDS INVESTIGATION (Likely Backend)

**Issue:**
After account creation, user is redirected to OTP screen but cannot complete login even after OTP verification.

**Root Cause:**
Looking at `OtpVerification.js` lines 96-122, the flow should work correctly. Issue is likely:
1. Backend not returning proper `verifyAccount` flag
2. Backend OTP verification response missing required data
3. Backend session not being created after OTP verification

**Fix Required:**
❓ **Needs Investigation:**
1. Check backend OTP verification response format
2. Verify backend creates session after OTP verification
3. Check if `results` object contains all required user data

⚠️ **Possible Frontend Issue:**
The code navigates to HOME_SCREEN after OTP verification, but if backend doesn't return authentication token, the API middleware will redirect back to login.

**Files to Check:**
- `ahlain/src/screen/otpVerify/OtpVerification.js` (lines 96-122)
- `ahlain/src/services/ApiInstance.js` (check auth header logic)
- `ahlain/src/redux/sagas/VerifyOtpSaga.js`

**Backend API Required:**
- Endpoint: `/api/auth/verify-otp`
- Must return: User data with authentication token
- Expected response format:
```json
{
  "error": false,
  "results": {
    "buyer": { /* user data */ },
    "token": "...",
    "verifyAccount": false
  }
}
```

**Implementation Priority:** #6 (Backend Team Investigation)

---

##  MEDIUM PRIORITY BUGS

### BG_LOGIN_07 - Email Autofill in Phone Field
**Priority:** MEDIUM  
**Status:** ⚠️ NEEDS FIX

**Issue:**
Mobile number field shows email autofill suggestions. When selected, numeric part of email gets filled.

**Root Cause:**
TextInput has wrong `autoComplete` and `textContentType` properties.

**Fix Required:**
✅ **Frontend Fix:**
```javascript
<TextInput
  placeholder={'5XX XXX XXX'}
  autoComplete="tel"  // ADD THIS
  textContentType="telephoneNumber"  // ADD THIS (iOS)
  keyboardType="phone-pad"  // CHANGE from 'numeric'
  // ... rest of props
/>
```

**Files to Modify:**
- `ahlain/src/screen/logIn/LogIn.js` - Line 192
- `ahlain/src/screen/singUp/SignUp.js` - Check similar field

**Implementation Priority:** #7

---

## ✅ BUGS TO IGNORE (Saudi Arabia Specific)

None - All bugs are valid for Saudi market.

---

##  BACKEND TASKS REQUIRED

### From QA Bugs

#### 1. Country Code Validation (BG_LOGIN_08)
**Priority:** HIGH  
**API:** `POST /api/auth/login`

**Required Changes:**
- Add server-side validation for country_code + phone number format
- Reject invalid combinations
- Return proper error messages

**Example Logic:**
```javascript
if (country_code === '966') {
  const phone = phoneNumber.replace(/\s/g, '');
  if (!phone.match(/^5\d{8}$/)) {
    return res.status(400).json({
      error: true,
      message: 'Invalid Saudi phone number format'
    });
  }
}
```

---

#### 2. OTP Verification Session (BG_LOGIN_09)
**Priority:** HIGH  
**API:** `POST /api/auth/verify-otp`

**Required Changes:**
- Ensure OTP verification returns full user session
- Include authentication token in response
- Set `verifyAccount: false` after successful verification
- Create session/JWT token

**Expected Response:**
```json
{
  "error": false,
  "message": "OTP verified successfully",
  "results": {
    "buyer": {
      "id": "...",
      "email": "...",
      "phone": "...",
      // ... other user data
    },
    "token": "jwt_token_here",
    "verifyAccount": false
  }
}
```

---

### From Previous Phases (IMPLEMENTATION_COMPLETE.md)

#### 3. Recommendations Pagination API
**Priority:** MEDIUM  
**API:** `GET /api/recommendations`

**Background:**
Frontend now implements pagination (10 items per page). Backend should support:

**Query Parameters:**
- `page` (integer) - Page number (default: 1)
- `limit` (integer) - Items per page (default: 10)

**Response:**
```json
{
  "error": false,
  "results": {
    "data": [ /* 10 items */ ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalItems": 100,
      "hasMore": true
    }
  }
}
```

**Current Status:**
Frontend uses client-side pagination from initial 20 items. Backend pagination will improve performance.

---

#### 4. Vendor Categories API Enhancement
**Priority:** LOW  
**API:** `GET /api/vendor/:vendorId/products`

**Background:**
Frontend now filters products by category client-side. No backend changes needed unless you want server-side filtering.

**Optional Enhancement:**
```
GET /api/vendor/:vendorId/products?category=decoration
```

**Current Status:**
Working with client-side filtering. Backend enhancement optional.

---

##  COMPLETE FRONTEND FIX IMPLEMENTATION

I will now implement all fixable frontend bugs. Here's the order:

1. ✅ **BG_APP_06** - Add app lifecycle handling (CRITICAL)
2. ✅ **BUG-Login-02** - Fix guest login navigation (HIGH)
3. ✅ **BUG-Login-01** - Fix location permission blinks (HIGH)
4. ✅ **BUG-OTP-05** - Fix timer pause issue (HIGH)
5. ✅ **BG_LOGIN_08** - Add phone validation (HIGH)
6. ✅ **BG_LOGIN_07** - Fix autofill issue (MEDIUM)

---

##  SUCCESS METRICS

### After Frontend Fixes:
- ✅ Zero app crashes on background resume
- ✅ Smooth login flow without screen blinks
- ✅ Guest login works correctly
- ✅ OTP timer counts correctly even when backgrounded
- ✅ Proper phone number format validation
- ✅ No email suggestions in phone field

### After Backend Fixes:
- ✅ Server-side country code validation
- ✅ Complete OTP verification flow
- ✅ Efficient pagination for recommendations
- ✅ Optional category filtering

---

##  PRIORITY MATRIX

| Bug ID | Issue | Priority | Can Fix Now | Backend Required |
|--------|-------|----------|-------------|------------------|
| BG_APP_06 | Crash on resume | CRITICAL | ✅ Yes | ❌ No |
| BUG-Login-02 | Guest login | HIGH | ✅ Yes | ❌ No |
| BUG-Login-01 | Screen blinks | HIGH | ✅ Yes | ❌ No |
| BUG-OTP-05 | Timer pauses | HIGH | ✅ Yes | ❌ No |
| BG_LOGIN_08 | Country validation | HIGH | ✅ Partial | ✅ Yes |
| BG_LOGIN_09 | OTP stuck | HIGH | ❓ Maybe | ✅ Yes |
| BG_LOGIN_07 | Email autofill | MEDIUM | ✅ Yes | ❌ No |

---

##  BACKEND TEAM COMMUNICATION

**Subject:** Backend API Changes Required for Anasa Buyer App

**Dear Backend Team,**

We have identified 2 critical issues that require backend fixes:

1. **Login API** - Add country code + phone number format validation
2. **OTP Verification API** - Ensure full session creation with token

**Additionally, 2 optional enhancements:**
3. Recommendations pagination support
4. Vendor products category filtering

Please see detailed specs in sections above. Frontend fixes will be deployed first, backend fixes can follow.

**Timeline:**
- Frontend fixes: Today (May 7, 2026)
- Backend fixes needed: Within 1 week

---

## ✨ NEXT STEPS

1. ⏳ I will implement all frontend fixes now
2. ⏳ Create TESTING_GUIDE_QA_BUGS.md for QA team
3. ⏳ Share backend requirements with backend team
4. ⏳ Deploy and test

**Estimated Time:** 2-3 hours for all frontend fixes

---

**Document Status:** ✅ Complete  
**Created by:** GitHub Copilot AI  
**Review Required:** Product Owner, Backend Team Lead  
**Next Action:** Implement frontend fixes
