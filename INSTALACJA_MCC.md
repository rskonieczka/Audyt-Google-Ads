# 🚀 INSTALACJA WERSJI MCC - KROK PO KROKU

## ✅ Plik gotowy do użycia: `audyt_konwersji_mcc.js`

Pełna wersja MCC (1859 linii) zawiera **wszystkie** potrzebne funkcje.

---

## 📋 Szybka instalacja (2 minuty)

### Krok 1: Skopiuj kod
1. Otwórz plik [`audyt_konwersji_mcc.js`](audyt_konwersji_mcc.js)
2. Zaznacz **CAŁY** kod (Ctrl+A)
3. Skopiuj (Ctrl+C)

### Krok 2: Wklej do Google Ads MCC
1. Zaloguj się do **konta MCC** (Manager Account)
2. Przejdź do: **Narzędzia → Zbiorcze działania → Skrypty**
3. Kliknij **"+ NOWY SKRYPT"**
4. Wklej skopiowany kod (Ctrl+V)
5. Zapisz jako **"Audyt MCC - Konwersje"**

### Krok 3: Konfiguracja (WAŻNE!)
Edytuj sekcję `MCC_CONFIG` (linie 42-86):

```javascript
var MCC_CONFIG = {
  DAYS: 30,  // Okres audytu
  
  // WYBIERZ STRATEGIĘ:
  ACCOUNT_STRATEGY: 'SMART',  // lub 'INCLUDE_ONLY', 'EXCLUDE_ONLY', 'ALL'
  
  // Whitelist (audytuj tylko te):
  ACCOUNTS_TO_INCLUDE: [
    // 'Klient ABC',
    // '123-456-7890'
  ],
  
  // Blacklist (wyklucz z audytu):
  ACCOUNTS_TO_EXCLUDE: [
    // 'Test Account',
    // 'DEMO'
  ],
  
  // Smart filters:
  SMART_FILTERS: {
    MIN_IMPRESSIONS: 0,              // 0 = wyłączone (szybsze!)
    MIN_SPEND: 0,                    // 0 = wyłączone (szybsze!)
    EXCLUDE_TEST_ACCOUNTS: true,     // Pomija "test", "demo"
    ONLY_MANAGED: true               // Tylko konta (nie sub-managery)
  },
  
  // Tryb raportowania:
  REPORT_MODE: 'SEPARATE',  // lub 'CONSOLIDATED'
  
  MAX_ACCOUNTS_PER_RUN: 50  // Limit na jedno uruchomienie
};
```

### Krok 4: Test (REKOMENDOWANE!)
**Przed pełnym uruchomieniem, przetestuj na 1 koncie:**

```javascript
ACCOUNT_STRATEGY: 'INCLUDE_ONLY',
ACCOUNTS_TO_INCLUDE: ['Twoje testowe konto'],
```

Kliknij **"Podgląd"** (nie "Uruchom").

### Krok 5: Uruchom
1. Kliknij **"Uruchom"**
2. Zatwierdź uprawnienia (przy pierwszym razie)
3. Poczekaj 5-30 minut (zależnie od liczby kont)
4. Sprawdź logi - od razu zobaczysz:
   ```
   📁 FOLDER Z RAPORTAMI:
      https://drive.google.com/drive/folders/xxx
   ```
5. Linki do poszczególnych raportów na końcu logów

---

## 📊 Co otrzymasz?

### Tryb SEPARATE (rekomendowany):
```
📁 Audyty Google Ads - MCC/
  📄 Audyt - Klient ABC - 2025-11-10.xlsx
  📄 Audyt - Klient XYZ - 2025-11-10.xlsx
  📄 Audyt - E-commerce DEF - 2025-11-10.xlsx
```

Każdy arkusz zawiera:
- ✅ Podsumowanie problemów dla tego konta
- ✅ Lista wszystkich problemów z priorytetami
- ✅ Konkretne zadania do wykonania
- ✅ Linki bezpośrednie do Google Ads

### Tryb CONSOLIDATED:
```
📄 Audyt MCC - Wszystkie konta - 2025-11-10.xlsx
  📋 Podsumowanie kont (porównanie)
  📋 Wszystkie problemy (z kolumną "Konto")
```

---

## 🔧 Rozwiązywanie problemów

### ❌ Błąd: "getOrCreateFolder is not defined"
**Status:** ✅ NAPRAWIONE w aktualnej wersji  
**Rozwiązanie:** Pobierz najnowszy `audyt_konwersji_mcc.js`

### ❌ Błąd: "PROHIBITED_METRIC_IN_SELECT_OR_WHERE_CLAUSE"
**Status:** ✅ NAPRAWIONE w aktualnej wersji  
**Rozwiązanie:** Pobierz najnowszy `audyt_konwersji_mcc.js`

### ⏱️ Timeout / za długie wykonanie
**Rozwiązanie:**
```javascript
MAX_ACCOUNTS_PER_RUN: 20,  // Zmniejsz z 50
SMART_FILTERS: {
  MIN_IMPRESSIONS: 0,      // Wyłącz (najszybsze)
  MIN_SPEND: 0             // Wyłącz (najszybsze)
}
```

### 🔍 Brak kont do audytu
**Sprawdź:**
1. Czy `ACCOUNTS_TO_INCLUDE` ma poprawne nazwy/ID?
2. Czy `MIN_IMPRESSIONS` nie jest za wysoki? (ustaw na 0)
3. Zobacz logi - powód jest wypisany

---

## 📖 Szczegółowa dokumentacja

- **Pełna instrukcja:** [MCC_README.md](MCC_README.md)
- **Konfiguracja filtrów:** Zobacz [MCC_README.md - Strategie filtrowania](MCC_README.md#-strategie-filtrowania)
- **Przykłady użycia:** [MCC_README.md - Przykłady](MCC_README.md#-przykłady-użycia)
- **Główny README:** [README.md](README.md)

---

## ✅ Checklist

- [ ] Skopiowałem kod z `audyt_konwersji_mcc.js`
- [ ] Wkleiłem do MCC → Scripts
- [ ] Ustawiłem `ACCOUNT_STRATEGY`
- [ ] Skonfigurowałem filtry (whitelist/blacklist)
- [ ] Wybrałem `REPORT_MODE` (SEPARATE/CONSOLIDATED)
- [ ] Przetestowałem na 1 koncie (INCLUDE_ONLY)
- [ ] Sprawdziłem logi po teście
- [ ] Uruchomiłem dla wszystkich kont
- [ ] Znalazłem linki do raportów w logach

---

## 🎯 Rekomendowane ustawienia

### Dla małej agencji (<20 kont):
```javascript
ACCOUNT_STRATEGY: 'SMART',
SMART_FILTERS: {
  MIN_IMPRESSIONS: 0,
  EXCLUDE_TEST_ACCOUNTS: true
},
REPORT_MODE: 'SEPARATE'
```

### Dla średniej agencji (20-50 kont):
```javascript
ACCOUNT_STRATEGY: 'SMART',
SMART_FILTERS: {
  MIN_IMPRESSIONS: 0,
  EXCLUDE_TEST_ACCOUNTS: true
},
REPORT_MODE: 'SEPARATE',
MAX_ACCOUNTS_PER_RUN: 50
```

### Dla dużej agencji (>50 kont):
```javascript
ACCOUNT_STRATEGY: 'SMART',
SMART_FILTERS: {
  MIN_IMPRESSIONS: 0,
  EXCLUDE_TEST_ACCOUNTS: true
},
REPORT_MODE: 'SEPARATE',
MAX_ACCOUNTS_PER_RUN: 25  // Mniejsze partie
```

### Dla audytu TOP klientów:
```javascript
ACCOUNT_STRATEGY: 'INCLUDE_ONLY',
ACCOUNTS_TO_INCLUDE: [
  'Klient Premium A',
  'Klient Premium B',
  'E-commerce TOP'
],
REPORT_MODE: 'CONSOLIDATED'  // Łatwe porównanie
```

---

**Gotowe! Teraz możesz audytować wszystkie konta z jednego miejsca! 🚀**

**Pytania?** [Otwórz issue](../../issues) lub [dyskusję](../../discussions)
