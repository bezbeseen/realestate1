# Google Drive Form Integration Setup

## Option 1: Google Forms (Easiest - Recommended)

### Step 1: Create a Google Form
1. Go to https://forms.google.com
2. Create a new form called "Photo Team Submissions"
3. Add these fields:
   - Name/Company (Short answer)
   - Email (Short answer)
   - Portfolio Link (Short answer)
   - Product Category (Dropdown)
   - Number of Images (Number)
   - Rate Structure (Dropdown)
   - Specific Products (Paragraph)
   - Image URLs (Paragraph)
   - Additional Notes (Paragraph)
   - File Upload (for images) - Enable "Allow multiple files"

### Step 2: Configure Form Settings
1. Click Settings (gear icon)
2. Under "Responses" tab:
   - Collect email addresses: ON
   - Allow response editing: ON
   - Limit to 1 response: OFF
3. Under "Presentation" tab:
   - Show link to submit another response: ON

### Step 3: Get the Form Link
1. Click "Send" button
2. Click the link icon
3. Copy the form URL

### Step 4: Update Your Website
Replace the form section with an embedded iframe or button link.

---

## Option 2: Google Apps Script (Advanced - Direct Integration)

### Step 1: Create a Google Apps Script Web App
```javascript
function doPost(e) {
  try {
    // Get form data
    var data = JSON.parse(e.postData.contents);
    
    // Create a new Google Sheet or append to existing
    var sheet = SpreadsheetApp.openById('YOUR_SHEET_ID');
    var activeSheet = sheet.getActiveSheet();
    
    // Add timestamp
    data.timestamp = new Date();
    
    // Append row
    activeSheet.appendRow([
      data.timestamp,
      data.photographerName,
      data.photographerEmail,
      data.portfolioLink,
      data.productCategory,
      data.imageCount,
      data.rateStructure,
      data.specificProducts,
      data.imageUrls,
      data.additionalNotes
    ]);
    
    // Handle file uploads to Google Drive
    if (data.images) {
      var folder = DriveApp.getFolderById('YOUR_FOLDER_ID');
      // Process base64 images and save to Drive
    }
    
    // Return success
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return HtmlService.createHtmlOutput('Photo Submission Endpoint Active');
}
```

### Step 2: Deploy as Web App
1. Save the script
2. Click "Deploy" > "New Deployment"
3. Choose "Web app"
4. Execute as: "Me"
5. Who has access: "Anyone"
6. Copy the Web App URL

### Step 3: Update Form Action
```javascript
// Add to your form submission JavaScript
document.getElementById('photoSubmissionForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);
  
  try {
    const response = await fetch('YOUR_WEB_APP_URL', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (response.ok) {
      alert('Submission received! We\'ll review and contact you soon.');
      e.target.reset();
    }
  } catch (error) {
    alert('Error submitting form. Please email us instead.');
  }
});
```

---

## Option 3: FormSubmit.co with Google Sheets Webhook (Simplest)

### Step 1: Set up FormSubmit
1. Go to https://formsubmit.co
2. No signup required!

### Step 2: Update your form
```html
<form action="https://formsubmit.co/YOUR_EMAIL@gmail.com" method="POST">
  <!-- Add this to auto-save to Google Sheets via Zapier/IFTTT -->
  <input type="hidden" name="_webhook" value="YOUR_ZAPIER_WEBHOOK_URL">
  <input type="hidden" name="_next" value="https://staging.getbeseen.com/thank-you.html">
  <input type="hidden" name="_subject" value="New Photo Team Submission">
  
  <!-- Your existing form fields -->
</form>
```

### Step 3: Connect to Google Sheets via Zapier
1. Create free Zapier account
2. Create Zap: FormSubmit → Google Sheets
3. Map form fields to sheet columns
4. Files will be saved as URLs in the sheet

---

## Recommended Quick Solution:

For immediate setup, I recommend creating a Google Form and embedding it. This automatically saves all submissions to Google Sheets in your Drive and can handle file uploads. 