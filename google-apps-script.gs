/**
 * SLS TECHTRADE INNOVATIONS LLP — Contact Form → Google Sheets
 * -------------------------------------------------------------
 * Paste this entire file into a Google Apps Script project bound
 * to your Google Sheet, then deploy it as a Web App.
 * Full step-by-step instructions are in GOOGLE_SHEETS_SETUP.md.
 */

var SHEET_NAME = "SLS_techtrade"; // Tab name inside your Google Sheet

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);

    // Add header row once, if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Full Name",
        "Company Name",
        "Phone Number",
        "Email Address",
        "City / Location",
        "Origin",
        "Destination",
        "Cargo / Trade Description",
        "Page Source"
      ]);
      sheet.setFrozenRows(1);
    }

    var p = e.parameter || {};

    sheet.appendRow([
      new Date(),
      p.full_name || "",
      p.company_name || "",
      p.phone || "",
      p.email || "",
      p.city || "",
      p.origin || "",
      p.destination || "",
      p.description || "",
      p.page_source || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: lets you sanity-check the deployment by opening the
// Web App URL directly in a browser (GET request).
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "SLS Techtrade form endpoint is live" }))
    .setMimeType(ContentService.MimeType.JSON);
}
