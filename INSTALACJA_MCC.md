# 🏢 Instalacja dla kont MCC (My Client Center)

## 📋 Spis treści

1. [Czym jest konto MCC?](#czym-jest-konto-mcc)
2. [Wymagania](#wymagania)
3. [Instalacja krok po kroku](#instalacja-krok-po-kroku)
4. [Konfiguracja dla wielu klientów](#konfiguracja-dla-wielu-klientów)
5. [Automatyzacja raportów](#automatyzacja-raportów)
6. [Rozwiązywanie problemów](#rozwiązywanie-problemów)

---

## 🎯 Czym jest konto MCC?

**MCC (My Client Center)** to konto zarządzające, które pozwala agencjom i dużym reklamodawcom zarządzać wieloma kontami Google Ads z jednego miejsca.

**Korzyści dla MCC:**
- ✅ Jeden skrypt dla wszystkich klientów
- ✅ Automatyczne raporty dla każdego konta
- ✅ Centralne zarządzanie audytami
- ✅ Oszczędność czasu i zasobów

---

## ✅ Wymagania

### 1. Dostęp do konta MCC
- Musisz mieć dostęp do konta MCC (Manager Account)
- Minimum rola: **Standard** lub **Administrator**

### 2. Uprawnienia do kont klientów
- Konta klientów muszą być podłączone do MCC
- Dostęp minimum: **Read-only** (dla audytu)
- Zalecane: **Standard** (dla implementacji zmian)

### 3. Google Sheets API
- Dostęp do Google Drive dla konta MCC
- Uprawnienia do tworzenia arkuszy

---

## 🚀 Instalacja krok po kroku

### Krok 1: Zaloguj się do MCC

```
1. Otwórz: https://ads.google.com
2. Wybierz konto MCC (Manager Account)
3. W menu: Narzędzia → Skrypty
```

### Krok 2: Utwórz nowy skrypt

```
1. Kliknij "+ NOWY SKRYPT"
2. Nadaj nazwę: "Audyt Google Ads - MCC"
3. Usuń domyślny kod
```

### Krok 3: Wklej kod skryptu

```
1. Skopiuj całą zawartość pliku audyt_konwersji.js
2. Wklej do edytora Google Ads Scripts
3. Kliknij "ZAPISZ"
```

### Krok 4: Konfiguracja dla MCC

Znajdź sekcję `CONFIG` na początku skryptu i dodaj:

```javascript
var CONFIG = {
  DAYS: 30,
  SPREADSHEET_NAME: 'Audyt Google Ads',
  MIN_CONVERSION_RATE: 0.01,
  HIGH_COST_THRESHOLD: 100,
  LOW_QS_CRITICAL: 3,
  LOW_QS_WARNING: 5,
  MIN_CTR: 0.01,
  
  // KONFIGURACJA MCC
  MCC_MODE: true,                    // Włącz tryb MCC
  PROCESS_ALL_ACCOUNTS: true,        // Audytuj wszystkie konta
  ACCOUNT_LABELS: [],                // Puste = wszystkie, ['Label1', 'Label2'] = tylko oznaczone
  MIN_SPEND_THRESHOLD: 100,          // Minimalne wydatki (PLN) aby uwzględnić konto
  FOLDER_PER_CLIENT: true            // Osobny folder dla każdego klienta
};
```

### Krok 5: Dodaj funkcję iteracji MCC

Dodaj tę funkcję na początku skryptu (po CONFIG):

```javascript
// ============================================================================
// FUNKCJA GŁÓWNA DLA MCC
// ============================================================================

function mainMCC() {
  Logger.log('🏢 === AUDYT MCC - START ===');
  Logger.log('');
  
  var accountSelector = AdsManagerApp.accounts();
  
  // Filtruj po etykietach jeśli ustawione
  if (CONFIG.ACCOUNT_LABELS && CONFIG.ACCOUNT_LABELS.length > 0) {
    accountSelector = accountSelector.withLabels(CONFIG.ACCOUNT_LABELS);
  }
  
  // Filtruj po minimalnych wydatkach
  if (CONFIG.MIN_SPEND_THRESHOLD > 0) {
    var dateFrom = getDateStringDaysAgo(CONFIG.DAYS);
    var dateTo = getDateStringDaysAgo(0);
    accountSelector = accountSelector
      .forDateRange(dateFrom, dateTo)
      .withCondition('Cost > ' + CONFIG.MIN_SPEND_THRESHOLD);
  }
  
  var accountIterator = accountSelector.get();
  var totalAccounts = 0;
  var processedAccounts = 0;
  var failedAccounts = [];
  
  Logger.log('📊 Znalezione konta do audytu:');
  
  while (accountIterator.hasNext()) {
    var account = accountIterator.next();
    totalAccounts++;
    
    AdsManagerApp.select(account);
    
    var accountName = account.getName();
    var customerId = account.getCustomerId();
    
    Logger.log('');
    Logger.log('▶️  Przetwarzanie: ' + accountName + ' (' + customerId + ')');
    Logger.log('─────────────────────────────────────────────────────');
    
    try {
      // Uruchom główną funkcję audytu
      main();
      processedAccounts++;
      Logger.log('✅ Zakończono audyt dla: ' + accountName);
    } catch (e) {
      Logger.log('❌ Błąd dla konta: ' + accountName);
      Logger.log('   Szczegóły: ' + e.message);
      failedAccounts.push({
        name: accountName,
        id: customerId,
        error: e.message
      });
    }
    
    Logger.log('─────────────────────────────────────────────────────');
  }
  
  Logger.log('');
  Logger.log('🏢 === AUDYT MCC - PODSUMOWANIE ===');
  Logger.log('📊 Wszystkie konta: ' + totalAccounts);
  Logger.log('✅ Przetworzone pomyślnie: ' + processedAccounts);
  Logger.log('❌ Błędy: ' + failedAccounts.length);
  
  if (failedAccounts.length > 0) {
    Logger.log('');
    Logger.log('❌ Konta z błędami:');
    for (var i = 0; i < failedAccounts.length; i++) {
      Logger.log('   - ' + failedAccounts[i].name + ' (' + failedAccounts[i].id + ')');
      Logger.log('     Błąd: ' + failedAccounts[i].error);
    }
  }
  
  Logger.log('');
  Logger.log('🎉 Audyt MCC zakończony!');
}
```

### Krok 6: Modyfikacja funkcji main()

Znajdź funkcję `main()` i dodaj na początku:

```javascript
function main() {
  // Sprawdź czy to konto MCC
  if (CONFIG.MCC_MODE && typeof AdsManagerApp !== 'undefined') {
    // Jeśli uruchomiono bezpośrednio main() w MCC, wywołaj mainMCC()
    if (AdsApp.currentAccount().getCustomerId() === AdsManagerApp.currentAccount().getCustomerId()) {
      mainMCC();
      return;
    }
  }
  
  // Reszta funkcji main() pozostaje bez zmian
  Logger.log('🚀 Rozpoczynam audyt Google Ads...');
  // ... (pozostały kod)
}
```

### Krok 7: Testowanie

```
1. W edytorze kliknij "Podgląd"
2. Wybierz funkcję: mainMCC (dla MCC) lub main (dla pojedynczego konta)
3. Kliknij "Uruchom"
4. Sprawdź logi
```

---

## 📁 Konfiguracja dla wielu klientów

### Opcja 1: Wszystkie konta w jednym folderze

```javascript
var CONFIG = {
  // ...
  FOLDER_PER_CLIENT: false,
  SPREADSHEET_NAME: 'Audyt Google Ads - [NAZWA_KONTA]'  // [NAZWA_KONTA] zostanie zastąpione
};
```

**Rezultat:**
```
📁 Audyty Google Ads/
  ├── Audyt Google Ads - Klient A - 2025-11-10.xlsx
  ├── Audyt Google Ads - Klient B - 2025-11-10.xlsx
  └── Audyt Google Ads - Klient C - 2025-11-10.xlsx
```

### Opcja 2: Osobny folder dla każdego klienta

```javascript
var CONFIG = {
  // ...
  FOLDER_PER_CLIENT: true,
  SPREADSHEET_NAME: 'Audyt Google Ads'
};
```

**Rezultat:**
```
📁 Audyty Google Ads/
  ├── 📁 Klient A/
  │   └── Audyt Google Ads - 2025-11-10.xlsx
  ├── 📁 Klient B/
  │   └── Audyt Google Ads - 2025-11-10.xlsx
  └── 📁 Klient C/
      └── Audyt Google Ads - 2025-11-10.xlsx
```

### Opcja 3: Filtrowanie po etykietach

```javascript
var CONFIG = {
  // ...
  ACCOUNT_LABELS: ['Audyt Miesięczny', 'Premium'],  // Tylko konta z tymi etykietami
  MIN_SPEND_THRESHOLD: 500  // Tylko konta z wydatkami > 500 PLN
};
```

---

## ⏰ Automatyzacja raportów

### Harmonogram dla MCC

```
1. W edytorze skryptów kliknij: ⏰ (ikona zegara)
2. Utwórz nowy harmonogram:
   - Funkcja: mainMCC
   - Częstotliwość: Raz w tygodniu (poniedziałek, 8:00)
   - Powiadomienia: E-mail przy błędach
3. Zapisz harmonogram
```

**Zalecane harmonogramy:**

| Typ klienta | Częstotliwość | Dzień/Godzina |
|-------------|---------------|---------------|
| E-commerce (duży ruch) | Co tydzień | Poniedziałek 8:00 |
| Agencje B2B | Co 2 tygodnie | Pierwszy poniedziałek miesiąca |
| Małe firmy | Raz w miesiącu | Pierwszy dzień miesiąca |

---

## 🔧 Rozwiązywanie problemów

### Problem 1: "Permission denied" dla konta

**Przyczyna:** Brak uprawnień do konta klienta

**Rozwiązanie:**
1. Sprawdź uprawnienia w MCC
2. Konto musi być aktywne (nie zawieszone)
3. Dodaj konto z uprawnieniami Standard/Admin

### Problem 2: Skrypt przekracza czas wykonania (30 min)

**Przyczyna:** Zbyt wiele kont do audytu

**Rozwiązanie:**
```javascript
// Opcja A: Ogranicz liczbę kont
var CONFIG = {
  MIN_SPEND_THRESHOLD: 1000  // Tylko większe konta
};

// Opcja B: Podziel na grupy
var CONFIG = {
  ACCOUNT_LABELS: ['Grupa A']  // Uruchom osobno dla każdej grupy
};
```

### Problem 3: Brak dostępu do Google Drive

**Przyczyna:** Skrypt MCC nie ma uprawnień do Drive

**Rozwiązanie:**
1. Przy pierwszym uruchomieniu zaakceptuj uprawnienia
2. Upewnij się, że konto MCC ma dostęp do Google Drive
3. Sprawdź czy nie ma limitów API

### Problem 4: Duplikaty arkuszy

**Przyczyna:** Skrypt uruchomiony wielokrotnie

**Rozwiązanie:**
```javascript
// Dodaj sprawdzanie czy arkusz już istnieje
function initializeSpreadsheet() {
  var fileName = CONFIG.SPREADSHEET_NAME + ' - ' + accountName + ' - ' + dateStr;
  
  // Sprawdź czy istnieje
  var files = DriveApp.getFilesByName(fileName);
  if (files.hasNext()) {
    Logger.log('⚠️  Arkusz już istnieje, pomijam...');
    return null;
  }
  
  // Utwórz nowy
  // ...
}
```

---

## 📊 Przykładowy workflow dla agencji

### Tygodniowy audyt 10 klientów

```javascript
// 1. Konfiguracja
var CONFIG = {
  MCC_MODE: true,
  FOLDER_PER_CLIENT: true,
  MIN_SPEND_THRESHOLD: 500,
  ACCOUNT_LABELS: ['Audyt Tygodniowy']
};

// 2. Harmonogram
Funkcja: mainMCC
Czas: Każdy poniedziałek, 7:00
Powiadomienia: email@agencja.pl

// 3. Rezultat
📧 E-mail z podsumowaniem
📁 10 folderów z raportami
⏱️ Czas wykonania: ~15 minut
```

---

## 🎯 Best Practices dla MCC

### 1. Oznaczaj konta etykietami
```
- "Audyt Tygodniowy" - dla aktywnych kampanii
- "Audyt Miesięczny" - dla mniej aktywnych
- "VIP" - dla priorytetowych klientów
```

### 2. Monitoruj wydatki
```javascript
MIN_SPEND_THRESHOLD: 500  // Ignoruj nieaktywne konta
```

### 3. Organizuj foldery
```javascript
FOLDER_PER_CLIENT: true  // Łatwiejsze zarządzanie
```

### 4. Ustaw powiadomienia
```
- E-mail przy błędach
- Raport tygodniowy dla zespołu
```

### 5. Regularnie przeglądaj logi
```
- Sprawdzaj które konta mają błędy
- Aktualizuj uprawnienia
```

---

## 📧 Wsparcie

Problemy z instalacją MCC?
- 📝 Sprawdź [README.md](README.md)
- 🐛 Zgłoś błąd na GitHub Issues
- 📖 Zobacz [CHANGELOG.md](CHANGELOG.md)

---

## ✅ Checklist instalacji MCC

- [ ] Dostęp do konta MCC
- [ ] Uprawnienia do kont klientów
- [ ] Skrypt wklejony
- [ ] CONFIG.MCC_MODE = true
- [ ] Funkcja mainMCC() dodana
- [ ] Test na 1-2 kontach
- [ ] Harmonogram ustawiony
- [ ] Powiadomienia skonfigurowane
- [ ] Dokumentacja dla zespołu

**Po ukończeniu wszystkich kroków, Twój MCC jest gotowy!** 🎉
