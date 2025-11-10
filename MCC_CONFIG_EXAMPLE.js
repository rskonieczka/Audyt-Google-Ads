/**
 * ============================================================================
 * KONFIGURACJA MCC - AUDYT GOOGLE ADS (WERSJA MULTI-ACCOUNT)
 * ============================================================================
 * 
 * Wersja: 1.6.0-beta
 * Status: ✅ Naprawiono błąd PROHIBITED_METRIC_IN_SELECT_OR_WHERE_CLAUSE
 * 
 * INSTRUKCJA TWORZENIA WERSJI MCC:
 * 
 * 1. Skopiuj CAŁY kod z audyt_konwersji.js
 * 2. ZASTĄP sekcję CONFIG (linie 33-45) poniższą konfiguracją MCC_CONFIG
 * 3. ZASTĄP funkcję main() (linie 51-140) poniższą funkcją main() dla MCC
 * 4. DODAJ funkcje pomocnicze MCC na końcu pliku (poniżej)
 * 5. Wszystkie pozostałe funkcje (auditKeywords, auditCampaigns, etc.) ZOSTAJĄ BEZ ZMIAN
 * 
 * WAŻNE ZMIANY (v1.6.0-beta):
 * - ✅ Filtry MIN_IMPRESSIONS i MIN_SPEND sprawdzane PO selekcji konta (API requirement)
 * - ✅ Usunięto niedozwolone forDateRange() z account selector
 * - ✅ Poprawna obsługa Google Ads Scripts API dla MCC
 * 
 * ============================================================================
 */

// ============================================================================
// KONFIGURACJA MCC
// ============================================================================

var MCC_CONFIG = {
  // --- PODSTAWOWE USTAWIENIA AUDYTU ---
  DAYS: 30,                        // Okres analizy w dniach
  SPREADSHEET_NAME: 'Audyt Google Ads - Konwersje',
  MIN_CONVERSIONS: 1,              // Min. konwersji do analizy
  MIN_CONVERSION_RATE: 0.01,       // Min. CR = 1%
  HIGH_COST_THRESHOLD: 100,        // Próg wysokich kosztów (PLN/EUR/USD)
  MIN_QUALITY_SCORE: 5,            // Min. akceptowalny QS
  LOW_QS_CRITICAL: 3,              // Krytycznie niski QS
  MIN_CTR: 0.02,                   // Min. CTR = 2%
  BUDGET_THRESHOLD: 0.85,          // Próg wykorzystania budżetu = 85%
  KEYWORDS_LIMIT: 5000,            // Max słów do audytu (sortowane po Cost DESC)
  
  // --- FILTROWANIE KONT MCC ---
  
  // Strategia filtrowania: 'ALL', 'INCLUDE_ONLY', 'EXCLUDE_ONLY', 'SMART'
  ACCOUNT_STRATEGY: 'SMART',
  
  // INCLUDE_ONLY: Audytuj TYLKO te konta (whitelist)
  // Możesz użyć Customer ID lub nazwy konta
  ACCOUNTS_TO_INCLUDE: [
    // Przykłady:
    // '123-456-7890',              // Po Customer ID
    // 'Klient ABC',                // Po nazwie (exact match)
    // Pozostaw puste [] żeby nie używać whitelisty
  ],
  
  // EXCLUDE_ONLY: Wyklucz te konta z audytu (blacklist)
  ACCOUNTS_TO_EXCLUDE: [
    // Przykłady kont do wykluczenia:
    // '999-888-7777',              // Konto testowe
    // 'Test Account',              // Po nazwie
    // 'DEMO',                      // Zawiera słowo DEMO w nazwie
    // 'Nieaktywny Klient',
    // Pozostaw puste [] żeby nie wykluczać
  ],
  
  // SMART: Automatyczne filtrowanie (używane gdy STRATEGY = 'SMART')
  SMART_FILTERS: {
    MIN_IMPRESSIONS: 100,          // Min. wyświetlenia w ostatnich 30 dniach (sprawdzane po selekcji)
    MIN_SPEND: 50,                 // Min. wydatki w ostatnich 30 dniach (sprawdzane po selekcji)
    EXCLUDE_TEST_ACCOUNTS: true,   // Wyklucz konta z "test", "demo", "sandbox" w nazwie
    EXCLUDE_DISABLED: true,        // Wyklucz wyłączone konta (nieużywane - API ograniczenie)
    ONLY_MANAGED: true             // Tylko konta zarządzane (bez sub-managerów)
  },
  
  // --- OPCJE RAPORTOWANIA ---
  
  // 'SEPARATE' = osobny arkusz dla każdego konta
  // 'CONSOLIDATED' = jeden zbiorczy arkusz ze wszystkimi kontami
  REPORT_MODE: 'SEPARATE',
  
  // Maksymalna liczba kont do przetworzenia w jednym uruchomieniu
  // (zabezpieczenie przed timeoutem dla bardzo dużych MCC)
  MAX_ACCOUNTS_PER_RUN: 50,
  
  // Folder w Google Drive gdzie zapisywać raporty
  DRIVE_FOLDER_NAME: 'Audyty Google Ads - MCC',
  
  // Wysyłaj email z podsumowaniem po zakończeniu?
  SEND_EMAIL_SUMMARY: false,
  EMAIL_RECIPIENTS: ['twoj.email@example.com']  // Tylko jeśli SEND_EMAIL_SUMMARY = true
};

// Dla kompatybilności wstecznej - mapuj MCC_CONFIG na CONFIG
var CONFIG = {
  DAYS: MCC_CONFIG.DAYS,
  SPREADSHEET_NAME: MCC_CONFIG.SPREADSHEET_NAME,
  MIN_CONVERSIONS: MCC_CONFIG.MIN_CONVERSIONS,
  MIN_CONVERSION_RATE: MCC_CONFIG.MIN_CONVERSION_RATE,
  HIGH_COST_THRESHOLD: MCC_CONFIG.HIGH_COST_THRESHOLD,
  MIN_QUALITY_SCORE: MCC_CONFIG.MIN_QUALITY_SCORE,
  LOW_QS_CRITICAL: MCC_CONFIG.LOW_QS_CRITICAL,
  MIN_CTR: MCC_CONFIG.MIN_CTR,
  BUDGET_THRESHOLD: MCC_CONFIG.BUDGET_THRESHOLD,
  KEYWORDS_LIMIT: MCC_CONFIG.KEYWORDS_LIMIT
};

// ============================================================================
// FUNKCJA GŁÓWNA MCC
// ============================================================================

function main() {
  Logger.log('========================================');
  Logger.log('AUDYT MCC - MAKSYMALIZACJA KONWERSJI');
  Logger.log('========================================');
  Logger.log('Strategia filtrowania: ' + MCC_CONFIG.ACCOUNT_STRATEGY);
  Logger.log('Tryb raportowania: ' + MCC_CONFIG.REPORT_MODE);
  
  // Pobierz konta do audytu
  var accounts = getAccountsToAudit();
  
  if (accounts.length === 0) {
    Logger.log('❌ Brak kont do audytu! Sprawdź konfigurację filtrów.');
    return;
  }
  
  Logger.log('Znaleziono kont do audytu: ' + accounts.length);
  Logger.log('---');
  
  var accountsProcessed = 0;
  var accountsFailed = 0;
  var accountsSkipped = 0;
  var reportUrls = [];
  
  // Zbiorczy arkusz (jeśli CONSOLIDATED mode)
  var masterSpreadsheet = null;
  var allProblems = [];
  var accountsSummary = [];
  
  if (MCC_CONFIG.REPORT_MODE === 'CONSOLIDATED') {
    masterSpreadsheet = initializeMasterSpreadsheet();
  }
  
  // Iteruj przez konta
  for (var i = 0; i < accounts.length && i < MCC_CONFIG.MAX_ACCOUNTS_PER_RUN; i++) {
    var accountInfo = accounts[i];
    
    try {
      Logger.log('[' + (i + 1) + '/' + Math.min(accounts.length, MCC_CONFIG.MAX_ACCOUNTS_PER_RUN) + '] Przetwarzam: ' + accountInfo.name);
      
      // Wybierz konto
      AdsManagerApp.select(accountInfo.account);
      
      if (MCC_CONFIG.REPORT_MODE === 'SEPARATE') {
        // Osobny arkusz dla każdego konta
        var url = runAuditForAccount(accountInfo.name, accountInfo.customerId);
        reportUrls.push({
          name: accountInfo.name,
          customerId: accountInfo.customerId,
          url: url
        });
      } else {
        // Zbiorczy raport
        var result = runAuditAndCollectData(accountInfo.name, accountInfo.customerId);
        allProblems = allProblems.concat(result.problems);
        accountsSummary.push(result.summary);
      }
      
      accountsProcessed++;
      Logger.log('✅ OK: ' + accountInfo.name);
      
    } catch(e) {
      accountsFailed++;
      Logger.log('❌ BŁĄD dla ' + accountInfo.name + ': ' + e);
    }
    
    Logger.log('---');
  }
  
  // Jeśli są pozostałe konta
  if (accounts.length > MCC_CONFIG.MAX_ACCOUNTS_PER_RUN) {
    accountsSkipped = accounts.length - MCC_CONFIG.MAX_ACCOUNTS_PER_RUN;
    Logger.log('⚠️ Pominięto ' + accountsSkipped + ' kont (limit MAX_ACCOUNTS_PER_RUN)');
    Logger.log('Zwiększ MAX_ACCOUNTS_PER_RUN lub uruchom ponownie');
  }
  
  // Zapisz zbiorczy raport
  if (MCC_CONFIG.REPORT_MODE === 'CONSOLIDATED' && masterSpreadsheet) {
    writeMasterReport(masterSpreadsheet, allProblems, accountsSummary);
    Logger.log('📊 Raport zbiorczy: ' + masterSpreadsheet.getUrl());
  }
  
  // Podsumowanie
  Logger.log('========================================');
  Logger.log('PODSUMOWANIE MCC:');
  Logger.log('Przetworzone pomyślnie: ' + accountsProcessed);
  Logger.log('Błędy: ' + accountsFailed);
  if (accountsSkipped > 0) {
    Logger.log('Pominięte (limit): ' + accountsSkipped);
  }
  Logger.log('========================================');
  
  // Wypisz linki do raportów
  if (MCC_CONFIG.REPORT_MODE === 'SEPARATE' && reportUrls.length > 0) {
    Logger.log('LINKI DO RAPORTÓW:');
    for (var j = 0; j < reportUrls.length; j++) {
      Logger.log(reportUrls[j].name + ': ' + reportUrls[j].url);
    }
  }
  
  // Email summary (opcjonalnie)
  if (MCC_CONFIG.SEND_EMAIL_SUMMARY) {
    sendEmailSummary(accountsProcessed, accountsFailed, accountsSkipped, reportUrls);
  }
}

// ============================================================================
// FUNKCJE POMOCNICZE MCC
// ============================================================================

/**
 * Pobiera listę kont do audytu na podstawie konfiguracji
 */
function getAccountsToAudit() {
  var accounts = [];
  var accountSelector = AdsManagerApp.accounts();
  
  // Aplikuj tylko filtry strukturalne (NIE metryki!)
  if (MCC_CONFIG.SMART_FILTERS.ONLY_MANAGED) {
    accountSelector = accountSelector.withCondition('customer_client.manager = FALSE');
  }
  
  // UWAGA: NIE MOŻNA używać forDateRange() ani filtrów metrycznych (impressions, spend)
  // Te filtry są sprawdzane w shouldAuditAccount() po selekcji konta
  
  var accountIterator = accountSelector.get();
  
  // Zbierz wszystkie konta i sprawdź filtry
  while (accountIterator.hasNext()) {
    var account = accountIterator.next();
    var accountName = account.getName();
    var customerId = account.getCustomerId();
    
    // Sprawdź czy konto przechodzi przez filtry (włącznie z metrykami)
    if (shouldAuditAccount(account, accountName, customerId)) {
      accounts.push({
        account: account,
        name: accountName,
        customerId: customerId
      });
    }
  }
  
  return accounts;
}

/**
 * Sprawdza czy konto powinno być audytowane
 */
function shouldAuditAccount(account, accountName, customerId) {
  var strategy = MCC_CONFIG.ACCOUNT_STRATEGY;
  
  // Strategia: INCLUDE_ONLY (whitelist)
  if (strategy === 'INCLUDE_ONLY') {
    if (MCC_CONFIG.ACCOUNTS_TO_INCLUDE.length === 0) {
      return true;  // Jeśli pusta lista = wszystkie
    }
    return isInList(accountName, customerId, MCC_CONFIG.ACCOUNTS_TO_INCLUDE);
  }
  
  // Strategia: EXCLUDE_ONLY (blacklist)
  if (strategy === 'EXCLUDE_ONLY') {
    if (MCC_CONFIG.ACCOUNTS_TO_EXCLUDE.length === 0) {
      return true;  // Jeśli pusta lista = wszystkie
    }
    return !isInList(accountName, customerId, MCC_CONFIG.ACCOUNTS_TO_EXCLUDE);
  }
  
  // Strategia: ALL (wszystkie bez filtrów)
  if (strategy === 'ALL') {
    return true;
  }
  
  // Strategia: SMART (domyślna - inteligentne filtry)
  // Sprawdź blacklistę
  if (MCC_CONFIG.ACCOUNTS_TO_EXCLUDE.length > 0) {
    if (isInList(accountName, customerId, MCC_CONFIG.ACCOUNTS_TO_EXCLUDE)) {
      Logger.log('Pomijam (blacklist): ' + accountName);
      return false;
    }
  }
  
  // Sprawdź whitelistę (jeśli niepusta, tylko te konta)
  if (MCC_CONFIG.ACCOUNTS_TO_INCLUDE.length > 0) {
    if (!isInList(accountName, customerId, MCC_CONFIG.ACCOUNTS_TO_INCLUDE)) {
      return false;
    }
  }
  
  // Smart filters - test accounts
  if (MCC_CONFIG.SMART_FILTERS.EXCLUDE_TEST_ACCOUNTS) {
    var lowerName = accountName.toLowerCase();
    if (lowerName.indexOf('test') !== -1 || 
        lowerName.indexOf('demo') !== -1 || 
        lowerName.indexOf('sandbox') !== -1) {
      Logger.log('Pomijam (test account): ' + accountName);
      return false;
    }
  }
  
  // Smart filters - metryki (sprawdzane PO selekcji konta)
  if (MCC_CONFIG.SMART_FILTERS.MIN_IMPRESSIONS > 0 || MCC_CONFIG.SMART_FILTERS.MIN_SPEND > 0) {
    try {
      // Wybierz konto tymczasowo żeby sprawdzić statystyki
      AdsManagerApp.select(account);
      
      var stats = AdsApp.currentAccount().getStatsFor('LAST_30_DAYS');
      var impressions = stats.getImpressions();
      var cost = stats.getCost();
      
      // Sprawdź MIN_IMPRESSIONS
      if (MCC_CONFIG.SMART_FILTERS.MIN_IMPRESSIONS > 0) {
        if (impressions < MCC_CONFIG.SMART_FILTERS.MIN_IMPRESSIONS) {
          Logger.log('Pomijam (za mało wyświetleń: ' + impressions + '): ' + accountName);
          return false;
        }
      }
      
      // Sprawdź MIN_SPEND
      if (MCC_CONFIG.SMART_FILTERS.MIN_SPEND > 0) {
        if (cost < MCC_CONFIG.SMART_FILTERS.MIN_SPEND) {
          Logger.log('Pomijam (za mało wydatków: ' + cost.toFixed(2) + '): ' + accountName);
          return false;
        }
      }
      
    } catch(e) {
      Logger.log('Błąd sprawdzania statystyk dla ' + accountName + ': ' + e);
      // Jeśli błąd - pomiń to konto
      return false;
    }
  }
  
  return true;
}

/**
 * Sprawdza czy konto jest na liście (po nazwie lub ID)
 */
function isInList(accountName, customerId, list) {
  for (var i = 0; i < list.length; i++) {
    var item = list[i].toString();
    
    // Exact match po Customer ID
    if (item === customerId) {
      return true;
    }
    
    // Exact match po nazwie
    if (item === accountName) {
      return true;
    }
    
    // Contains match (jeśli item zawiera się w nazwie konta)
    if (accountName.indexOf(item) !== -1) {
      return true;
    }
  }
  
  return false;
}

/**
 * Uruchamia audyt dla pojedynczego konta (SEPARATE mode)
 */
function runAuditForAccount(accountName, customerId) {
  var spreadsheet = initializeSpreadsheetMCC(accountName, customerId);
  var problems = [];
  var accountStats = getAccountStats(CONFIG.DAYS);
  
  // Uruchom wszystkie moduły audytu
  try { problems = problems.concat(auditConversionTracking(CONFIG.DAYS)); } catch(e) { Logger.log('Błąd w audyt konwersji: ' + e); }
  try { problems = problems.concat(auditCampaignSettings(CONFIG.DAYS)); } catch(e) { Logger.log('Błąd w audyt kampanii: ' + e); }
  try { problems = problems.concat(auditBudgetsAndBidding(CONFIG.DAYS)); } catch(e) { Logger.log('Błąd w audyt budżetów: ' + e); }
  try { problems = problems.concat(auditKeywords(CONFIG.DAYS)); } catch(e) { Logger.log('Błąd w audyt słów: ' + e); }
  try { problems = problems.concat(auditAds(CONFIG.DAYS)); } catch(e) { Logger.log('Błąd w audyt reklam: ' + e); }
  try { problems = problems.concat(auditConflicts(CONFIG.DAYS)); } catch(e) { Logger.log('Błąd w audyt konfliktów: ' + e); }
  try { problems = problems.concat(auditPlacements(CONFIG.DAYS)); } catch(e) { Logger.log('Błąd w audyt miejsc: ' + e); }
  
  // Generuj raport
  var tasks = generateTasks(problems);
  writeToSpreadsheet(spreadsheet, problems, tasks, accountStats);
  
  return spreadsheet.getUrl();
}

/**
 * Uruchamia audyt i zbiera dane (CONSOLIDATED mode)
 */
function runAuditAndCollectData(accountName, customerId) {
  var problems = [];
  var accountStats = getAccountStats(CONFIG.DAYS);
  
  // Uruchom audyty
  try { problems = problems.concat(auditConversionTracking(CONFIG.DAYS)); } catch(e) {}
  try { problems = problems.concat(auditCampaignSettings(CONFIG.DAYS)); } catch(e) {}
  try { problems = problems.concat(auditBudgetsAndBidding(CONFIG.DAYS)); } catch(e) {}
  try { problems = problems.concat(auditKeywords(CONFIG.DAYS)); } catch(e) {}
  try { problems = problems.concat(auditAds(CONFIG.DAYS)); } catch(e) {}
  try { problems = problems.concat(auditConflicts(CONFIG.DAYS)); } catch(e) {}
  try { problems = problems.concat(auditPlacements(CONFIG.DAYS)); } catch(e) {}
  
  // Dodaj nazwę konta do każdego problemu
  for (var i = 0; i < problems.length; i++) {
    problems[i].accountName = accountName;
    problems[i].customerId = customerId;
  }
  
  return {
    problems: problems,
    summary: {
      name: accountName,
      customerId: customerId,
      problemCount: problems.length,
      highPriority: problems.filter(function(p) { return p.priority === 'HIGH'; }).length,
      conversions: accountStats.conversions,
      conversionRate: accountStats.conversionRate,
      cost: accountStats.cost
    }
  };
}

/**
 * Inicjalizuje arkusz dla pojedynczego konta (MCC mode)
 */
function initializeSpreadsheetMCC(accountName, customerId) {
  var timestamp = Utilities.formatDate(new Date(), 'GMT+1', 'yyyy-MM-dd HH:mm');
  var spreadsheetName = CONFIG.SPREADSHEET_NAME + ' - ' + accountName + ' - ' + timestamp;
  
  var spreadsheet = SpreadsheetApp.create(spreadsheetName);
  
  // Przenieś do folderu
  var folder = getOrCreateFolder(MCC_CONFIG.DRIVE_FOLDER_NAME);
  var file = DriveApp.getFileById(spreadsheet.getId());
  file.moveTo(folder);
  
  // Utwórz zakładki
  var summarySheet = spreadsheet.getActiveSheet();
  summarySheet.setName('Podsumowanie');
  
  spreadsheet.insertSheet('Problemy');
  spreadsheet.insertSheet('Zadania');
  spreadsheet.insertSheet('Dane');
  
  // Dodaj info o koncie
  summarySheet.getRange('A1').setValue('AUDYT KONTA MCC');
  summarySheet.getRange('B1').setValue(accountName);
  summarySheet.getRange('A2').setValue('Customer ID');
  summarySheet.getRange('B2').setValue(customerId);
  summarySheet.getRange('A3').setValue('Data audytu');
  summarySheet.getRange('B3').setValue(timestamp);
  summarySheet.getRange('A1:A3').setFontWeight('bold');
  
  return spreadsheet;
}

/**
 * Inicjalizuje zbiorczy arkusz MCC
 */
function initializeMasterSpreadsheet() {
  var timestamp = Utilities.formatDate(new Date(), 'GMT+1', 'yyyy-MM-dd HH:mm');
  var spreadsheetName = 'Audyt MCC - Wszystkie konta - ' + timestamp;
  
  var spreadsheet = SpreadsheetApp.create(spreadsheetName);
  
  var folder = getOrCreateFolder(MCC_CONFIG.DRIVE_FOLDER_NAME);
  DriveApp.getFileById(spreadsheet.getId()).moveTo(folder);
  
  spreadsheet.getActiveSheet().setName('Podsumowanie kont');
  spreadsheet.insertSheet('Wszystkie problemy');
  
  return spreadsheet;
}

/**
 * Zapisuje zbiorczy raport MCC
 */
function writeMasterReport(spreadsheet, allProblems, accountsSummary) {
  // Zakładka 1: Podsumowanie kont
  var summarySheet = spreadsheet.getSheetByName('Podsumowanie kont');
  summarySheet.clear();
  
  var headers = [['Konto', 'Customer ID', 'Problemów', 'HIGH', 'Konwersje', 'CR %', 'Koszt']];
  summarySheet.getRange(1, 1, 1, 7).setValues(headers);
  summarySheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#4285F4').setFontColor('#FFFFFF');
  
  if (accountsSummary.length > 0) {
    var summaryData = [];
    for (var i = 0; i < accountsSummary.length; i++) {
      var acc = accountsSummary[i];
      summaryData.push([
        acc.name,
        acc.customerId,
        acc.problemCount,
        acc.highPriority,
        acc.conversions,
        (acc.conversionRate * 100).toFixed(2) + '%',
        acc.cost.toFixed(2) + ' PLN'
      ]);
    }
    summarySheet.getRange(2, 1, summaryData.length, 7).setValues(summaryData);
  }
  
  // Zakładka 2: Wszystkie problemy
  var problemsSheet = spreadsheet.getSheetByName('Wszystkie problemy');
  problemsSheet.clear();
  
  var problemHeaders = [['Konto', 'Customer ID', 'Priorytet', 'Kategoria', 'Problem', 'Wpływ', 'Lokalizacja']];
  problemsSheet.getRange(1, 1, 1, 7).setValues(problemHeaders);
  problemsSheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#4285F4').setFontColor('#FFFFFF');
  
  if (allProblems.length > 0) {
    var problemData = [];
    for (var j = 0; j < allProblems.length; j++) {
      var p = allProblems[j];
      problemData.push([
        p.accountName || 'N/A',
        p.customerId || 'N/A',
        p.priority,
        p.category,
        p.problem,
        p.impact,
        p.location
      ]);
    }
    
    problemsSheet.getRange(2, 1, problemData.length, 7).setValues(problemData);
    
    // Kolorowanie priorytetów
    for (var k = 0; k < problemData.length; k++) {
      var priority = allProblems[k].priority;
      var color = priority === 'HIGH' ? '#EA4335' : (priority === 'MEDIUM' ? '#FBBC04' : '#34A853');
      problemsSheet.getRange(k + 2, 3).setBackground(color).setFontColor('#FFFFFF');
    }
  }
}

/**
 * Wysyła email z podsumowaniem (opcjonalnie)
 */
function sendEmailSummary(processed, failed, skipped, reportUrls) {
  if (!MCC_CONFIG.EMAIL_RECIPIENTS || MCC_CONFIG.EMAIL_RECIPIENTS.length === 0) {
    return;
  }
  
  var subject = 'Audyt MCC - Podsumowanie ' + Utilities.formatDate(new Date(), 'GMT+1', 'yyyy-MM-dd');
  var body = 'PODSUMOWANIE AUDYTU MCC\n\n';
  body += 'Przetworzone: ' + processed + '\n';
  body += 'Błędy: ' + failed + '\n';
  if (skipped > 0) {
    body += 'Pominięte: ' + skipped + '\n';
  }
  body += '\n';
  
  if (MCC_CONFIG.REPORT_MODE === 'SEPARATE' && reportUrls.length > 0) {
    body += 'LINKI DO RAPORTÓW:\n\n';
    for (var i = 0; i < reportUrls.length; i++) {
      body += reportUrls[i].name + ':\n' + reportUrls[i].url + '\n\n';
    }
  }
  
  for (var j = 0; j < MCC_CONFIG.EMAIL_RECIPIENTS.length; j++) {
    MailApp.sendEmail(MCC_CONFIG.EMAIL_RECIPIENTS[j], subject, body);
  }
}

/**
 * Znajduje lub tworzy folder w Google Drive
 */
function getOrCreateFolder(folderName) {
  var folders = DriveApp.getFoldersByName(folderName);
  
  if (folders.hasNext()) {
    return folders.next();
  } else {
    return DriveApp.createFolder(folderName);
  }
}

// ============================================================================
// ⚠️ KROK KRYTYCZNY: SKOPIUJ WSZYSTKIE FUNKCJE Z audyt_konwersji.js
// ============================================================================
//
// INSTRUKCJA:
// 1. Otwórz plik audyt_konwersji.js
// 2. Znajdź linię rozpoczynającą funkcję getAccountStats() (około linia 140-150)
// 3. SKOPIUJ wszystko od tej linii do KOŃCA pliku
// 4. WKLEJ tutaj poniżej tego komentarza
//
// Będzie to ~1200 linii kodu zawierających:
//
// ============================================================================
// FUNKCJE POMOCNICZE
// ============================================================================
//
// function getAccountStats(days) { ... }
// function getDateStringDaysAgo(days) { ... }
// function parseNumeric(value) { ... }
// function createProblem(...) { ... }
// function getCampaignLink(...) { ... }
//
// ============================================================================
// AUDYT 1: KONWERSJE
// ============================================================================
//
// function auditConversionTracking(days) { ... }
//
// ============================================================================
// AUDYT 2: KAMPANIE
// ============================================================================
//
// function auditCampaignSettings(days) { ... }
//
// ============================================================================
// AUDYT 3: BUDŻETY
// ============================================================================
//
// function auditBudgetsAndBidding(days) { ... }
//
// ============================================================================
// AUDYT 4: SŁOWA KLUCZOWE
// ============================================================================
//
// function auditKeywords(days) { ... }
//
// ============================================================================
// AUDYT 5: REKLAMY
// ============================================================================
//
// function auditAds(days) { ... }
//
// ============================================================================
// AUDYT 6: KONFLIKTY
// ============================================================================
//
// function auditConflicts(days) { ... }
//
// ============================================================================
// AUDYT 7: MIEJSCA DOCELOWE
// ============================================================================
//
// function auditPlacements(days) { ... }
//
// ============================================================================
// GENEROWANIE ZADAŃ I RAPORTÓW
// ============================================================================
//
// function generateTasks(problems) { ... }
// function writeToSpreadsheet(spreadsheet, problems, tasks, stats) { ... }
// function initializeSpreadsheet() { ... } ← NIE KOPIUJ TEJ (mamy initializeSpreadsheetMCC)
//
// ============================================================================

// ↓↓↓ WKLEJ TUTAJ KOD Z audyt_konwersji.js ↓↓↓
