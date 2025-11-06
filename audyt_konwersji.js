/**
 * ============================================================================
 * SKRYPT AUDYTU GOOGLE ADS - MAKSYMALIZACJA KONWERSJI
 * ============================================================================
 * 
 * Wersja: 1.5.0 🎯
 * Data: 2025-11-06
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
 * Changelog v1.5.0:
 * - PRECYZYJNE linki do konkretnych kampanii!
 * - Link prowadzi bezpośrednio do kampanii z problemem
 * - Nie trzeba szukać - otwórz i napraw!
 * 
 * ============================================================================
 */

// ============================================================================
// KONFIGURACJA
// ============================================================================

var CONFIG = {
  DAYS: 30,
  SPREADSHEET_NAME: 'Audyt Google Ads - Konwersje',
  MIN_CONVERSIONS: 1,
  MIN_CONVERSION_RATE: 0.01,
  HIGH_COST_THRESHOLD: 100,
  MIN_QUALITY_SCORE: 5,
  LOW_QS_CRITICAL: 3,
  MIN_CTR: 0.02,
  BUDGET_THRESHOLD: 0.85
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
  ss.insertSheet('Dane');
  
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
      
      // Usuń przecinki z liczb (separator tysięcy) przed parsowaniem
      var cleanConversions = String(rawConversions).replace(/,/g, '');
      var cleanClicks = String(rawClicks).replace(/,/g, '');
      var cleanCost = String(rawCost).replace(/,/g, '');
      
      stats.conversions = parseFloat(cleanConversions) || 0;
      stats.clicks = parseInt(cleanClicks) || 0;
      
      // Google Ads API zwraca koszt już w PLN (nie w mikros!)
      // Wystarczy parsować po usunięciu przecinków
      stats.cost = parseFloat(cleanCost) || 0;
      
      Logger.log('=== PO CZYSZCZENIU ===');
      Logger.log('Clean Cost: ' + cleanCost + ' (usunięto przecinki)');
      Logger.log('Cost in PLN: ' + stats.cost.toFixed(2));
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
          var campCostRaw = campRow['Cost'];
          var campCostClean = String(campCostRaw).replace(/,/g, '');
          var campCost = parseFloat(campCostClean) || 0;
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
      totalConversions = parseFloat(row['Conversions']) || 0;
      totalValue = parseFloat(row['ConversionValue']) || 0;
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
      var budget = parseFloat(String(row['Amount']).replace(/,/g, '')) || 0;
      var cost = parseFloat(String(row['Cost']).replace(/,/g, '')) || 0;
      var conversions = parseFloat(row['Conversions']);
      var cr = parseFloat(row['ConversionRate'].replace('%', ''));
      var budgetLostIS = row['SearchBudgetLostImpressionShare'];
      
      budgetLostIS = budgetLostIS !== '--' ? parseFloat(budgetLostIS.replace('%', '')) : 0;
      
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
      
      var utilization = (cost / (budget * days)) * 100;
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
    var report = AdsApp.report(
      'SELECT CampaignName, AdGroupName, Criteria, QualityScore, ' +
      'Clicks, Cost, Conversions, Ctr ' +
      'FROM KEYWORDS_PERFORMANCE_REPORT ' +
      'WHERE Impressions > 100 ' +
      'DURING ' + dateFrom + ',' + dateTo
    );
    
    var lowQSCount = 0;
    var rows = report.rows();
    
    while (rows.hasNext()) {
      var row = rows.next();
      var campaign = row['CampaignName'];
      var adGroup = row['AdGroupName'];
      var keyword = row['Criteria'];
      var qs = parseInt(row['QualityScore']);
      var clicks = parseInt(row['Clicks']);
      var cost = parseFloat(String(row['Cost']).replace(/,/g, '')) || 0;
      var conversions = parseFloat(row['Conversions']);
      
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
      var ctr = parseFloat(row['Ctr'].replace('%', ''));
      var clicks = parseInt(row['Clicks']);
      
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
      var cleanKeyword = keyword.replace(/[\[\]"]/g, '');
      
      for (var negative in negativeMap) {
        var cleanNegative = negative.replace(/[\[\]"]/g, '');
        
        if (cleanKeyword.indexOf(cleanNegative) > -1 || 
            cleanNegative.indexOf(cleanKeyword) > -1) {
          
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
      var clicks = parseInt(row['Clicks']);
      var cost = parseFloat(String(row['Cost']).replace(/,/g, '')) || 0;
      var conversions = parseFloat(row['Conversions']);
      var ctr = parseFloat(row['Ctr'].replace('%', ''));
      
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
    'Miejsca docelowe': baseUrl + 'placements?ocid=' + accountId
  };
  
  return links[category] || (baseUrl + 'overview?ocid=' + accountId);
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
    
    tasks.push({
      priority: problem.priority,
      task: problem.suggestedAction,
      category: problem.category,
      time: time,
      potentialGrowth: potentialGrowth,
      relatedProblem: problem.problem,
      location: problem.location,
      link: link
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
    tasksSheet.getRange(row, 9).setFormula('=HYPERLINK("' + t.link + '", "➜ Otwórz Google Ads")');
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
