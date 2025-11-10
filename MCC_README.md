# 🏢 Wersja MCC - Instrukcja konfiguracji

## 📋 Szybki start

Wersja MCC pozwala audytować wiele kont Google Ads z jednego miejsca (Manager Account).

### Krok 1: Przygotuj kod

1. Skopiuj **CAŁY** kod z `audyt_konwersji.js`
2. Otwórz plik `MCC_CONFIG_EXAMPLE.js`
3. Skopiuj sekcję `MCC_CONFIG` (zamiast `CONFIG`)
4. Skopiuj funkcję `main()` dla MCC
5. Dodaj funkcje pomocnicze MCC na końcu

### Krok 2: Skonfiguruj filtrowanie

Wybierz strategię filtrowania kont:

## 🎯 Strategie filtrowania

### 1. SMART (Rekomendowane - automatyczne)

Pomija automatycznie konta testowe i nieaktywne:

```javascript
ACCOUNT_STRATEGY: 'SMART',
ACCOUNTS_TO_EXCLUDE: [],  // Opcjonalnie dodaj blacklist
SMART_FILTERS: {
  MIN_IMPRESSIONS: 100,          // Min. wyświetlenia (30 dni)
  MIN_SPEND: 50,                 // Min. wydatki (30 dni)
  EXCLUDE_TEST_ACCOUNTS: true,   // Pomija "test", "demo", "sandbox"
  EXCLUDE_DISABLED: true,        // Nieużywane (ograniczenie API)
  ONLY_MANAGED: true             // Tylko konta (nie sub-managery)
}
```

**Jak działa:**
1. Pobiera wszystkie konta z MCC
2. Dla każdego sprawdza nazwę (test accounts)
3. **Wybiera konto i sprawdza statystyki** (impressions, spend)
4. Pomija konta poniżej progów

⚠️ **Uwaga:** Filtry MIN_IMPRESSIONS i MIN_SPEND wymagają tymczasowej selekcji każdego konta (Google Ads API ograniczenie). Może to wydłużyć czas wykonania dla dużych MCC.

**Użyj gdy:**
- Masz dużo kont (>20)
- Część kont to testy/demo
- Chcesz pomijać nieaktywne automatycznie

**Przykład logów:**
```
========================================
AUDYT MCC - MAKSYMALIZACJA KONWERSJI
========================================
Strategia filtrowania: SMART
Tryb raportowania: SEPARATE

📁 FOLDER Z RAPORTAMI:
   https://drive.google.com/drive/folders/1abc...xyz

Znaleziono kont do audytu: 5
---
[1/5] Przetwarzam: Klient ABC
✅ OK: Klient ABC
---
```

---

### 2. INCLUDE_ONLY (Whitelist)

Audytuj **TYLKO** wybrane konta:

```javascript
ACCOUNT_STRATEGY: 'INCLUDE_ONLY',
ACCOUNTS_TO_INCLUDE: [
  '123-456-7890',      // Po Customer ID
  'Klient ABC',        // Po nazwie (exact match)
  'E-commerce XYZ',
  'Lead Gen Firma'
],
ACCOUNTS_TO_EXCLUDE: []  // Nie używane w tym trybie
```

**Użyj gdy:**
- Chcesz audytować tylko TOP klientów
- Masz konkretną listę kont do sprawdzenia
- Testujesz wersję MCC na kilku kontach

---

### 3. EXCLUDE_ONLY (Blacklist)

Audytuj **wszystkie POZA** wykluczonymi:

```javascript
ACCOUNT_STRATEGY: 'EXCLUDE_ONLY',
ACCOUNTS_TO_INCLUDE: [],  // Nie używane w tym trybie
ACCOUNTS_TO_EXCLUDE: [
  'Konto zawieszone',
  'Test Demo Account',
  '999-888-7777',      // Konkretne ID
  'ARCHIWUM'           // Wszystkie z "ARCHIWUM" w nazwie
]
```

**Użyj gdy:**
- Chcesz audytować wszystkie konta
- Masz kilka kont do pominięcia (zawieszone, archiwalne)
- Większość kont jest aktywna

---

### 4. ALL (Wszystkie bez filtrów)

Audytuj **absolutnie wszystkie** konta:

```javascript
ACCOUNT_STRATEGY: 'ALL',
ACCOUNTS_TO_INCLUDE: [],
ACCOUNTS_TO_EXCLUDE: []
```

**Użyj gdy:**
- Małe MCC (<10 kont)
- Wszystkie konta są aktywne
- Nie masz kont testowych

---

## 📊 Tryby raportowania

### SEPARATE (Osobne arkusze - Rekomendowane)

```javascript
REPORT_MODE: 'SEPARATE'
```

**Rezultat:**
```
📁 Audyty Google Ads - MCC/
  📄 Audyt - Klient ABC - 2025-11-10.xlsx
  📄 Audyt - Klient XYZ - 2025-11-10.xlsx
  📄 Audyt - E-commerce DEF - 2025-11-10.xlsx
```

**Korzyści:**
- ✅ Łatwo udostępnić raport konkretnemu klientowi
- ✅ Przejrzysta analiza per konto
- ✅ Śledzenie postępów w czasie
- ✅ Możliwość porównania tygodniowego

---

### CONSOLIDATED (Jeden zbiorczy arkusz)

```javascript
REPORT_MODE: 'CONSOLIDATED'
```

**Rezultat:**
```
📄 Audyt MCC - Wszystkie konta - 2025-11-10.xlsx
  📋 Podsumowanie kont (tabela porównawcza)
  📋 Wszystkie problemy (z kolumną "Konto")
```

**Korzyści:**
- ✅ Szybkie porównanie wszystkich kont
- ✅ Jeden plik do analizy
- ✅ Łatwe sortowanie po liczbie problemów
- ✅ Benchmarking performance

---

## 🔧 Zaawansowana konfiguracja

### Limity i wydajność

```javascript
MAX_ACCOUNTS_PER_RUN: 50,    // Max kont w jednym uruchomieniu
KEYWORDS_LIMIT: 3000,        // Mniej słów per konto = szybsze
DAYS: 14,                    // Krótszy okres = szybsze
```

**Dla bardzo dużych MCC (>100 kont):**
- Zmniejsz `MAX_ACCOUNTS_PER_RUN` do 20-30
- Użyj batch processing (podziel konta alfabetycznie)
- Uruchom w godzinach nocnych

### Email notifications

```javascript
SEND_EMAIL_SUMMARY: true,
EMAIL_RECIPIENTS: [
  'manager@agencja.pl',
  'team@agencja.pl'
]
```

Otrzymasz email po zakończeniu z:
- Liczbą przetworzonych kont
- Liczbą błędów
- Linkami do raportów

---

## 💡 Przykłady użycia

### Przykład 1: Agencja z 30 klientami

**Problem:** Część kont to testy, nie wszystkie są aktywne

**Rozwiązanie:**
```javascript
ACCOUNT_STRATEGY: 'SMART',
SMART_FILTERS: {
  MIN_IMPRESSIONS: 100,
  EXCLUDE_TEST_ACCOUNTS: true
},
REPORT_MODE: 'SEPARATE'
```

**Efekt:** 
- Automatycznie pomija 5 kont testowych
- Pomija 3 nieaktywne konta (0 wyświetleń)
- Tworzy 22 osobne raporty dla aktywnych klientów

---

### Przykład 2: Analiza TOP 10 klientów

**Problem:** Chcesz sprawdzić tylko najważniejszych klientów

**Rozwiązanie:**
```javascript
ACCOUNT_STRATEGY: 'INCLUDE_ONLY',
ACCOUNTS_TO_INCLUDE: [
  'Klient Premium A',
  'Klient Premium B',
  'E-commerce TOP',
  // ... pozostałe 7
],
REPORT_MODE: 'CONSOLIDATED'
```

**Efekt:**
- Audyt tylko 10 wybranych kont
- Jeden arkusz zbiorczy do porównania
- Szybki przegląd najważniejszych problemów

---

### Przykład 3: Wszystkie poza archiwalnymi

**Problem:** Masz archiwalne projekty które nie powinny być audytowane

**Rozwiązanie:**
```javascript
ACCOUNT_STRATEGY: 'EXCLUDE_ONLY',
ACCOUNTS_TO_EXCLUDE: [
  'ARCHIWUM',
  'Projekt zakończony 2024',
  'Nieaktywny - zawieszony'
],
REPORT_MODE: 'SEPARATE'
```

**Efekt:**
- Audytuje wszystkie aktywne konta
- Pomija 3 archiwalne projekty
- Osobne raporty per konto

---

## ⚠️ Troubleshooting

### Błąd: "Brak kont do audytu"

**Przyczyna:** Zbyt restrykcyjne filtry

**Rozwiązanie:**
1. Sprawdź `ACCOUNTS_TO_INCLUDE` - czy nazwy/ID są poprawne?
2. Zmniejsz `MIN_IMPRESSIONS` lub `MIN_SPEND`
3. Tymczasowo ustaw `ACCOUNT_STRATEGY: 'ALL'` i sprawdź logi

### Timeout przy dużej liczbie kont

**Przyczyna:** Sprawdzanie statystyk dla każdego konta (MIN_IMPRESSIONS, MIN_SPEND) wydłuża czas

**Rozwiązanie 1 - Wyłącz filtry metryczne:**
```javascript
SMART_FILTERS: {
  MIN_IMPRESSIONS: 0,        // Wyłącz (ustaw na 0)
  MIN_SPEND: 0,              // Wyłącz (ustaw na 0)
  EXCLUDE_TEST_ACCOUNTS: true
}
```

**Rozwiązanie 2 - Ogranicz limity:**
```javascript
MAX_ACCOUNTS_PER_RUN: 20,  // Zmniejsz z 50 do 20
KEYWORDS_LIMIT: 2000,      // Zmniejsz z 5000
DAYS: 7                    // Zmniejsz z 30
```

### Konto jest pomijane mimo że powinno być audytowane

**Sprawdź:**
1. Czy nazwa/ID w `ACCOUNTS_TO_INCLUDE` jest dokładnie taka sama?
2. Czy `SMART_FILTERS.MIN_IMPRESSIONS` nie jest za wysoki?
3. Zobacz logi - powód jest wypisywany

### Błąd: "PROHIBITED_METRIC_IN_SELECT_OR_WHERE_CLAUSE"

**Pełny błąd:**
```
Cannot select or filter on metrics: 'impressions'
```

**Przyczyna:** Próba filtrowania kont po metrykach w selektorze (stara wersja kodu)

**Rozwiązanie:** Zaktualizuj kod - najnowsza wersja `MCC_CONFIG_EXAMPLE.js` sprawdza metryki PO selekcji konta, nie w selektorze.

---

## 📝 Checklist przed uruchomieniem

- [ ] Skopiowałem pełny kod z `audyt_konwersji.js`
- [ ] Dodałem konfigurację MCC (zamiast CONFIG)
- [ ] Wybrałem strategię filtrowania
- [ ] Ustawiłem tryb raportowania (SEPARATE/CONSOLIDATED)
- [ ] Sprawdziłem limity (`MAX_ACCOUNTS_PER_RUN`)
- [ ] Wkleiłem kod do MCC → Scripts
- [ ] Przetestowałem na 2-3 kontach (ustaw whitelist)
- [ ] Sprawdziłem logi po pierwszym uruchomieniu

---

## 🚀 Status rozwoju

**Wersja:** 1.6.0 (planowana Q1 2026)  
**Status:** W rozwoju 🚧  
**Kod:** [MCC_CONFIG_EXAMPLE.js](MCC_CONFIG_EXAMPLE.js)

**Testuj wersję beta?** [Dołącz do dyskusji](../../discussions)

---

**Made with ❤️ for Google Ads agencies**
