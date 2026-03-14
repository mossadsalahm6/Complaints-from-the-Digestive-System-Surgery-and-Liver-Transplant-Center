/**
 * Google Apps Script - نموذج الشكاوى البسيط
 * يقوم بحفظ البيانات في Google Sheet وإرسال إيميل
 */

const SHEET_NAME = 'الشكاوى';
const RECIPIENT_EMAIL = 'giscmansedu.eg@gmail.com';

/**
 * استقبال البيانات من النموذج
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // الحصول على الورقة أو إنشاء واحدة جديدة
    const sheet = getOrCreateSheet();
    
    // إضافة البيانات إلى الورقة
    const rowData = [
      new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' }),
      data.name,
      data.phone,
      data.email,
      data.complaint
    ];
    
    sheet.appendRow(rowData);
    
    // إرسال إيميل للمركز
    sendEmailToCenter(data);
    
    // إرسال إيميل تأكيد للمستخدم
    sendConfirmationEmail(data.email, data.name);
    
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success' })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('خطأ: ' + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error' })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * إنشاء الورقة إذا لم تكن موجودة
 */
function getOrCreateSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    const headers = ['التاريخ والوقت', 'الاسم', 'الهاتف', 'البريد الإلكتروني', 'الشكوى'];
    sheet.appendRow(headers);
    
    // تنسيق رأس الجدول
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1E3A5F');
    headerRange.setFontColor('white');
    headerRange.setFontWeight('bold');
    
    // تعيين عرض الأعمدة
    sheet.setColumnWidth(1, 150);
    sheet.setColumnWidth(2, 150);
    sheet.setColumnWidth(3, 150);
    sheet.setColumnWidth(4, 200);
    sheet.setColumnWidth(5, 300);
  }
  
  return sheet;
}

/**
 * إرسال إيميل للمركز
 */
function sendEmailToCenter(data) {
  const subject = 'شكوى جديدة من ' + data.name;
  
  const emailBody = `
    شكوى جديدة:
    
    الاسم: ${data.name}
    الهاتف: ${data.phone}
    البريد الإلكتروني: ${data.email}
    التاريخ: ${new Date().toLocaleString('ar-EG', { timeZone: 'Africa/Cairo' })}
    
    الشكوى:
    ${data.complaint}
  `;
  
  try {
    GmailApp.sendEmail(RECIPIENT_EMAIL, subject, emailBody);
  } catch (error) {
    Logger.log('خطأ في إرسال الإيميل: ' + error.toString());
  }
}

/**
 * إرسال إيميل تأكيد للمستخدم
 */
function sendConfirmationEmail(userEmail, userName) {
  const subject = 'تأكيد استقبال شكواك';
  
  const emailBody = `
    السيد/السيدة ${userName},
    
    شكراً لتواصلك معنا. تم استقبال شكواك بنجاح وسيتم الرد عليك قريباً.
    
    مركز جراحة الجهاز الهضمي وزراعة الكبد
    جامعة المنصورة
  `;
  
  try {
    GmailApp.sendEmail(userEmail, subject, emailBody);
  } catch (error) {
    Logger.log('خطأ في إرسال إيميل التأكيد: ' + error.toString());
  }
}
