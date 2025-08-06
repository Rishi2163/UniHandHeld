# Mobile App Setup Instructions

## Quick Start with Tunneling

The mobile app is configured to use Expo's tunneling service to work around Replit's networking limitations.

### Step 1: Install Dependencies
```bash
cd mobile
npm install --legacy-peer-deps
```

### Step 2: Start with Tunnel
```bash
# Option A: Use the tunnel script
./start-tunnel.sh

# Option B: Manual command
npm start
# (This now automatically uses --tunnel flag)
```

### Step 3: Test on Device
1. Install **Expo Go** app on your phone
2. Scan the QR code displayed in the terminal
3. The app will load with full camera access for barcode scanning

## Troubleshooting

### If tunnel doesn't work:
```bash
# Install @expo/ngrok globally
npm install -g @expo/ngrok

# Clear Expo cache and restart
npx expo start --tunnel --clear
```

### If API calls fail:
1. Make sure the main web server is running on port 5000
2. Check that the Replit URL is accessible
3. The mobile app automatically detects the correct API endpoint

## Testing Features

### Barcode Scanning
- Toggle the "Barcode" switch in the header
- Camera permissions will be requested
- Point camera at barcode to scan

### Manual Input Mode
- Turn off "Barcode" toggle
- Use manual shelf selection and SKU input

### All Screens Available:
1. **Landing** - Welcome screen
2. **B2B Packing** - Main picklists with filters
3. **Picklist Detail** - Individual picklist view
4. **Tote Scanner** - Camera scanning for totes
5. **Shelf Detail** - Shelf information
6. **SKU Scanner** - Product scanning interface
7. **Shelf Selection** - Manual shelf picker
8. **SKU Input** - Manual product entry

## Production Deployment

For production deployment with Expo Application Services (EAS):

1. Install EAS CLI: `npm install -g @expo/eas-cli`
2. Configure: `eas build:configure`
3. Build: `eas build --platform all`
4. Submit: `eas submit --platform all`

The app is fully compatible with Expo Go and doesn't require ejecting.