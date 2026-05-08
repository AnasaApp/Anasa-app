package com.anasa

import android.os.Build
import android.content.pm.ActivityInfo
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.facebook.react.modules.i18nmanager.I18nUtil;
import android.os.Bundle

class MainActivity : ReactActivity() {


    override fun onCreate(savedInstanceState:Bundle?) {
    super.onCreate(savedInstanceState)
    
    // Check if the device is running Android Oreo or lower
    if (Build.VERSION.SDK_INT != Build.VERSION_CODES.O) {
      requestedOrientation = ActivityInfo.SCREEN_ORIENTATION_PORTRAIT
    }
     // Get shared instance of I18nUtil
      val sharedI18nUtilInstance = I18nUtil.getInstance()

           

      // Allow RTL layout direction
       sharedI18nUtilInstance.allowRTL(this, false)
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "anasa"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
