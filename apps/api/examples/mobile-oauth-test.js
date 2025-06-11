/**
 * Mobile OAuth Test Example
 * 
 * This demonstrates how to decode the base64-encoded data that mobile apps
 * receive from the OAuth callback redirect.
 */

// Example base64-encoded data from OAuth callback
const exampleEncodedData = "eyJzdWNjZXNzIjp0cnVlLCJkYXRhIjp7InVzZXIiOnsiX2lkIjoidXNlcjEyMyIsImZ1bGxuYW1lIjoiSm9obiBEb2UiLCJlbWFpbCI6ImpvaG5AZXhhbXBsZS5jb20iLCJwcm9maWxlIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9hdmF0YXIuanBnIn0sImFjY2Vzc1Rva2VuIjoib2F1dGhfYWNjZXNzX3Rva2VuX2hlcmUifSwibWVzc2FnZSI6IkF1dGhlbnRpY2F0aW9uIHN1Y2Nlc3NmdWwifQ";

/**
 * Decode OAuth callback data (Node.js)
 */
function decodeOAuthData(encodedData) {
    try {
        // Decode base64url data
        const jsonString = Buffer.from(encodedData, 'base64url').toString('utf-8');
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Failed to decode OAuth data:', error);
        return null;
    }
}

/**
 * Decode OAuth callback data (Browser/React Native)
 */
function decodeOAuthDataBrowser(encodedData) {
    try {
        // Convert base64url to standard base64
        const base64 = encodedData.replace(/-/g, '+').replace(/_/g, '/');
        // Decode and parse
        const jsonString = atob(base64);
        return JSON.parse(jsonString);
    } catch (error) {
        console.error('Failed to decode OAuth data:', error);
        return null;
    }
}

// Test the decoding
console.log('Testing OAuth data decoding...\n');

const decodedData = decodeOAuthData(exampleEncodedData);
console.log('Decoded OAuth data:', JSON.stringify(decodedData, null, 2));

if (decodedData && decodedData.success) {
    console.log('\n✅ Authentication successful!');
    console.log('User ID:', decodedData.data.user._id);
    console.log('User Name:', decodedData.data.user.fullname);
    console.log('User Email:', decodedData.data.user.email);
    console.log('Access Token:', decodedData.data.accessToken);
} else {
    console.log('\n❌ Authentication failed');
    if (decodedData && decodedData.error) {
        console.log('Error:', decodedData.error);
    }
}

/**
 * Example mobile app deep link URL
 */
const exampleMobileCallback = `myapp://auth/callback?data=${exampleEncodedData}`;
console.log('\n📱 Example mobile callback URL:');
console.log(exampleMobileCallback);

/**
 * Simulate mobile app URL parsing
 */
function parseCallbackUrl(url) {
    try {
        const urlObj = new URL(url);
        const encodedData = urlObj.searchParams.get('data');
        
        if (!encodedData) {
            return { success: false, error: 'No data parameter found' };
        }
        
        return decodeOAuthDataBrowser(encodedData);
    } catch (error) {
        return { success: false, error: 'Invalid URL format' };
    }
}

console.log('\n🔗 Parsed callback data:');
const parsedResult = parseCallbackUrl(exampleMobileCallback);
console.log(JSON.stringify(parsedResult, null, 2));

module.exports = {
    decodeOAuthData,
    decodeOAuthDataBrowser,
    parseCallbackUrl
}; 