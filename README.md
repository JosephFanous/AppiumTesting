# AppiumTesting

A simple Appium script that opens Safari on iOS or Chrome on Android and measures the performance of navigating to GitHub and searching for "github".

## Features

- ✅ Supports iOS Safari and Android Chrome
- ✅ Measures navigation time to GitHub
- ✅ Performs search and measures time to load results
- ✅ Provides detailed performance metrics
- ✅ Easy to configure and run

## Requirements

### Prerequisites

1. **Node.js** (version 14 or higher)
2. **Appium Server** installed globally
3. **iOS Requirements** (for iOS testing):
   - macOS with Xcode installed
   - iOS Simulator or real iOS device
   - XCUITest driver for Appium
4. **Android Requirements** (for Android testing):
   - Android SDK installed
   - Android Emulator or real Android device
   - Chrome browser installed on the device/emulator
   - UiAutomator2 driver for Appium

### Installation

1. Clone this repository:
```bash
git clone https://github.com/JosephFanous/AppiumTesting.git
cd AppiumTesting
```

2. Install dependencies:
```bash
npm install
```

3. Install Appium globally (if not already installed):
```bash
npm install -g appium
```

4. Install Appium drivers:

For iOS:
```bash
appium driver install xcuitest
```

For Android:
```bash
appium driver install uiautomator2
```

## Configuration

Before running the tests, you may need to adjust the capabilities in `index.js` to match your environment:

### iOS Configuration
```javascript
const iosCapabilities = {
    platformName: 'iOS',
    'appium:platformVersion': '17.0', // Change to your iOS version
    'appium:deviceName': 'iPhone 15',  // Change to your device name
    'appium:browserName': 'Safari',
    'appium:automationName': 'XCUITest',
};
```

### Android Configuration
```javascript
const androidCapabilities = {
    platformName: 'Android',
    'appium:platformVersion': '13.0',      // Change to your Android version
    'appium:deviceName': 'Android Emulator', // Change to your device name
    'appium:browserName': 'Chrome',
    'appium:automationName': 'UiAutomator2',
};
```

## Usage

### Start Appium Server

First, start the Appium server in a separate terminal:

```bash
appium
```

The server should start on `http://localhost:4723`

### Run Tests

Run the test for iOS (default):
```bash
npm test
# or
npm run test:ios
# or
node index.js --platform=ios
```

Run the test for Android:
```bash
npm run test:android
# or
node index.js --platform=android
```

## What the Test Does

1. **Connects** to the Appium server
2. **Opens** Safari (iOS) or Chrome (Android)
3. **Navigates** to https://github.com
4. **Measures** the time it takes for the page to fully load
5. **Searches** for "github" using the GitHub search
6. **Measures** the time from initiating the search until the results page loads
7. **Reports** detailed performance metrics

## Sample Output

```
🚀 Starting Appium test for IOS
📱 Platform: iOS
🌐 Browser: Safari

⏳ Connecting to Appium server...
✅ Connected to Appium server

🔍 Navigating to GitHub...
⏳ Waiting for page to load...
✅ Page loaded successfully
⏱️  Navigation time: 3245ms (3.25s)

🔎 Searching for "github"...
⏳ Waiting for search results to load...
✅ Search results loaded successfully
⏱️  Search to page load time: 2156ms (2.16s)
📍 Current URL: https://github.com/search?q=github

⏱️  Total execution time: 5401ms (5.40s)

📊 Performance Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Platform:           iOS
  Browser:            Safari
  Navigation Time:    3.25s
  Search Time:        2.16s
  Total Time:         5.40s
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧹 Cleaning up...
✅ Session closed

✅ Test completed successfully!
```

## Troubleshooting

### Appium Server Not Running
Make sure the Appium server is running on `localhost:4723` before running the test.

### iOS Simulator Not Found
- Verify the device name in `iosCapabilities` matches an available simulator
- List available simulators: `xcrun simctl list devices`

### Android Emulator Not Found
- Make sure an Android emulator is running or a device is connected
- Check connected devices: `adb devices`

### Chrome Not Installed on Android
- Install Chrome browser on your Android emulator/device
- Or change the `browserName` capability to another installed browser

### Timeout Errors
- Increase timeout values in the script if your network is slow
- Check your internet connection
- Verify that the device/emulator can access the internet

## License

ISC
