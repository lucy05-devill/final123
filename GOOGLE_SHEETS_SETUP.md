# Connect the "Request a Quote" form to Google Sheets

The contact form (`contact.html`) already POSTs its fields to a Google Apps
Script Web App, and `js/main.js` handles the request. You just need to
create the Web App once and paste its URL into the site. Takes ~5 minutes.

**Your Sheet:** https://docs.google.com/spreadsheets/d/1zIN9fU46uUsvWBU8yVnuQXnTH6x2l_68v9IAbZ8hrco/edit
**Tab name:** `SLS_techtrade` (already set as `SHEET_NAME` in `google-apps-script.gs` — no need to change it)

## 1. Open the Sheet
1. Open your sheet using the link above.
2. Confirm there's a tab named exactly `SLS_techtrade` (case-sensitive). If it doesn't exist yet, create it or rename an existing tab to match — the script auto-creates it on first submission if missing, but it's cleaner to have it ready.

## 2. Add the Apps Script
1. In that same sheet, go to **Extensions → Apps Script**. (This binds the script to *this* spreadsheet specifically — important, since a script only writes to the sheet it's bound to.)
2. Delete the placeholder code in `Code.gs`.
3. Copy everything from **`google-apps-script.gs`** (included in this delivery) and paste it in.
4. Click **Save** (disk icon), name the project `SLS Techtrade Form Handler`.

## 3. Deploy as a Web App
1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" → choose **Web app**.
3. Settings:
   - **Description**: `Contact form intake`
   - **Execute as**: `Me`
   - **Who has access**: `Anyone`
4. Click **Deploy**.
5. Authorize the script when prompted (click through the "unverified app" warning — it's your own script).
6. Copy the **Web app URL** it gives you (ends in `/exec`).

## 4. Wire it into the site
1. Open **`js/main.js`**.
2. Find this line near the top:
   ```js
   var GOOGLE_SHEET_ENDPOINT = "https://script.google.com/macros/s/REPLACE_WITH_YOUR_DEPLOYMENT_ID/exec";
   ```
3. Replace the URL with the one you copied in Step 3.6.
4. Save and re-upload `js/main.js` to your host.

## 5. Test it
1. Open `contact.html` on the live site, fill in the form, submit.
2. Check the **SLS_techtrade** tab — a new row should appear within a few seconds.
3. If nothing appears: reopen **Deploy → Manage deployments**, confirm the deployment is **Active**, and that "Who has access" is **Anyone**.

## Notes
- Every time you edit the Apps Script code, you must create a **new deployment** (or use "Manage deployments → Edit → New version") for changes to go live — editing the code alone does not update an existing `/exec` URL's behavior until redeployed.
- The form still shows a success message during local development even before you complete this setup, so front-end testing isn't blocked — but nothing is saved anywhere until the endpoint is configured.
- For a second notification channel, add `MailApp.sendEmail(...)` inside `doPost()` in the script to also email `contact@slstechtrade.com` on each submission.
