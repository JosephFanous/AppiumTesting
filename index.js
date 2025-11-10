/**
 * Appium Navigation Test
 * 
 * This script opens Safari on iOS or Chrome on Android,
 * navigates to GitHub, and measures page load performance.
 */

const { remote } = require('webdriverio');

// iOS Safari capabilities
const iosCapabilities = {
    platformName: 'iOS',
    'appium:platformVersion': '17.0', // Adjust based on your simulator/device
    'appium:deviceName': 'iPhone 15',
    'appium:browserName': 'Safari',
    'appium:automationName': 'XCUITest',
};

// Android Chrome capabilities
const androidCapabilities = {
    platformName: 'Android',
    'appium:platformVersion': '13.0', // Adjust based on your emulator/device
    'appium:deviceName': 'Android Emulator',
    'appium:browserName': 'Chrome',
    'appium:automationName': 'UiAutomator2',
};

/**
 * Main test function
 * @param {string} platform - 'ios' or 'android'
 */
async function runTest(platform = 'ios') {
    // Select capabilities based on platform
    const capabilities = platform.toLowerCase() === 'android' 
        ? androidCapabilities 
        : iosCapabilities;

    console.log(`\n🚀 Starting Appium test for ${platform.toUpperCase()}`);
    console.log(`📱 Platform: ${capabilities.platformName}`);
    console.log(`🌐 Browser: ${capabilities['appium:browserName']}`);

    let driver;

    try {
        // Connect to Appium server
        console.log('\n⏳ Connecting to Appium server...');
        driver = await remote({
            protocol: 'http',
            hostname: 'localhost',
            port: 4723,
            path: '/',
            capabilities: capabilities,
            logLevel: 'error',
        });

        console.log('✅ Connected to Appium server');

        // Navigate to GitHub
        console.log('\n🔍 Navigating to GitHub...');
        const navigationStart = Date.now();
        
        await driver.url('https://github.com');
        
        // Wait for the page to load
        console.log('⏳ Waiting for page to load...');
        await driver.waitUntil(
            async () => {
                const readyState = await driver.execute(() => document.readyState);
                return readyState === 'complete';
            },
            {
                timeout: 30000,
                timeoutMsg: 'Page did not load within 30 seconds'
            }
        );

        const navigationEnd = Date.now();
        const navigationTime = navigationEnd - navigationStart;

        console.log(`✅ Page loaded successfully`);
        console.log(`⏱️  Navigation time: ${navigationTime}ms (${(navigationTime / 1000).toFixed(2)}s)`);

        // Perform search for "github"
        console.log('\n🔎 Searching for "github"...');
        const searchStart = Date.now();

        // Find the search input (GitHub's search button/input)
        try {
            // Click on the search button to open search input
            const searchButton = await driver.$('[data-target="qbsearch-input.inputButtonText"]');
            await searchButton.waitForExist({ timeout: 5000 });
            await searchButton.click();

            // Wait a bit for the search input to appear
            await driver.pause(500);

            // Type "github" in the search input
            const searchInput = await driver.$('#query-builder-test');
            await searchInput.waitForExist({ timeout: 5000 });
            await searchInput.setValue('github');

            // Press Enter to search
            await driver.keys('Enter');

            console.log('⏳ Waiting for search results to load...');

            // Wait for search results page to load
            await driver.waitUntil(
                async () => {
                    const url = await driver.getUrl();
                    return url.includes('/search');
                },
                {
                    timeout: 10000,
                    timeoutMsg: 'Search results page did not load within 10 seconds'
                }
            );

            // Wait for the page to be fully loaded
            await driver.waitUntil(
                async () => {
                    const readyState = await driver.execute(() => document.readyState);
                    return readyState === 'complete';
                },
                {
                    timeout: 30000,
                    timeoutMsg: 'Search results page did not complete loading within 30 seconds'
                }
            );

            const searchEnd = Date.now();
            const searchTime = searchEnd - searchStart;

            console.log('✅ Search results loaded successfully');
            console.log(`⏱️  Search to page load time: ${searchTime}ms (${(searchTime / 1000).toFixed(2)}s)`);

            // Get the current URL to confirm we're on the search results page
            const currentUrl = await driver.getUrl();
            console.log(`📍 Current URL: ${currentUrl}`);

            // Total time
            const totalTime = searchEnd - navigationStart;
            console.log(`\n⏱️  Total execution time: ${totalTime}ms (${(totalTime / 1000).toFixed(2)}s)`);

            // Print summary
            console.log('\n📊 Performance Summary:');
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log(`  Platform:           ${capabilities.platformName}`);
            console.log(`  Browser:            ${capabilities['appium:browserName']}`);
            console.log(`  Navigation Time:    ${(navigationTime / 1000).toFixed(2)}s`);
            console.log(`  Search Time:        ${(searchTime / 1000).toFixed(2)}s`);
            console.log(`  Total Time:         ${(totalTime / 1000).toFixed(2)}s`);
            console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        } catch (searchError) {
            console.error('❌ Error during search:', searchError.message);
            throw searchError;
        }

    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        throw error;
    } finally {
        // Clean up
        if (driver) {
            console.log('\n🧹 Cleaning up...');
            await driver.deleteSession();
            console.log('✅ Session closed\n');
        }
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const platformArg = args.find(arg => arg.startsWith('--platform='));
const platform = platformArg ? platformArg.split('=')[1] : 'ios';

// Validate platform
if (!['ios', 'android'].includes(platform.toLowerCase())) {
    console.error('❌ Invalid platform. Use --platform=ios or --platform=android');
    process.exit(1);
}

// Run the test
runTest(platform)
    .then(() => {
        console.log('✅ Test completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Test failed:', error);
        process.exit(1);
    });
