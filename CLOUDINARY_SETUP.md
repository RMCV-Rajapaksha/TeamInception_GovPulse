# Cloudinary Setup Instructions

## To complete the image upload functionality, you need to:

### 1. Get your Cloudinary credentials
- Go to [Cloudinary Dashboard](https://cloudinary.com/console)
- Copy your Cloud Name, API Key, and API Secret

### 2. Update Environment Variables

#### Backend (.env):
```env
CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
CLOUDINARY_API_KEY=your_actual_api_key
CLOUDINARY_API_SECRET=your_actual_api_secret
```

#### Frontend (.env):
```env
VITE_CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
VITE_CLOUDINARY_API_KEY=your_actual_api_key
```

### 3. What the code does now:

When you click "Submit issue", the application will:

1. **Validate the form** - Check all required fields
2. **Get signature from backend** - Call `/api/generate-image-signature` to get Cloudinary signature
3. **Upload images to Cloudinary** - Upload each selected image using the signature
4. **Console log everything** - Log all form data including uploaded image URLs
5. **Show success modal** - Display the success message

### 4. Testing:

1. Fill out the form completely
2. Add some images (optional)
3. Click "Submit issue"
4. Check the browser console to see:
   - "Uploading images to Cloudinary..." (if images are selected)
   - "Uploaded image URLs: [array of URLs]"
   - "Form submission data: {complete form object}"

### 5. Error Handling:

- The button will show "Uploading images..." during upload
- If upload fails, you'll see an alert with error message
- Console will log any errors for debugging

### 6. Authentication:

The code assumes you have a token in localStorage. If you're using a different auth method, update this line in CreateIssue.tsx:

```tsx
'Authorization': `Bearer ${localStorage.getItem('token')}`,
```

Replace with your actual token retrieval method.
