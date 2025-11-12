/**
 * ============================================================================
 * SKRYPT AUDYTU GOOGLE ADS - MAKSYMALIZACJA KONWERSJI
 * ============================================================================
 * 
 * Wersja: 1.8.0 ⚡
 * Data: 2025-11-12
 * 
 * Audytuje konto Google Ads pod kątem maksymalizacji konwersji.
 * Generuje arkusz Google Sheets z listą problemów i zadań.
 * 
 * INSTRUKCJA:
 * 1. Skopiuj cały kod do Google Ads Scripts
 * 2. Kliknij "Uruchom" lub "Podgląd"
 * 3. Poczekaj 2-5 minut
 * 4. Sprawdź link do arkusza w logach
 * 5. Raporty zapisują się w folderze "Audyty Google Ads"
 * 6. Kliknij linki w zadaniach - otwierają KONKRETNE kampanie!
 * 
 * Changelog v1.8.0:
 * - NOWA FUNKCJA: Audyt Search Terms Report
 * - Wykrywa kosztowne frazy bez konwersji (marnotrawstwo budżetu)
 * - Identyfikuje słowa negatywne do dodania
 * - Znajduje wartościowe frazy do rozbudowy kampanii
 * - Potencjalny wzrost ROI o 20-40%
 * 
 * Poprzednie wersje:
 * v1.7.0 - Audyt grup odbiorców (remarketing, RLSA)
 * v1.6.0 - Audyt rozszerzeń reklam (sitelinks, callouts, snippets)
 * 
 * ============================================================================
 */

// ============================================================================
// KONFIGURACJA
// ============================================================================

var CONFIG = {
  DAYS: 30,                        // Okres analizy w dniach
  SPREADSHEET_NAME: 'Audyt Google Ads - Konwersje',
  MIN_CONVERSIONS: 1,              // Min. konwersji do analizy
  MIN_CONVERSION_RATE: 0.01,       // Min. CR = 1%
  HIGH_COST_THRESHOLD: 100,        // Próg wysokich kosztów (PLN/EUR/USD)
  MIN_QUALITY_SCORE: 5,            // Min. akceptowalny QS
  LOW_QS_CRITICAL: 3,              // Krytycznie niski QS
  MIN_CTR: 0.02,                   // Min. CTR = 2%
  BUDGET_THRESHOLD: 0.85,          // Próg wykorzystania budżetu = 85%
  KEYWORDS_LIMIT: 5000             // Max słów do audytu (sortowane po Cost DESC)
                                   // Zwiększ dla bardzo dużych kont lub zmniejsz jeśli timeouty
};

// ============================================================================
// FUNKCJA GŁÓWNA
// ============================================================================

function main() {
  Logger.log('========================================');
  Logger.log('AUDYT GOOGLE ADS - MAKSYMALIZACJA KONWERSJI');
  Logger.log('========================================');
  
  var accountId = AdsApp.currentAccount().getCustomerId();
  Logger.log('Konto: ' + accountId);
  Logger.log('Okres: ' + CONFIG.DAYS + ' dni');
  
  var spreadsheet = initializeSpreadsheet();
  var problems = [];
  var accountStats = getAccountStats(CONFIG.DAYS);
  
  Logger.log('--- Rozpoczynam audyt ---');
  
  try {
    problems = problems.concat(auditConversionTracking(CONFIG.DAYS));
    Logger.log('OK Konwersje');
  } catch(e) {
    Logger.log('BLAD w audyt konwersji: ' + e);
  }
  
  try {
    problems = problems.concat(auditCampaignSettings(CONFIG.DAYS));
    Logger.log('OK Kampanie');
  } catch(e) {
    Logger.log('BLAD w audyt kampanii: ' + e);
  }
  
  try {
    problems = problems.concat(auditBudgetsAndBidding(CONFIG.DAYS));
    Logger.log('OK Budzety');
  } catch(e) {
    Logger.log('BLAD w audyt budzetow: ' + e);
  }
  
  try {
    problems = problems.concat(auditKeywords(CONFIG.DAYS));
    Logger.log('OK Slowa kluczowe');
  } catch(e) {
    Logger.log('BLAD w audyt slow: ' + e);
  }
  
  try {
    problems = problems.concat(auditAds(CONFIG.DAYS));
    Logger.log('OK Reklamy');
  } catch(e) {
    Logger.log('BLAD w audyt reklam: ' + e);
  }
  
  try {
    problems = problems.concat(auditConflicts());
    Logger.log('OK Konflikty');
  } catch(e) {
    Logger.log('BLAD w audyt konfliktow: ' + e);
  }
  
  try {
    problems = problems.concat(auditPlacements(CONFIG.DAYS));
    Logger.log('OK Miejsca docelowe');
  } catch(e) {
    Logger.log('BLAD w audyt miejsc docelowych: ' + e);
  }
  
  try {
    problems = problems.concat(auditAdExtensions(CONFIG.DAYS));
    Logger.log('OK Rozszerzenia reklam');
  } catch(e) {
    Logger.log('BLAD w audyt rozszen: ' + e);
  }
  
  try {
    problems = problems.concat(auditAudiences(CONFIG.DAYS));
    Logger.log('OK Grupy odbiorcow');
  } catch(e) {
    Logger.log('BLAD w audyt odbiorcow: ' + e);
  }
  
  try {
    problems = problems.concat(auditSearchTerms(CONFIG.DAYS));
    Logger.log('OK Frazy wyszukiwania');
  } catch(e) {
    Logger.log('BLAD w audyt fraz: ' + e);
  }
  
  Logger.log('--- Znaleziono problemow: ' + problems.length + ' ---');
  
  var tasks = generateTasks(problems);
  writeToSpreadsheet(spreadsheet, problems, tasks, accountStats);
  
  Logger.log('========================================');
  Logger.log('✅ GOTOWE!');
  Logger.log('📊 Arkusz audytu: ' + spreadsheet.getUrl());
  Logger.log('📁 Folder "Audyty Google Ads" w Google Drive');
  Logger.log('========================================');
}

// ============================================================================
// FUNKCJE POMOCNICZE
// ============================================================================

function getDateStringDaysAgo(days) {
  var date = new Date();
  date.setDate(date.getDate() - days);
  return Utilities.formatDate(date, 'GMT', 'yyyyMMdd');
}

function createProblem(priority, category, problem, impact, location, details, suggestedAction, resourceId) {
  return {
    priority: priority,
    category: category,
    problem: problem,
    impact: impact,
    location: location,
    details: details,
    suggestedAction: suggestedAction,
    resourceId: resourceId || null  // Opcjonalne ID kampanii/grupy/słowa
  };
}

function parseNumeric(value) {
  // Ujednolicona funkcja parsowania liczb z API Google Ads
  // Usuwa przecinki (separatory tysięcy) i parsuje do float
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  
  // Konwertuj do string i usuń przecinki
  var cleaned = String(value).replace(/,/g, '');
  var parsed = parseFloat(cleaned);
  
  // Zwróć 0 jeśli parsing się nie udał
  return isNaN(parsed) || !isFinite(parsed) ? 0 : parsed;
}

function safeFormat(value, decimals, suffix) {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return '0' + (suffix ? ' ' + suffix : '');
  }
  return value.toFixed(decimals || 0) + (suffix ? ' ' + suffix : '');
}

function initializeSpreadsheet() {
  // Pobierz informacje o koncie
  var account = AdsApp.currentAccount();
  var accountId = account.getCustomerId();
  var accountName = account.getName() || 'Konto';
  
  // Utwórz nazwę pliku z nazwą konta, numerem i datą
  var name = CONFIG.SPREADSHEET_NAME + ' - ' + 
             accountName + ' (' + accountId + ') - ' +
             Utilities.formatDate(new Date(), 'GMT+1', 'yyyy-MM-dd HH:mm');
  
  // Znajdź lub utwórz folder dla raportów
  var folderName = 'Audyty Google Ads';
  var folders = DriveApp.getFoldersByName(folderName);
  var folder;
  
  if (folders.hasNext()) {
    folder = folders.next();
    Logger.log('Używam istniejącego folderu: ' + folderName);
  } else {
    folder = DriveApp.createFolder(folderName);
    Logger.log('Utworzono nowy folder: ' + folderName);
  }
  
  Logger.log('📁 Link do folderu: ' + folder.getUrl());
  
  // Utwórz arkusz
  var ss = SpreadsheetApp.create(name);
  ss.getActiveSheet().setName('Podsumowanie');
  ss.insertSheet('Problemy');
  ss.insertSheet('Zadania');
  
  // Przenieś arkusz do folderu
  var file = DriveApp.getFileById(ss.getId());
  file.moveTo(folder);
  
  Logger.log('📄 Utworzono arkusz: ' + ss.getUrl());
  
  return ss;
}

function getAccountStats(days) {
  var dateFrom = getDateStringDaysAgo(days);
  var dateTo = getDateStringDaysAgo(0);
  
  var stats = {
    conversions: 0,
    clicks: 0,
    cost: 0,
    conversionRate: 0,
    costPerConversion: 0
  };
  
  try {
    Logger.log('=== POBIERANIE DANYCH ===');
    Logger.log('Okres: ' + dateFrom + ' do ' + dateTo);
    
    var report = AdsApp.report(
      'SELECT Cost, Conversions, Clicks, Impressions ' +
      'FROM ACCOUNT_PERFORMANCE_REPORT ' +
      'DURING ' + dateFrom + ',' + dateTo
    );
    
    Logger.log('Raport utworzony poprawnie');
    var rows = report.rows();
    Logger.log('Liczba wierszy: ' + (rows.hasNext() ? 'Jest' : 'Brak'));
    if (rows.hasNext()) {
      var row = rows.next();
      
      // Pobierz i zwaliduj wartości
      var rawConversions = row['Conversions'];
      var rawClicks = row['Clicks'];
      var rawCost = row['Cost'];
      
      Logger.log('=== RAW STATS Z API ===');
      Logger.log('Raw Conversions: ' + rawConversions + ' (type: ' + typeof rawConversions + ')');
      Logger.log('Raw Clicks: ' + rawClicks + ' (type: ' + typeof rawClicks + ')');
      Logger.log('Raw Cost: ' + rawCost + ' (type: ' + typeof rawCost + ')');
      
      // Użyj funkcji parseNumeric do czyszczenia i parsowania
      stats.conversions = parseNumeric(rawConversions);
      stats.clicks = parseInt(parseNumeric(rawClicks)) || 0;
      
      // Google Ads API zwraca koszt już w PLN (nie w mikros!)
      stats.cost = parseNumeric(rawCost);
      
      Logger.log('=== PO PARSOWANIU (parseNumeric) ===');
      Logger.log('Parsed Conversions: ' + stats.conversions);
      Logger.log('Parsed Clicks: ' + stats.clicks);
      Logger.log('Parsed Cost: ' + stats.cost.toFixed(2) + ' PLN');
    } else {
      Logger.log('Brak danych statystyk - pusty raport');
    }
    
    // Bezpieczne obliczenia z walidacją
    if (stats.clicks > 0) {
      stats.conversionRate = (stats.conversions / stats.clicks) * 100;
    }
    
    if (stats.conversions > 0 && stats.cost > 0) {
      stats.costPerConversion = stats.cost / stats.conversions;
    }
    
    // Loguj finalne statystyki
    Logger.log('=== FINALNE STATYSTYKI ===');
    Logger.log('  Konwersje: ' + stats.conversions);
    Logger.log('  Klikniecia: ' + stats.clicks);
    Logger.log('  Koszt: ' + stats.cost.toFixed(2) + ' PLN');
    Logger.log('  CR: ' + (stats.conversionRate || 0).toFixed(2) + '%');
    Logger.log('  Koszt/konwersja: ' + (stats.costPerConversion || 0).toFixed(2) + ' PLN');
    Logger.log('==========================');
    
    // UWAGA: Jeśli koszt = 0 PLN, sprawdź w logach powyżej wartość "Raw Cost"
    if (stats.cost === 0 && stats.clicks > 0) {
      Logger.log('⚠️ UWAGA: Koszt wynosi 0 PLN mimo kliknięć!');
      Logger.log('   To może oznaczać:');
      Logger.log('   1. Kampanie testowe/demonstracyjne bez kosztów');
      Logger.log('   2. Problem z dostępem do danych kosztów w API');
      Logger.log('   3. Koszty poniżej 0.01 PLN (zaokrąglone do 0)');
      
      // Próba alternatywnej metody przez CAMPAIGN_PERFORMANCE_REPORT
      Logger.log('');
      Logger.log('=== PRÓBA ALTERNATYWNEJ METODY ===');
      try {
        var campaignReport = AdsApp.report(
          'SELECT Cost ' +
          'FROM CAMPAIGN_PERFORMANCE_REPORT ' +
          'WHERE Status = ENABLED ' +
          'DURING ' + dateFrom + ',' + dateTo
        );
        
        var totalCostFromCampaigns = 0;
        var campaignRows = campaignReport.rows();
        while (campaignRows.hasNext()) {
          var campRow = campaignRows.next();
          var campCost = parseNumeric(campRow['Cost']);
          totalCostFromCampaigns += campCost;
        }
        
        Logger.log('Koszt z CAMPAIGN_PERFORMANCE_REPORT: ' + totalCostFromCampaigns.toFixed(2) + ' PLN');
        
        if (totalCostFromCampaigns > 0) {
          stats.cost = totalCostFromCampaigns;
          if (stats.conversions > 0) {
            stats.costPerConversion = stats.cost / stats.conversions;
          }
          Logger.log('✅ Używam kosztów z kampanii: ' + stats.cost.toFixed(2) + ' PLN');
        } else {
          Logger.log('❌ Również CAMPAIGN_PERFORMANCE_REPORT zwraca 0');
        }
      } catch(altError) {
        Logger.log('Błąd alternatywnej metody: ' + altError);
      }
    }
    
  } catch(e) {
    Logger.log('Blad w getAccountStats: ' + e);
  }
  
  return stats;
}

// ============================================================================
// AUDYT 1: ŚLEDZENIE KONWERSJI
// ============================================================================

function auditConversionTracking(days) {
  var problems = [];
  var dateFrom = getDateStringDaysAgo(days);
  var dateTo = getDateStringDaysAgo(0);
  
  try {
    var report = AdsApp.report(
      'SELECT Conversions, ConversionValue ' +
      'FROM ACCOUNT_PERFORMANCE_REPORT ' +
      'DURING ' + dateFrom + ',' + dateTo
    );
    
    var totalConversions = 0;
    var totalValue = 0;
    
    var rows = report.rows();
    if (rows.hasNext()) {
      var row = rows.next();
      totalConversions = parseNumeric(row['Conversions']);
      totalValue = parseNumeric(row['ConversionValue']);
    }
    
    if (totalConversions === 0) {
      problems.push(createProblem(
        'HIGH',
        'Konwersje',
        'Brak konwersji w ostatnich ' + days + ' dniach',
        'Sledzenie skonfigurowane ale brak danych',
        'Konto',
        { days: days },
        'Sprawdz implementacje tagow konwersji'
      ));
    }
    
    if (totalConversions > 0 && totalValue === 0) {
      problems.push(createProblem(
        'MEDIUM',
        'Konwersje',
        'Konwersje bez wartosci',
        'Brak wartosci uniemozliwia optymalizacje ROAS',
        'Konto',
        { conversions: totalConversions },
        'Dodaj wartosci do akcji konwersji'
      ));
    }
    
    var accountStats = getAccountStats(days);
    if (accountStats.conversionRate > 0 && 
        accountStats.conversionRate < CONFIG.MIN_CONVERSION_RATE * 100) {
      problems.push(createProblem(
        'MEDIUM',
        'Konwersje',
        'Niski wspolczynnik konwersji: ' + accountStats.conversionRate.toFixed(2) + '%',
        'CR ponizej 1%',
        'Konto',
        { 
          cr: accountStats.conversionRate.toFixed(2) + '%',
          clicks: accountStats.clicks
        },
        'Przeanalizuj landing pages i dopasowanie reklam'
      ));
    }
  } catch(e) {
    Logger.log('Blad w auditConversionTracking: ' + e);
  }
  
  return problems;
}

// ============================================================================
// AUDYT 2: USTAWIENIA KAMPANII
// ============================================================================

function auditCampaignSettings(days) {
  var problems = [];
  var dateFrom = getDateStringDaysAgo(days);
  var dateTo = getDateStringDaysAgo(0);
  
  try {
    var campaigns = AdsApp.campaigns()
      .withCondition('Impressions > 0')
      .forDateRange(dateFrom, dateTo)
      .get();
    
    while (campaigns.hasNext()) {
      var campaign = campaigns.next();
      var stats = campaign.getStatsFor(dateFrom, dateTo);
      var name = campaign.getName();
      var campaignId = campaign.getId();
      var bidding = campaign.getBiddingStrategyType();
      
      var nonConversionStrategies = ['MANUAL_CPC', 'MANUAL_CPM', 'TARGET_SPEND'];
      
      if (nonConversionStrategies.indexOf(bidding) > -1 && stats.getConversions() > 5) {
        problems.push(createProblem(
          'HIGH',
          'Kampanie',
          'Kampania "' + name + '" - brak strategii konwersji',
          'Manual bidding przy ' + stats.getConversions() + ' konwersjach',
          name,
          {
            strategy: bidding,
            conversions: stats.getConversions()
          },
          'Zmien na Maximize Conversions lub Target CPA',
          campaignId
        ));
      }
      
      if (campaign.isPaused() && stats.getConversions() > 10) {
        var cr = (stats.getConversions() / stats.getClicks()) * 100;
        if (cr > 2) {
          problems.push(createProblem(
            'HIGH',
            'Kampanie',
            'Wstrzymana kampania "' + name + '" - dobra historia',
            'CR ' + cr.toFixed(2) + '%, wstrzymana',
            name,
            {
              conversions: stats.getConversions(),
              cr: cr.toFixed(2) + '%'
            },
            'Rozwaz wznowienie',
            campaignId
          ));
        }
      }
      
      var schedules = campaign.targeting().adSchedules().get();
      if (schedules.hasNext() && stats.getConversions() > 5) {
        problems.push(createProblem(
          'MEDIUM',
          'Kampanie',
          'Kampania "' + name + '" - ograniczenia harmonogramu',
          'Moze blokowac potencjalne konwersje',
          name,
          { conversions: stats.getConversions() },
          'Przeanalizuj harmonogram vs. godziny konwersji',
          campaignId
        ));
      }
    }
  } catch(e) {
    Logger.log('Blad w auditCampaignSettings: ' + e);
  }
  
  return problems;
}

// ============================================================================
// AUDYT 3: BUDŻETY I LICYTACJA
// ============================================================================

function auditBudgetsAndBidding(days) {
  var problems = [];
  var dateFrom = getDateStringDaysAgo(days);
  var dateTo = getDateStringDaysAgo(0);
  
  try {
    var report = AdsApp.report(
      'SELECT CampaignName, CampaignId, Amount, Cost, Conversions, ConversionRate, ' +
      'SearchBudgetLostImpressionShare ' +
      'FROM CAMPAIGN_PERFORMANCE_REPORT ' +
      'WHERE Impressions > 0 ' +
      'DURING ' + dateFrom + ',' + dateTo
    );
    
    var rows = report.rows();
    while (rows.hasNext()) {
      var row = rows.next();
      var name = row['CampaignName'];
      var campaignId = row['CampaignId'];
      var budget = parseNumeric(row['Amount']);
      var cost = parseNumeric(row['Cost']);
      var conversions = parseNumeric(row['Conversions']);
      var cr = parseNumeric(String(row['ConversionRate']).replace('%', ''));
      var budgetLostIS = row['SearchBudgetLostImpressionShare'];
      
      budgetLostIS = budgetLostIS !== '--' ? parseNumeric(String(budgetLostIS).replace('%', '')) : 0;
      
      if (budgetLostIS > 20 && cr > 3) {
        var lostConv = (budgetLostIS / 100) * conversions;
        
        problems.push(createProblem(
          'HIGH',
          'Budzety',
          'Kampania "' + name + '" - ograniczenie budzetem',
          'Strata ' + budgetLostIS.toFixed(0) + '% IS, CR ' + cr.toFixed(2) + '%',
          name,
          {
            budget: budget.toFixed(2) + ' PLN',
            budgetLostIS: budgetLostIS.toFixed(0) + '%',
            estimatedLost: lostConv.toFixed(0) + ' konwersji'
          },
          'Zwieksz budzet o ' + ((budgetLostIS / 100) * budget).toFixed(0) + ' PLN/dzien',
          campaignId
        ));
      }
      
      // Walidacja przed dzieleniem - unikniecie dzielenia przez zero
      var totalBudget = budget * days;
      if (totalBudget > 0) {
        var utilization = (cost / totalBudget) * 100;
        
        if (utilization < 50 && conversions < 1) {
          problems.push(createProblem(
            'MEDIUM',
            'Budzety',
            'Kampania "' + name + '" - niskie wykorzystanie budzetu',
            'Tylko ' + utilization.toFixed(0) + '% budzetu, brak konwersji',
            name,
            {
              utilization: utilization.toFixed(0) + '%',
              budget: budget.toFixed(2) + ' PLN'
            },
            'Zoptymalizuj targeting lub realokuj budzet',
            campaignId
          ));
        }
      } else if (budget === 0 && cost > 0) {
        // Kampania ma koszty ale budzet wynosi 0 - nietypowa sytuacja
        problems.push(createProblem(
          'MEDIUM',
          'Budzety',
          'Kampania "' + name + '" - brak ustawionego budzetu',
          'Kampania generuje koszty (' + cost.toFixed(2) + ' PLN) ale budzet = 0',
          name,
          {
            cost: cost.toFixed(2) + ' PLN',
            budget: '0 PLN'
          },
          'Ustaw odpowiedni dzienny budzet dla kampanii',
          campaignId
        ));
      }
    }
  } catch(e) {
    Logger.log('Blad w auditBudgetsAndBidding: ' + e);
  }
  
  return problems;
}

// CIĄG DALSZY W NASTEPNYM KOMENTARZU (limit znakow)
// ============================================================================
// AUDYT 4: SŁOWA KLUCZOWE
// ============================================================================

function auditKeywords(days) {
  var problems = [];
  var dateFrom = getDateStringDaysAgo(days);
  var dateTo = getDateStringDaysAgo(0);
  
  try {
    // Limit słów dla optymalizacji wydajności (duże konta)
    // Sortowanie po Cost DESC = audytujemy najdroższe słowa (Pareto 80/20)
    // Możesz zmienić CONFIG.KEYWORDS_LIMIT jeśli potrzebujesz
    // UWAGA: W AWQL LIMIT wymaga dwóch parametrów: LIMIT startIndex, numberOfRows
    var report = AdsApp.report(
      'SELECT CampaignName, AdGroupName, Criteria, QualityScore, ' +
      'Clicks, Cost, Conversions, Ctr ' +
      'FROM KEYWORDS_PERFORMANCE_REPORT ' +
      'WHERE Impressions > 100 ' +
      'DURING ' + dateFrom + ',' + dateTo + ' ' +
      'ORDER BY Cost DESC ' +
      'LIMIT 0, ' + CONFIG.KEYWORDS_LIMIT
    );
    
    var lowQSCount = 0;
    var rows = report.rows();
    
    while (rows.hasNext()) {
      var row = rows.next();
      var campaign = row['CampaignName'];
      var adGroup = row['AdGroupName'];
      var keyword = row['Criteria'];
      var qs = parseInt(parseNumeric(row['QualityScore']));
      var clicks = parseInt(parseNumeric(row['Clicks']));
      var cost = parseNumeric(row['Cost']);
      var conversions = parseNumeric(row['Conversions']);
      
      if (qs > 0 && qs < CONFIG.MIN_QUALITY_SCORE) {
        lowQSCount++;
        var priority = qs < CONFIG.LOW_QS_CRITICAL ? 'HIGH' : 'MEDIUM';
        
        problems.push(createProblem(
          priority,
          'Slowa kluczowe',
          'Slowo "' + keyword + '" - QS: ' + qs,
          'Niski QS zwieksza koszty',
          campaign + ' > ' + adGroup,
          {
            keyword: keyword,
            qs: qs,
            cost: cost.toFixed(2) + ' PLN'
          },
          'Popraw dopasowanie reklamy/LP lub wstrzymaj'
        ));
      }
      
      if (clicks > 50 && conversions === 0 && cost > CONFIG.HIGH_COST_THRESHOLD) {
        problems.push(createProblem(
          'MEDIUM',
          'Slowa kluczowe',
          'Slowo "' + keyword + '" - koszty bez konwersji',
          clicks + ' klikniec, ' + cost.toFixed(2) + ' PLN, 0 konwersji',
          campaign + ' > ' + adGroup,
          {
            keyword: keyword,
            clicks: clicks,
            cost: cost.toFixed(2) + ' PLN'
          },
          'Wstrzymaj lub dodaj do negatywnych'
        ));
      }
    }
    
    if (lowQSCount > 10) {
      problems.push(createProblem(
        'HIGH',
        'Slowa kluczowe',
        'Duza liczba slow z niskim QS: ' + lowQSCount,
        'Systematyczny problem jakosci',
        'Konto',
        { count: lowQSCount },
        'Kompleksowy audyt jakosci reklam i LP'
      ));
    }
  } catch(e) {
    Logger.log('Blad w auditKeywords: ' + e);
  }
  
  return problems;
}

// ============================================================================
// AUDYT 5: REKLAMY
// ============================================================================

function auditAds(days) {
  var problems = [];
  var dateFrom = getDateStringDaysAgo(days);
  var dateTo = getDateStringDaysAgo(0);
  
  try {
    var report = AdsApp.report(
      'SELECT CampaignName, CampaignId, AdGroupName, Status, Ctr, Clicks ' +
      'FROM AD_PERFORMANCE_REPORT ' +
      'WHERE Impressions > 0 ' +
      'DURING ' + dateFrom + ',' + dateTo
    );
    
    var adGroupCounts = {};
    var rows = report.rows();
    
    while (rows.hasNext()) {
      var row = rows.next();
      var campaign = row['CampaignName'];
      var campaignId = row['CampaignId'];
      var adGroup = row['AdGroupName'];
      var status = row['Status'];
      var ctr = parseNumeric(String(row['Ctr']).replace('%', ''));
      var clicks = parseInt(parseNumeric(row['Clicks']));
      
      var key = campaign + '|' + adGroup + '|' + campaignId;
      adGroupCounts[key] = (adGroupCounts[key] || 0) + 1;
      
      if (status === 'DISAPPROVED') {
        problems.push(createProblem(
          'HIGH',
          'Reklamy',
          'Reklama odrzucona: ' + campaign + ' > ' + adGroup,
          'Nie wyswietla sie, blokuje grupe',
          campaign + ' > ' + adGroup,
          {},
          'Sprawdz powod i popraw zgodnie z polityka',
          campaignId
        ));
      }
      
      if (clicks > 100 && ctr < CONFIG.MIN_CTR * 100) {
        problems.push(createProblem(
          'MEDIUM',
          'Reklamy',
          'Niska wydajnosc w: ' + campaign + ' > ' + adGroup,
          'CTR ' + ctr.toFixed(2) + '% przy ' + clicks + ' kliknieciach',
          campaign + ' > ' + adGroup,
          { ctr: ctr.toFixed(2) + '%' },
          'Przetestuj nowe warianty reklam',
          campaignId
        ));
      }
    }
    
    for (var key in adGroupCounts) {
      if (adGroupCounts[key] === 1) {
        var parts = key.split('|');
        problems.push(createProblem(
          'MEDIUM',
          'Reklamy',
          'Grupa "' + parts[1] + '" - tylko 1 reklama',
          'Brak testowania A/B',
          parts[0] + ' > ' + parts[1],
          {},
          'Dodaj 2-3 warianty do testow',
          parts[2]  // campaignId
        ));
      }
    }
    
    var campaigns = AdsApp.campaigns()
      .withCondition('Status = ENABLED')
      .get();
    
    while (campaigns.hasNext()) {
      var campaign = campaigns.next();
      var name = campaign.getName();
      var campaignId = campaign.getId();
      var sitelinks = campaign.extensions().sitelinks().get();
      var callouts = campaign.extensions().callouts().get();
      
      if (!sitelinks.hasNext() && !callouts.hasNext()) {
        problems.push(createProblem(
          'MEDIUM',
          'Reklamy',
          'Kampania "' + name + '" - brak rozsszerzen',
          'Rozszerzenia zwiekszaja CTR i konwersje',
          name,
          {},
          'Dodaj sitelinks, callouts i inne rozszerzenia',
          campaignId
        ));
      }
    }
  } catch(e) {
    Logger.log('Blad w auditAds: ' + e);
  }
  
  return problems;
}

// ============================================================================
// AUDYT 6: KONFLIKTY
// ============================================================================

function auditConflicts() {
  var problems = [];
  
  try {
    var keywordMap = {};
    var negativeMap = {};
    
    var keywords = AdsApp.keywords()
      .withCondition('Status = ENABLED')
      .get();
    
    while (keywords.hasNext()) {
      var kw = keywords.next();
      var text = kw.getText().toLowerCase();
      var campaign = kw.getCampaign().getName();
      
      if (!keywordMap[text]) {
        keywordMap[text] = [];
      }
      keywordMap[text].push(campaign);
    }
    
    var campaigns = AdsApp.campaigns().get();
    while (campaigns.hasNext()) {
      var campaign = campaigns.next();
      var negatives = campaign.negativeKeywords().get();
      var campaignName = campaign.getName();
      
      while (negatives.hasNext()) {
        var neg = negatives.next();
        var text = neg.getText().toLowerCase();
        
        if (!negativeMap[text]) {
          negativeMap[text] = [];
        }
        negativeMap[text].push(campaignName);
      }
    }
    
    for (var keyword in keywordMap) {
      if (keywordMap[keyword].length > 1) {
        if (keyword.indexOf('[') === 0 && keyword.indexOf(']') === keyword.length - 1) {
          problems.push(createProblem(
            'HIGH',
            'Konflikty',
            'Exact match "' + keyword + '" w ' + keywordMap[keyword].length + ' kampaniach',
            'Wlasne kampanie konkuruja ze soba',
            'Kampanie: ' + keywordMap[keyword].join(', '),
            {
              keyword: keyword,
              campaigns: keywordMap[keyword].length
            },
            'Pozostaw w 1 kampanii, w innych dodaj do negatywnych'
          ));
        }
      }
    }
    
    for (var keyword in keywordMap) {
      var cleanKeyword = keyword.replace(/[\[\]"]/g, '').toLowerCase().trim();
      
      for (var negative in negativeMap) {
        var cleanNegative = negative.replace(/[\[\]"]/g, '').toLowerCase().trim();
        
        // Sprawdz konflikt tylko gdy:
        // 1. Slowa sa identyczne (exact match)
        // 2. Negatywne slowo jest kompletnym wyrazem w pozytywnym (word boundary)
        var hasConflict = false;
        
        if (cleanKeyword === cleanNegative) {
          // Exact match - oczywisty konflikt
          hasConflict = true;
        } else {
          // Sprawdz czy negatywne jest kompletnym slowem w pozytywnym
          // Uzywamy word boundaries (\b) aby uniknac falszywych pozytywnych
          try {
            var regex = new RegExp('\\b' + cleanNegative.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b');
            if (regex.test(cleanKeyword)) {
              hasConflict = true;
            }
          } catch(e) {
            // Fallback dla nieprawidlowych regex (np. znaki specjalne)
            // Tylko exact match
            if (cleanKeyword === cleanNegative) {
              hasConflict = true;
            }
          }
        }
        
        if (hasConflict) {
          problems.push(createProblem(
            'HIGH',
            'Konflikty',
            'Slowo "' + keyword + '" blokowane przez negatywne "' + negative + '"',
            'Pozytywne slowo moze byc blokowane',
            'Kampanie: ' + keywordMap[keyword].join(', '),
            {
              positive: keyword,
              negative: negative
            },
            'Usun negatywne lub zmien na exact match'
          ));
        }
      }
    }
    
    var campaignKeywords = {};
    keywords = AdsApp.keywords().get();
    
    while (keywords.hasNext()) {
      var kw = keywords.next();
      var text = kw.getText().toLowerCase();
      var campaign = kw.getCampaign().getName();
      var key = campaign + '|' + text;
      
      campaignKeywords[key] = (campaignKeywords[key] || 0) + 1;
    }
    
    for (var key in campaignKeywords) {
      if (campaignKeywords[key] > 1) {
        var parts = key.split('|');
        problems.push(createProblem(
          'MEDIUM',
          'Konflikty',
          'Duplikat slowa "' + parts[1] + '" w kampanii "' + parts[0] + '"',
          'To samo slowo ' + campaignKeywords[key] + ' razy w kampanii',
          parts[0],
          { keyword: parts[1], count: campaignKeywords[key] },
          'Pozostaw najlepiej dzialajaca wersje'
        ));
      }
    }
  } catch(e) {
    Logger.log('Blad w auditConflicts: ' + e);
  }
  
  return problems;
}

// ============================================================================
// AUDYT 7: MIEJSCA DOCELOWE (PLACEMENTS)
// ============================================================================

function auditPlacements(days) {
  var problems = [];
  var dateFrom = getDateStringDaysAgo(days);
  var dateTo = getDateStringDaysAgo(0);
  
  try {
    // Sprawdzenie miejsc docelowych (Display, Video)
    var placementReport = AdsApp.report(
      'SELECT CampaignName, Criteria, Clicks, Cost, Conversions, ConversionRate, Ctr ' +
      'FROM PLACEMENT_PERFORMANCE_REPORT ' +
      'WHERE Impressions > 100 ' +
      'DURING ' + dateFrom + ',' + dateTo
    );
    
    var badPlacements = [];
    var goodPlacements = [];
    var totalPlacements = 0;
    
    var rows = placementReport.rows();
    while (rows.hasNext()) {
      var row = rows.next();
      var campaign = row['CampaignName'];
      var url = row['Criteria'];
      var clicks = parseInt(parseNumeric(row['Clicks']));
      var cost = parseNumeric(row['Cost']);
      var conversions = parseNumeric(row['Conversions']);
      var ctr = parseNumeric(String(row['Ctr']).replace('%', ''));
      
      totalPlacements++;
      
      // ZLE miejsca: wysokie koszty bez konwersji
      if (cost > CONFIG.HIGH_COST_THRESHOLD && conversions === 0 && clicks > 20) {
        badPlacements.push({
          campaign: campaign,
          url: url,
          cost: cost,
          clicks: clicks,
          conversions: conversions
        });
        
        problems.push(createProblem(
          'HIGH',
          'Miejsca docelowe',
          'Miejsce "' + url + '" - wysokie koszty bez konwersji',
          cost.toFixed(2) + ' PLN wydane, ' + clicks + ' klikniec, 0 konwersji',
          campaign,
          {
            url: url,
            cost: cost.toFixed(2) + ' PLN',
            clicks: clicks,
            conversions: 0
          },
          'Wyklucz to miejsce docelowe z kampanii'
        ));
      }
      
      // ZLE miejsca: bardzo niski CTR (spam, niskiej jakosci)
      if (clicks > 50 && ctr < 0.1) {
        problems.push(createProblem(
          'MEDIUM',
          'Miejsca docelowe',
          'Miejsce "' + url + '" - bardzo niski CTR',
          'CTR ' + ctr.toFixed(3) + '% - prawdopodobnie niska jakosc ruchu',
          campaign,
          {
            url: url,
            ctr: ctr.toFixed(3) + '%',
            clicks: clicks
          },
          'Wyklucz to miejsce - niskiej jakosci ruch'
        ));
      }
      
      // DOBRE miejsca do wykorzystania
      if (conversions > 5) {
        var cr = (conversions / clicks) * 100;
        if (cr > 2) {
          goodPlacements.push({
            url: url,
            campaign: campaign,
            conversions: conversions,
            cr: cr
          });
        }
      }
    }
    
    // Podsumowanie zlych miejsc
    if (badPlacements.length > 5) {
      var totalWasted = badPlacements.reduce(function(sum, p) { 
        return sum + p.cost; 
      }, 0);
      
      problems.push(createProblem(
        'HIGH',
        'Miejsca docelowe',
        'Duza liczba zlych miejsc docelowych: ' + badPlacements.length,
        'Marnotrawstwo ' + totalWasted.toFixed(2) + ' PLN na miejsca bez konwersji',
        'Display/Video',
        {
          count: badPlacements.length,
          wasted: totalWasted.toFixed(2) + ' PLN'
        },
        'Wykonaj masowe wykluczenie zlych miejsc docelowych'
      ));
    }
    
    // Sugestia wykorzystania dobrych miejsc
    if (goodPlacements.length > 3) {
      problems.push(createProblem(
        'LOW',
        'Miejsca docelowe',
        'Znaleziono ' + goodPlacements.length + ' dobrych miejsc docelowych',
        'Mozliwosc wykorzystania w osobnej kampanii targetowanej',
        'Display/Video',
        {
          count: goodPlacements.length,
          topUrl: goodPlacements[0].url,
          topConversions: goodPlacements[0].conversions
        },
        'Utworz kampanie targetowana na najlepsze miejsca docelowe'
      ));
    }
    
  } catch(e) {
    Logger.log('Blad w auditPlacements (raport): ' + e);
  }
  
  // Sprawdzenie ustawien sieci kampanii
  try {
    var campaigns = AdsApp.campaigns()
      .withCondition('AdvertisingChannelType = DISPLAY')
      .withCondition('Status = ENABLED')
      .get();
    
    while (campaigns.hasNext()) {
      var campaign = campaigns.next();
      var name = campaign.getName();
      
      // Sprawdz czy kampania ma wykluczone miejsca
      var excludedPlacements = campaign.excludedPlacementList();
      var hasExclusions = false;
      
      if (excludedPlacements) {
        var placements = excludedPlacements.excludedPlacements().get();
        hasExclusions = placements.hasNext();
      }
      
      if (!hasExclusions) {
        problems.push(createProblem(
          'MEDIUM',
          'Miejsca docelowe',
          'Kampania Display "' + name + '" bez wykluczen miejsc',
          'Brak wykluczen moze prowadzic do marnowania budzetu',
          name,
          {},
          'Dodaj liste wykluczen (niskiej jakosci strony, aplikacje)'
        ));
      }
    }
  } catch(e) {
    Logger.log('Blad w auditPlacements (ustawienia): ' + e);
  }
  
  return problems;
}

// ============================================================================
// AUDYT 8: ROZSZERZENIA REKLAM (AD EXTENSIONS)
// ============================================================================

function auditAdExtensions(days) {
  var problems = [];
  var dateFrom = getDateStringDaysAgo(days);
  var dateTo = getDateStringDaysAgo(0);
  
  try {
    // Pobierz kampanie z dobrą wydajnością (>5 konwersji lub >100 kliknięć)
    var campaigns = AdsApp.campaigns()
      .withCondition('Impressions > 100')
      .forDateRange(dateFrom, dateTo)
      .get();
    
    Logger.log('Sprawdzam rozszerzenia dla kampanii...');
    
    while (campaigns.hasNext()) {
      var campaign = campaigns.next();
      var name = campaign.getName();
      var campaignId = campaign.getId();
      var stats = campaign.getStatsFor(dateFrom, dateTo);
      var conversions = stats.getConversions();
      var clicks = stats.getClicks();
      
      // Sprawdzaj tylko kampanie z wystarczającą aktywnością
      if (conversions < 1 && clicks < 50) {
        continue;
      }
      
      // SPRAWDZENIE 1: Sitelinks
      var sitelinkSelector = campaign.extensions().sitelinks().get();
      
      if (!sitelinkSelector.hasNext()) {
        var priority = conversions > 5 ? 'HIGH' : 'MEDIUM';
        problems.push(createProblem(
          priority,
          'Rozszerzenia',
          'Kampania "' + name + '" - brak sitelinks',
          'Sitelinks zwiększają CTR o 10-20%, kampania ma ' + conversions.toFixed(0) + ' konwersji',
          name,
          {
            conversions: conversions.toFixed(0),
            clicks: clicks,
            potentialCTRIncrease: '10-20%'
          },
          'Dodaj min. 4 sitelinki do kampanii',
          campaignId
        ));
      }
      
      // SPRAWDZENIE 2: Callouts
      var calloutSelector = campaign.extensions().callouts().get();
      
      if (!calloutSelector.hasNext()) {
        var priority = conversions > 5 ? 'HIGH' : 'MEDIUM';
        problems.push(createProblem(
          priority,
          'Rozszerzenia',
          'Kampania "' + name + '" - brak callouts',
          'Callouts są darmowe i zwiększają widoczność, kampania ma ' + clicks + ' kliknięć',
          name,
          {
            conversions: conversions.toFixed(0),
            clicks: clicks,
            benefit: 'Większa widoczność w SERP'
          },
          'Dodaj min. 4 callouts (np. "Darmowa dostawa", "24/7 Support")',
          campaignId
        ));
      }
      
      // SPRAWDZENIE 3: Structured Snippets
      var snippetSelector = campaign.extensions().snippets().get();
      
      if (!snippetSelector.hasNext() && conversions > 3) {
        problems.push(createProblem(
          'MEDIUM',
          'Rozszerzenia',
          'Kampania "' + name + '" - brak structured snippets',
          'Snippets prezentują ofertę w uporządkowany sposób',
          name,
          {
            conversions: conversions.toFixed(0),
            suggestion: 'Typy, Marki, Usługi'
          },
          'Dodaj structured snippets (np. Typy: [lista], Marki: [lista])',
          campaignId
        ));
      }
    }
    
  } catch(e) {
    Logger.log('Blad w auditAdExtensions (kampanie): ' + e);
  }
  
  // SPRAWDZENIE 4: Zostało usunięte - API nie wspiera sprawdzania statusów extensions
  
  // SPRAWDZENIE 5: Zostało usunięte - raport SITELINK_PERFORMANCE_REPORT nie jest dostępny w API
  
  Logger.log('Sprawdzono rozszerzenia reklam');
  return problems;
}

// ============================================================================
// AUDYT 9: GRUPY ODBIORCÓW (AUDIENCES)
// ============================================================================

function auditAudiences(days) {
  var problems = [];
  var dateFrom = getDateStringDaysAgo(days);
  var dateTo = getDateStringDaysAgo(0);
  
  // SPRAWDZENIE 1: Kampanie bez remarketing list
  try {
    var campaigns = AdsApp.campaigns()
      .withCondition('Status = ENABLED')
      .forDateRange(dateFrom, dateTo)
      .get();
    
    Logger.log('Sprawdzam audiences dla kampanii...');
    
    while (campaigns.hasNext()) {
      var campaign = campaigns.next();
      var stats = campaign.getStatsFor(dateFrom, dateTo);
      var conversions = stats.getConversions();
      
      // Sprawdzaj tylko kampanie z konwersjami
      if (conversions < 3) {
        continue;
      }
      
      var name = campaign.getName();
      var campaignId = campaign.getId();
      
      // Sprawdź czy kampania ma jakiekolwiek audiences (targeting lub observation)
      var audienceSelector = campaign.targeting().audiences().get();
      var hasEnabledAudiences = false;
      
      while (audienceSelector.hasNext()) {
        var audience = audienceSelector.next();
        if (audience.isEnabled()) {
          hasEnabledAudiences = true;
          break;
        }
      }
      
      var hasAudiences = hasEnabledAudiences;
      
      if (!hasAudiences) {
        var priority = conversions > 10 ? 'HIGH' : 'MEDIUM';
        problems.push(createProblem(
          priority,
          'Odbiorcy',
          'Kampania "' + name + '" - brak list remarketingowych',
          'Remarketing ma 2-3x wyższy CR niż cold traffic, kampania ma ' + conversions.toFixed(0) + ' konwersji',
          name,
          {
            conversions: conversions.toFixed(0),
            potentialCRIncrease: '2-3x',
            type: 'Brak remarketingu'
          },
          'Dodaj listy remarketingowe (obserwacja lub targeting)',
          campaignId
        ));
      }
    }
    
  } catch(e) {
    Logger.log('Blad w auditAudiences (kampanie): ' + e);
  }
  
  // SPRAWDZENIE 2: Brak wykluczeń konwertujących użytkowników
  try {
    var campaigns = AdsApp.campaigns()
      .withCondition('Status = ENABLED')
      .forDateRange(dateFrom, dateTo)
      .get();
    
    while (campaigns.hasNext()) {
      var campaign = campaigns.next();
      var stats = campaign.getStatsFor(dateFrom, dateTo);
      var conversions = stats.getConversions();
      
      if (conversions < 5) {
        continue;
      }
      
      var name = campaign.getName();
      var campaignId = campaign.getId();
      
      // Sprawdź excluded audiences
      var excludedAudiences = campaign.targeting().excludedAudiences().get();
      
      if (!excludedAudiences.hasNext()) {
        problems.push(createProblem(
          'HIGH',
          'Odbiorcy',
          'Kampania "' + name + '" - brak wykluczeń użytkowników',
          'Wykluczenie konwertujących oszczędza budżet, kampania ma ' + conversions.toFixed(0) + ' konwersji',
          name,
          {
            conversions: conversions.toFixed(0),
            suggestion: 'Wyklucz konwertujących, koszyk porzucony, obecnych klientów'
          },
          'Dodaj wykluczenia: konwertujący użytkownicy, obecni klienci',
          campaignId
        ));
      }
    }
    
  } catch(e) {
    Logger.log('Blad w auditAudiences (wykluczenia): ' + e);
  }
  
  // SPRAWDZENIE 3: Małe lub wygasłe listy remarketingowe
  try {
    var userLists = AdsApp.userlists().get();
    var smallListsCount = 0;
    var closedListsCount = 0;
    
    while (userLists.hasNext()) {
      var userList = userLists.next();
      var listName = userList.getName();
      var sizeRange = userList.getSizeRangeForSearch(); // LESS_THAN_FIVE_HUNDRED, LESS_THAN_ONE_THOUSAND, etc.
      var isClosed = userList.isClosed();
      
      // Sprawdź czy lista jest używana
      var targetedCampaignsSelector = userList.targetedCampaigns().get();
      var isUsed = false;
      
      while (targetedCampaignsSelector.hasNext()) {
        var targetedCampaign = targetedCampaignsSelector.next();
        if (targetedCampaign.isEnabled()) {
          isUsed = true;
          break;
        }
      }
      
      // Mała lista używana w kampaniach
      if (sizeRange === 'LESS_THAN_FIVE_HUNDRED' && isUsed) {
        smallListsCount++;
        
        if (smallListsCount <= 3) { // Raportuj max 3 małe listy
          problems.push(createProblem(
            'MEDIUM',
            'Odbiorcy',
            'Lista "' + listName + '" - mało użytkowników',
            'Lista ma mniej niż 500 użytkowników, może być nieefektywna',
            listName,
            {
              sizeRange: sizeRange,
              status: isClosed ? 'Zamknięta' : 'Otwarta'
            },
            'Zwiększ zasięg lub połącz z innymi listami',
            null
          ));
        }
      }
      
      // Zamknięta lista (nie zbiera nowych użytkowników)
      if (isClosed && isUsed) {
        closedListsCount++;
      }
    }
    
    if (closedListsCount > 5) {
      problems.push(createProblem(
        'LOW',
        'Odbiorcy',
        'Wiele zamkniętych list remarketingowych: ' + closedListsCount,
        'Zamknięte listy nie zbierają nowych użytkowników',
        'Konto',
        {
          closedCount: closedListsCount
        },
        'Otwórz listy aby zbierać nowych użytkowników lub usuń nieużywane',
        null
      ));
    }
    
  } catch(e) {
    Logger.log('Blad w auditAudiences (male listy): ' + e);
  }
  
  // SPRAWDZENIE 4: Nieużywane listy Customer Match
  try {
    var userLists = AdsApp.userlists().get();
    var unusedCrmLists = [];
    
    while (userLists.hasNext()) {
      var userList = userLists.next();
      var listType = userList.getType();
      
      // Sprawdź czy to lista CRM_BASED (Customer Match)
      if (listType === 'CRM_BASED') {
        var listName = userList.getName();
        
        // Sprawdź czy lista jest używana
        var targetedCampaigns = userList.targetedCampaigns()
          .withCondition('Status = ENABLED')
          .get();
        
        if (!targetedCampaigns.hasNext()) {
          unusedCrmLists.push(listName);
        }
      }
    }
    
    if (unusedCrmLists.length > 0) {
      var listNames = unusedCrmLists.slice(0, 3).join(', ');
      if (unusedCrmLists.length > 3) {
        listNames += ' (+ ' + (unusedCrmLists.length - 3) + ' innych)';
      }
      
      problems.push(createProblem(
        'LOW',
        'Odbiorcy',
        'Nieużywane listy Customer Match: ' + unusedCrmLists.length,
        'Customer Match to najlepsze targety, listy: ' + listNames,
        'Konto',
        {
          unusedCount: unusedCrmLists.length,
          examples: listNames
        },
        'Dodaj listy Customer Match do kampanii lub usuń nieużywane',
        null
      ));
    }
    
  } catch(e) {
    Logger.log('Blad w auditAudiences (Customer Match): ' + e);
  }
  
  // SPRAWDZENIE 5: Zostało usunięte - raport AUDIENCE_PERFORMANCE_REPORT nie jest dostępny w API
  
  Logger.log('Sprawdzono grupy odbiorcow');
  return problems;
}

// ============================================================================
// AUDYT 10: SEARCH TERMS REPORT (FRAZY WYSZUKIWANIA)
// ============================================================================

function auditSearchTerms(days) {
  var problems = [];
  var dateFrom = getDateStringDaysAgo(days);
  var dateTo = getDateStringDaysAgo(0);
  
  // SPRAWDZENIE 1: Kosztowne frazy bez konwersji
  try {
    Logger.log('Sprawdzam kosztowne frazy bez konwersji...');
    
    var searchTermReport = AdsApp.report(
      'SELECT campaign.name, campaign.id, ' +
      '  search_term_view.search_term, ' +
      '  metrics.cost_micros, metrics.conversions, ' +
      '  metrics.clicks, metrics.impressions ' +
      'FROM search_term_view ' +
      'WHERE metrics.cost_micros > ' + (CONFIG.HIGH_COST_THRESHOLD * 1000000) + ' ' +
      '  AND metrics.conversions = 0 ' +
      '  AND segments.date DURING LAST_' + days + '_DAYS'
    );
    
    var expensiveTerms = {};
    var rows = searchTermReport.rows();
    
    while (rows.hasNext()) {
      var row = rows.next();
      var campName = row['campaign.name'];
      var campId = row['campaign.id'];
      var searchTerm = row['search_term_view.search_term'];
      var costMicros = parseNumeric(row['metrics.cost_micros']);
      var clicks = parseNumeric(row['metrics.clicks']);
      
      var cost = costMicros / 1000000;
      
      if (!expensiveTerms[campId]) {
        expensiveTerms[campId] = {
          name: campName,
          terms: [],
          totalCost: 0
        };
      }
      
      expensiveTerms[campId].terms.push({
        term: searchTerm,
        cost: cost,
        clicks: clicks
      });
      expensiveTerms[campId].totalCost += cost;
    }
    
    // Generuj problemy dla kampanii z dużym marnotrawstwem
    for (var campId in expensiveTerms) {
      var data = expensiveTerms[campId];
      
      if (data.totalCost > CONFIG.HIGH_COST_THRESHOLD * 2) {
        var topTerms = data.terms
          .sort(function(a, b) { return b.cost - a.cost; })
          .slice(0, 3)
          .map(function(t) { return t.term + ' (' + t.cost.toFixed(2) + ' PLN)'; })
          .join(', ');
        
        problems.push(createProblem(
          'HIGH',
          'Frazy',
          'Kampania "' + data.name + '" - kosztowne frazy bez konwersji',
          'Marnotrawstwo ' + data.totalCost.toFixed(2) + ' PLN na frazy bez konwersji',
          data.name,
          {
            totalWaste: data.totalCost.toFixed(2) + ' PLN',
            termsCount: data.terms.length,
            topTerms: topTerms
          },
          'Dodaj te frazy jako słowa negatywne lub popraw targetowanie',
          campId
        ));
      }
    }
    
  } catch(e) {
    Logger.log('Blad w auditSearchTerms (kosztowne): ' + e);
  }
  
  // SPRAWDZENIE 2: Potencjalne słowa negatywne (nierelewantne frazy)
  try {
    Logger.log('Identyfikuję potencjalne słowa negatywne...');
    
    // Lista typowych nierelewantnych słów
    var negativeKeywords = ['za darmo', 'darmowy', 'darmowe', 'free', 'bezpłatny', 
                            'instrukcja', 'jak zrobić', 'tutorial', 'poradnik',
                            'praca', 'oferty pracy', 'zatrudnię', 'cv',
                            'używane', 'używany', 'second hand'];
    
    var searchTermReport2 = AdsApp.report(
      'SELECT campaign.name, campaign.id, ' +
      '  search_term_view.search_term, ' +
      '  metrics.cost_micros, metrics.clicks ' +
      'FROM search_term_view ' +
      'WHERE metrics.clicks > 5 ' +
      '  AND segments.date DURING LAST_' + days + '_DAYS'
    );
    
    var campaignBadTerms = {};
    var rows2 = searchTermReport2.rows();
    
    while (rows2.hasNext()) {
      var row = rows2.next();
      var campName = row['campaign.name'];
      var campId = row['campaign.id'];
      var searchTerm = row['search_term_view.search_term'].toLowerCase();
      var clicks = parseNumeric(row['metrics.clicks']);
      
      // Sprawdź czy fraza zawiera nierelewantne słowa
      for (var i = 0; i < negativeKeywords.length; i++) {
        if (searchTerm.indexOf(negativeKeywords[i]) !== -1) {
          if (!campaignBadTerms[campId]) {
            campaignBadTerms[campId] = {
              name: campName,
              terms: [],
              clicks: 0
            };
          }
          
          campaignBadTerms[campId].terms.push(searchTerm);
          campaignBadTerms[campId].clicks += clicks;
          break;
        }
      }
    }
    
    // Generuj problemy
    for (var campId in campaignBadTerms) {
      var data = campaignBadTerms[campId];
      
      if (data.terms.length >= 3) {
        var examples = data.terms.slice(0, 3).join(', ');
        
        problems.push(createProblem(
          'MEDIUM',
          'Frazy',
          'Kampania "' + data.name + '" - nierelewantne frazy',
          data.terms.length + ' fraz zawiera słowa jak "darmowy", "instrukcja", "praca" - ' + data.clicks + ' kliknięć',
          data.name,
          {
            badTermsCount: data.terms.length,
            wastedClicks: data.clicks,
            examples: examples
          },
          'Dodaj słowa negatywne: darmowy, instrukcja, praca, używany, etc.',
          campId
        ));
      }
    }
    
  } catch(e) {
    Logger.log('Blad w auditSearchTerms (negatywne): ' + e);
  }
  
  // SPRAWDZENIE 3: Wartościowe frazy do dodania jako keywords
  try {
    Logger.log('Szukam wartościowych fraz do rozbudowy...');
    
    var searchTermReport3 = AdsApp.report(
      'SELECT campaign.name, campaign.id, ' +
      '  search_term_view.search_term, ' +
      '  metrics.conversions, metrics.cost_micros, ' +
      '  metrics.clicks ' +
      'FROM search_term_view ' +
      'WHERE metrics.conversions > 1 ' +
      '  AND metrics.clicks > 9 ' +
      '  AND segments.date DURING LAST_' + days + '_DAYS'
    );
    
    var campaignGoodTerms = {};
    var rows3 = searchTermReport3.rows();
    
    while (rows3.hasNext()) {
      var row = rows3.next();
      var campName = row['campaign.name'];
      var campId = row['campaign.id'];
      var searchTerm = row['search_term_view.search_term'];
      var conversions = parseNumeric(row['metrics.conversions']);
      var costMicros = parseNumeric(row['metrics.cost_micros']);
      var clicks = parseNumeric(row['metrics.clicks']);
      
      var cost = costMicros / 1000000;
      var cpa = conversions > 0 ? cost / conversions : 0;
      
      if (!campaignGoodTerms[campId]) {
        campaignGoodTerms[campId] = {
          name: campName,
          terms: []
        };
      }
      
      campaignGoodTerms[campId].terms.push({
        term: searchTerm,
        conversions: conversions,
        cpa: cpa,
        clicks: clicks
      });
    }
    
    // Generuj problemy dla kampanii z wieloma wartościowymi frazami
    for (var campId in campaignGoodTerms) {
      var data = campaignGoodTerms[campId];
      
      if (data.terms.length >= 5) {
        var topTerms = data.terms
          .sort(function(a, b) { return b.conversions - a.conversions; })
          .slice(0, 3)
          .map(function(t) { return t.term + ' (' + t.conversions + ' konw.)'; })
          .join(', ');
        
        var totalConversions = data.terms.reduce(function(sum, t) { return sum + t.conversions; }, 0);
        
        problems.push(createProblem(
          'MEDIUM',
          'Frazy',
          'Kampania "' + data.name + '" - wartościowe frazy do wykorzystania',
          data.terms.length + ' fraz z łącznie ' + totalConversions.toFixed(0) + ' konwersjami - rozbuduj kampanię',
          data.name,
          {
            valuableTermsCount: data.terms.length,
            totalConversions: totalConversions.toFixed(0),
            topTerms: topTerms
          },
          'Dodaj te frazy jako exact match keywords dla lepszej kontroli',
          campId
        ));
      }
    }
    
  } catch(e) {
    Logger.log('Blad w auditSearchTerms (wartosciowe): ' + e);
  }
  
  Logger.log('Sprawdzono frazy wyszukiwania');
  return problems;
}

// ============================================================================
// GENEROWANIE ZADAŃ
// ============================================================================

function getGoogleAdsLink(category, resourceId) {
  var accountId = AdsApp.currentAccount().getCustomerId().replace(/-/g, '');
  var baseUrl = 'https://ads.google.com/aw/';
  
  // Jeśli mamy ID kampanii, generuj precyzyjny link
  if (resourceId) {
    if (category === 'Kampanie' || category === 'Budzety') {
      return baseUrl + 'campaigns/edit?ocid=' + accountId + '&campaignId=' + resourceId;
    } else if (category === 'Slowa kluczowe' || category === 'Konflikty') {
      return baseUrl + 'keywords?ocid=' + accountId + '&campaignId=' + resourceId;
    } else if (category === 'Reklamy') {
      return baseUrl + 'ads?ocid=' + accountId + '&campaignId=' + resourceId;
    } else if (category === 'Miejsca docelowe') {
      return baseUrl + 'placements?ocid=' + accountId + '&campaignId=' + resourceId;
    } else if (category === 'Rozszerzenia') {
      return baseUrl + 'extensions?ocid=' + accountId + '&campaignId=' + resourceId;
    } else if (category === 'Odbiorcy') {
      return baseUrl + 'audiences?ocid=' + accountId + '&campaignId=' + resourceId;
    } else if (category === 'Frazy') {
      return baseUrl + 'campaigns/searchterms?ocid=' + accountId + '&campaignId=' + resourceId;
    }
  }
  
  // Fallback na ogólne linki
  var links = {
    'Konwersje': baseUrl + 'conversions?ocid=' + accountId,
    'Kampanie': baseUrl + 'campaigns?ocid=' + accountId,
    'Budzety': baseUrl + 'campaigns?ocid=' + accountId,
    'Slowa kluczowe': baseUrl + 'keywords?ocid=' + accountId,
    'Reklamy': baseUrl + 'ads?ocid=' + accountId,
    'Konflikty': baseUrl + 'keywords?ocid=' + accountId,
    'Miejsca docelowe': baseUrl + 'placements?ocid=' + accountId,
    'Rozszerzenia': baseUrl + 'extensions?ocid=' + accountId,
    'Odbiorcy': baseUrl + 'audiences?ocid=' + accountId,
    'Frazy': baseUrl + 'campaigns/searchterms?ocid=' + accountId
  };
  
  return links[category] || (baseUrl + 'overview?ocid=' + accountId);
}

function getGoogleAdsPath(category) {
  var paths = {
    'Konwersje': 'Narzędzia i ustawienia → Pomiar → Konwersje',
    'Kampanie': 'Kampanie → Przegląd',
    'Budzety': 'Kampanie → Ustawienia',
    'Slowa kluczowe': 'Kampanie → Słowa kluczowe',
    'Reklamy': 'Kampanie → Reklamy i rozszerzenia',
    'Konflikty': 'Kampanie → Słowa kluczowe',
    'Miejsca docelowe': 'Kampanie → Miejsca docelowe',
    'Rozszerzenia': 'Kampanie → Reklamy i rozszerzenia → Rozszerzenia',
    'Odbiorcy': 'Kampanie → Grupy odbiorców',
    'Frazy': 'Kampanie → Frazy wyszukiwania'
  };
  
  return paths[category] || 'Google Ads → ' + category;
}

function getFilterHint(problem) {
  var hint = '';
  var problemText = problem.problem.toLowerCase();
  
  // Quality Score
  if (problemText.indexOf('quality score') !== -1 || problemText.indexOf('niski wskaźnik jakości') !== -1) {
    hint = '(Filtr: Wskaźnik jakości < 5)';
  }
  // Konwersje = 0
  else if (problemText.indexOf('bez konwersji') !== -1 || problemText.indexOf('0 konwersji') !== -1) {
    hint = '(Filtr: Konwersje = 0)';
  }
  // Niski CTR
  else if (problemText.indexOf('niski ctr') !== -1 || problemText.indexOf('niska skuteczność') !== -1) {
    hint = '(Filtr: CTR < 1%)';
  }
  // Odrzucone reklamy
  else if (problemText.indexOf('odrzucone') !== -1 || problemText.indexOf('disapproved') !== -1) {
    hint = '(Filtr: Status = Odrzucone)';
  }
  // Wstrzymane kampanie
  else if (problemText.indexOf('wstrzymane kampanie') !== -1 || problemText.indexOf('paused') !== -1) {
    hint = '(Filtr: Status = Wstrzymane)';
  }
  // Budżet ograniczony
  else if (problemText.indexOf('ograniczone przez budżet') !== -1 || problemText.indexOf('budget') !== -1) {
    hint = '(Sprawdź: Status kampanii)';
  }
  // Miejsca docelowe - spam
  else if (problemText.indexOf('spam') !== -1 || problemText.indexOf('clickfarm') !== -1) {
    hint = '(Sortuj: Koszt malejąco)';
  }
  // Brak rozszerzeń
  else if (problemText.indexOf('brak sitelinks') !== -1) {
    hint = '(Dodaj: min. 4 sitelinki)';
  }
  else if (problemText.indexOf('brak callouts') !== -1) {
    hint = '(Dodaj: min. 4 callouts)';
  }
  else if (problemText.indexOf('brak structured snippets') !== -1) {
    hint = '(Dodaj: structured snippets)';
  }
  // Audiences
  else if (problemText.indexOf('brak list remarketingowych') !== -1) {
    hint = '(Dodaj: Grupy odbiorców)';
  }
  else if (problemText.indexOf('brak wykluczeń') !== -1) {
    hint = '(Dodaj: Wykluczenia)';
  }
  // Search Terms
  else if (problemText.indexOf('kosztowne frazy') !== -1) {
    hint = '(Sortuj: Koszt malejąco)';
  }
  else if (problemText.indexOf('nierelewantne frazy') !== -1) {
    hint = '(Dodaj: Słowa kluczowe wykluczające)';
  }
  else if (problemText.indexOf('wartościowe frazy') !== -1) {
    hint = '(Filtr: Konwersje > 1, Sortuj malejąco)';
  }
  
  return hint;
}

function generateTasks(problems) {
  var tasks = [];
  
  for (var i = 0; i < problems.length; i++) {
    var problem = problems[i];
    
    var time = 'Quick Win';
    if (problem.category === 'Konwersje' && problem.priority === 'HIGH') {
      time = '1 dzien';
    } else if (problem.category === 'Konflikty') {
      time = '1h';
    }
    
    var potentialGrowth = '5-10%';
    if (problem.priority === 'HIGH') {
      potentialGrowth = '15-30%';
    } else if (problem.priority === 'MEDIUM') {
      potentialGrowth = '10-20%';
    } else {
      potentialGrowth = '5-10%';
    }
    
    // Generuj link z resourceId jeśli dostępny (precyzyjny link)
    var link = getGoogleAdsLink(problem.category, problem.resourceId);
    var linkPath = getGoogleAdsPath(problem.category);
    var filterHint = getFilterHint(problem);
    
    // Dodaj filtr do ścieżki jeśli istnieje
    if (filterHint) {
      linkPath = linkPath + ' ' + filterHint;
    }
    
    tasks.push({
      priority: problem.priority,
      task: problem.suggestedAction,
      category: problem.category,
      time: time,
      potentialGrowth: potentialGrowth,
      relatedProblem: problem.problem,
      location: problem.location,
      link: link,
      linkPath: linkPath
    });
  }
  
  return tasks;
}

// ============================================================================
// ZAPIS DO ARKUSZA
// ============================================================================

function writeToSpreadsheet(spreadsheet, problems, tasks, accountStats) {
  var priorityOrder = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
  
  problems.sort(function(a, b) {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  tasks.sort(function(a, b) {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
  
  var summarySheet = spreadsheet.getSheetByName('Podsumowanie');
  summarySheet.clear();
  
  var summaryData = [
    ['AUDYT GOOGLE ADS - MAKSYMALIZACJA KONWERSJI', ''],
    ['', ''],
    ['Data audytu:', new Date()],
    ['Konto:', AdsApp.currentAccount().getCustomerId()],
    ['Okres:', CONFIG.DAYS + ' dni'],
    ['', ''],
    ['STATYSTYKI KONTA', ''],
    ['Konwersje:', safeFormat(accountStats.conversions, 2)],
    ['Klikniecia:', accountStats.clicks || 0],
    ['Koszt:', safeFormat(accountStats.cost, 2, 'PLN')],
    ['Conversion Rate:', safeFormat(accountStats.conversionRate, 2, '%')],
    ['Koszt/konwersja:', safeFormat(accountStats.costPerConversion, 2, 'PLN')],
    ['', ''],
    ['WYNIKI AUDYTU', ''],
    ['Problemow WYSOKIEGO priorytetu:', countByPriority(problems, 'HIGH')],
    ['Problemow SREDNIEGO priorytetu:', countByPriority(problems, 'MEDIUM')],
    ['Problemow NISKIEGO priorytetu:', countByPriority(problems, 'LOW')],
    ['Lacznie problemow:', problems.length],
    ['', ''],
    ['TOP 5 NAJWAZNIEJSZYCH PROBLEMOW', ''],
  ];
  
  for (var i = 0; i < Math.min(5, problems.length); i++) {
    summaryData.push([
      (i + 1) + '. [' + problems[i].priority + '] ' + problems[i].problem,
      ''
    ]);
  }
  
  summarySheet.getRange(1, 1, summaryData.length, 2).setValues(summaryData);
  summarySheet.getRange('A1').setFontSize(14).setFontWeight('bold');
  summarySheet.setColumnWidth(1, 300);
  summarySheet.setColumnWidth(2, 400);
  
  var problemsSheet = spreadsheet.getSheetByName('Problemy');
  problemsSheet.clear();
  
  var problemsHeader = [
    ['Priorytet', 'Kategoria', 'Problem', 'Wplyw', 'Lokalizacja', 'Szczegoly', 'Zalecane dzialanie']
  ];
  
  problemsSheet.getRange(1, 1, 1, 7).setValues(problemsHeader);
  problemsSheet.getRange(1, 1, 1, 7)
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('#ffffff');
  
  for (var i = 0; i < problems.length; i++) {
    var p = problems[i];
    var row = i + 2;
    
    var detailsStr = JSON.stringify(p.details).replace(/[{}\"]/g, '');
    
    problemsSheet.getRange(row, 1, 1, 7).setValues([[
      p.priority,
      p.category,
      p.problem,
      p.impact,
      p.location,
      detailsStr,
      p.suggestedAction
    ]]);
    
    var color = '#ffffff';
    if (p.priority === 'HIGH') color = '#ffcdd2';
    else if (p.priority === 'MEDIUM') color = '#fff9c4';
    else color = '#c8e6c9';
    
    problemsSheet.getRange(row, 1, 1, 7).setBackground(color);
  }
  
  problemsSheet.setFrozenRows(1);
  problemsSheet.setColumnWidth(1, 80);
  problemsSheet.setColumnWidth(2, 120);
  problemsSheet.setColumnWidth(3, 300);
  problemsSheet.setColumnWidth(4, 250);
  problemsSheet.setColumnWidth(5, 200);
  problemsSheet.setColumnWidth(6, 200);
  problemsSheet.setColumnWidth(7, 350);
  
  var tasksSheet = spreadsheet.getSheetByName('Zadania');
  tasksSheet.clear();
  
  var tasksHeader = [
    ['Priorytet', 'Zadanie', 'Kategoria', 'Czas', 'Potencjalny wzrost', 'Problem', 'Lokalizacja', 'Status', '🔗 Link do Google Ads']
  ];
  
  tasksSheet.getRange(1, 1, 1, 9).setValues(tasksHeader);
  tasksSheet.getRange(1, 1, 1, 9)
    .setFontWeight('bold')
    .setBackground('#4285f4')
    .setFontColor('#ffffff');
  
  for (var i = 0; i < tasks.length; i++) {
    var t = tasks[i];
    var row = i + 2;
    
    // Najpierw wpisz podstawowe dane (bez linku)
    tasksSheet.getRange(row, 1, 1, 8).setValues([[
      t.priority,
      t.task,
      t.category,
      t.time,
      t.potentialGrowth,
      t.relatedProblem,
      t.location,
      'Do zrobienia'
    ]]);
    
    // Ustaw kolor tła
    var color = '#ffffff';
    if (t.priority === 'HIGH') color = '#ffcdd2';
    else if (t.priority === 'MEDIUM') color = '#fff9c4';
    else color = '#c8e6c9';
    
    tasksSheet.getRange(row, 1, 1, 9).setBackground(color);
    
    // Teraz ustaw hiperlink w kolumnie 9 (ostatnia)
    tasksSheet.getRange(row, 9).setFormula('=HYPERLINK("' + t.link + '", "➜ ' + t.linkPath + '")');
    tasksSheet.getRange(row, 9).setFontColor('#1a73e8').setFontWeight('bold');
  }
  
  tasksSheet.setFrozenRows(1);
  tasksSheet.setColumnWidth(1, 80);   // Priorytet
  tasksSheet.setColumnWidth(2, 400);  // Zadanie
  tasksSheet.setColumnWidth(3, 120);  // Kategoria
  tasksSheet.setColumnWidth(4, 100);  // Czas
  tasksSheet.setColumnWidth(5, 150);  // Potencjalny wzrost
  tasksSheet.setColumnWidth(6, 300);  // Problem
  tasksSheet.setColumnWidth(7, 200);  // Lokalizacja
  tasksSheet.setColumnWidth(8, 120);  // Status
  tasksSheet.setColumnWidth(9, 200);  // Link do Google Ads
}

function countByPriority(problems, priority) {
  var count = 0;
  for (var i = 0; i < problems.length; i++) {
    if (problems[i].priority === priority) {
      count++;
    }
  }
  return count;
}

function countByCategory(problems, category) {
  var count = 0;
  for (var i = 0; i < problems.length; i++) {
    if (problems[i].category === category) {
      count++;
    }
  }
  return count;
}
