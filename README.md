# DesireMobile

## How to run this project
This project use ionic, for more information, see https://ionicframework.com/
Also you need nodejs for this project.
When you cloned this git, then all what you need is to enter
`npm install`
And then you are done. By using
`ionic serve`
you can see the app on browser for debugging stuffs.

## How to build wallet for iOS
Apple rejected this app to be at app store, so there is another way to put wallet on iOS, this is how you can put your desire wallet app on iOS devices.
You need macOS to compile iOS App.

### Step 1
##### Using an Apple ID
1. Open Xcode preferences (Xcode > Preferences…)
2. Click the ‘Accounts’ tab
3. Login with your Apple ID (+ > Add Apple ID…)

Once you’ve successfully logged in, a new ‘Personal Team’ with the role ‘Free’ will appear beneath your Apple ID.

![alt text](https://ionicframework.com/img/docs/deploying/profiles.jpg)

### Step 2
##### Running your app
1. Run a production build of your app with `ionic cordova build ios`
2. Open the .xcodeproj file in platforms/ios/ in Xcode
3. Connect your phone via USB and select it as the run target
4. Click the play button in Xcode to try to run your app


### Step 3 (optimal)
##### If you changed something
use this command to update xcode project:
`ionic cordova prepare ios`
This step is only necessary when you're working on this app.


## How to build wallet for Android

Testing on Android is much easier and faster. To test on the device, simply plug it in, and run
`ionic cordova run android`
If this doesn’t work, make sure you have USB debugging enabled on your device, as described on the Android developer site:
https://developer.android.com/studio/run/device.html
