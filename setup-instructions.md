# How to Add This Map Page to Your React App

## 1. Install Dependencies
```bash
npm install @googlemaps/react-wrapper
```

## 2. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable "Maps JavaScript API"
4. Create credentials → API Key
5. Copy the API key

## 3. Add API Key to Environment
Create `.env` file in your project root:
```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## 4. Add the Component
- Copy the `MapView.jsx` file to your components/pages folder
- Import and use it in your app:

```jsx
import MapView from './MapView';

// In your router or app:
<Route path="/map" element={<MapView />} />
```

## 5. Styling Requirements
This component uses Tailwind CSS. If you don't have it:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Add to your `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 6. Features
- ✅ Red, Green, Yellow markers (max 3)
- ✅ Click map to add markers
- ✅ Popup info windows
- ✅ Edit/delete markers
- ✅ Dark theme styling
- ✅ Responsive design

## 7. Customization
- Replace the `Navigation` component with your own
- Modify colors in the `colors` array
- Change default map center/zoom
- Adjust styling classes as needed