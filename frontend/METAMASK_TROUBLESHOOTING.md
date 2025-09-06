# MetaMask Connection Troubleshooting Guide

## 🚨 Error: "Failed to connect to MetaMask" / "MetaMask extension not found"

This error typically occurs when the MetaMask extension is not properly detected or accessible by your web application.

## 🔍 Quick Diagnosis

### 1. Check Browser Console
Open your browser's Developer Tools (F12) and look for:
- Error messages in the Console tab
- Network requests in the Network tab
- Any MetaMask-related warnings

### 2. Use Built-in Debug Tools
Your app now includes automatic debugging. Check the console for:
```
🔍 Auto-running MetaMask debug...
🔧 Debug functions available:
  debugMetaMask() - Check MetaMask status
  testMetaMaskConnection() - Test connection
  checkMetaMaskPermissions() - Check permissions
```

### 3. Access Debug Mode
Add `?debug=true` to your URL to access the MetaMask debugger:
```
http://localhost:5173/?debug=true
```

## 🛠️ Step-by-Step Solutions

### Step 1: Verify MetaMask Installation
1. **Check if MetaMask is installed:**
   - Look for the MetaMask fox icon in your browser toolbar
   - If not visible, check the extensions menu (puzzle piece icon)

2. **Install MetaMask if missing:**
   - [Chrome Web Store](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
   - [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/)
   - [Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm)

### Step 2: Enable MetaMask Extension
1. **Check if MetaMask is enabled:**
   - Right-click the MetaMask icon
   - Ensure "Enable" is checked
   - If disabled, click "Enable"

2. **Check extension permissions:**
   - Go to browser settings → Extensions
   - Find MetaMask and ensure it's allowed on your site
   - Check if it's blocked by any security settings

### Step 3: Unlock MetaMask
1. **Click the MetaMask icon**
2. **Enter your password** to unlock the wallet
3. **Ensure you're logged in** to an account

### Step 4: Check Network Settings
1. **Verify you're on the correct network:**
   - Sepolia Testnet (recommended for testing)
   - Ethereum Mainnet
   - Or any other supported network

2. **Switch networks if needed:**
   - Click the network dropdown in MetaMask
   - Select the appropriate network
   - Confirm the network switch

### Step 5: Clear Browser Data (if needed)
1. **Clear site data:**
   - Open Developer Tools (F12)
   - Right-click the refresh button
   - Select "Empty Cache and Hard Reload"

2. **Clear browser storage:**
   - Developer Tools → Application tab
   - Clear Local Storage and Session Storage
   - Refresh the page

## 🔧 Advanced Debugging

### Console Commands
Use these commands in your browser console:

```javascript
// Check MetaMask status
debugMetaMask()

// Test connection
testMetaMaskConnection()

// Check permissions
checkMetaMaskPermissions()

// Manual check
console.log('Ethereum provider:', window.ethereum)
console.log('Is MetaMask:', window.ethereum?.isMetaMask)
console.log('Selected address:', window.ethereum?.selectedAddress)
```

### Common Error Codes
- **4001**: User rejected the connection request
- **-32002**: MetaMask is already processing a request
- **-32603**: Internal JSON-RPC error (MetaMask might be locked)

## 🚫 Common Issues & Solutions

### Issue: "No Ethereum provider found"
**Solution:**
- Ensure MetaMask is installed and enabled
- Check if you're in a private/incognito window
- Verify browser security settings

### Issue: "Provider is not MetaMask"
**Solution:**
- Multiple wallet extensions might be conflicting
- Disable other wallet extensions temporarily
- Check if you have multiple MetaMask instances

### Issue: "MetaMask is locked"
**Solution:**
- Click the MetaMask icon and enter your password
- Ensure you're logged into an account
- Check if MetaMask needs to be restarted

### Issue: "Connection was rejected by user"
**Solution:**
- Check MetaMask popup for connection requests
- Ensure popup blockers aren't blocking MetaMask
- Try refreshing the page and reconnecting

### Issue: "Already processing a request"
**Solution:**
- Wait a few seconds for the current request to complete
- Check MetaMask for pending notifications
- Restart MetaMask if the issue persists

## 🌐 Browser-Specific Issues

### Chrome
- Check if MetaMask is allowed in incognito mode
- Verify extension permissions
- Check for conflicting extensions

### Firefox
- Ensure MetaMask has necessary permissions
- Check if Enhanced Tracking Protection is blocking it
- Verify extension compatibility

### Edge
- Check extension permissions
- Ensure MetaMask is enabled for your site
- Check for security policy conflicts

## 🔒 Security Considerations

### Private/Incognito Windows
- MetaMask may not work properly in private browsing
- Use regular browsing mode for testing
- Check browser settings for extension permissions

### Popup Blockers
- Ensure MetaMask popups aren't blocked
- Add your site to the allowed list
- Check browser security settings

### Firewall/Antivirus
- Some security software may block MetaMask
- Add exceptions for your development environment
- Check if localhost is blocked

## 📱 Mobile Considerations

### MetaMask Mobile App
- Mobile app works differently from browser extension
- Use WalletConnect for mobile compatibility
- Test on desktop browsers first

### Mobile Browsers
- Some mobile browsers don't support MetaMask
- Use desktop browsers for development
- Consider mobile-specific wallet solutions

## 🆘 Still Having Issues?

### 1. Check the Debug Output
- Look at the console logs
- Use the debug mode (`?debug=true`)
- Check the MetaMask status display

### 2. Verify Environment
- Ensure you're running the latest version
- Check if the issue occurs in other browsers
- Test with a fresh MetaMask installation

### 3. Get Help
- Check [MetaMask Support](https://support.metamask.io/)
- Review [MetaMask Documentation](https://docs.metamask.io/)
- Check browser extension store reviews

### 4. Development Tips
- Always test in a regular browser window
- Use the console debug functions
- Check network requests and responses
- Verify your wagmi configuration

## 🔄 Quick Reset Process

If all else fails, try this reset process:

1. **Disconnect from the site** in MetaMask
2. **Clear browser data** for your site
3. **Restart MetaMask** (disable/enable extension)
4. **Refresh the page**
5. **Try connecting again**

---

**Remember:** MetaMask connection issues are usually related to browser settings, extension permissions, or network configuration. The debug tools should help identify the specific cause.

