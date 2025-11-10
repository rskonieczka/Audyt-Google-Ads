# 🔍 Audyt Google Ads - Maksymalizacja Konwersji

[![Google Ads](https://img.shields.io/badge/Google%20Ads-Scripts-4285F4?logo=google-ads)](https://ads.google.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.6.0--beta-blue.svg)](CHANGELOG.md)
[![MCC](https://img.shields.io/badge/MCC-Ready-orange.svg)](audyt_konwersji_mcc.js)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success.svg)](https://github.com)
[![Performance](https://img.shields.io/badge/Performance-Optimized-brightgreen.svg)](CHANGELOG.md)

Automatyczny skrypt audytu konta Google Ads, który identyfikuje problemy blokujące konwersje i generuje konkretne zadania optymalizacyjne. Stworzony dla marketerów, którzy chcą szybko znaleźć quick wins i zwiększyć ROI kampanii.

> 🏢 **NOWOŚĆ:** Wersja MCC dla agencji! Audytuj wiele kont z jednego miejsca → [`audyt_konwersji_mcc.js`](audyt_konwersji_mcc.js) (plik ukryty, tylko dla klientów agencyjnych) | [📖 Instalacja](INSTALACJA_MCC.md)

---

## 📑 Spis treści

- [✨ Co nowego w v1.6.0-beta?](#-co-nowego-w-v160-beta)
- [🎯 Dla kogo?](#-dla-kogo)
- [⚡ Quick Start](#-quick-start)
- [📋 Co audytuje?](#-co-audytuje)
- [📊 Wyniki](#-wyniki)
- [📥 Instalacja](#-instalacja)
- [⚙️ Konfiguracja](#️-konfiguracja)
- [⏰ Automatyzacja](#-automatyzacja)
- [💡 Przykłady użycia](#-przykłady-użycia)
- [🎯 Najczęstsze problemy i rozwiązania](#-najczęstsze-problemy-i-rozwiązania)
- [🚨 Troubleshooting](#-troubleshooting)
- [💎 Best Practices](#-best-practices)
- [📊 Metryki i priorytety](#-metryki-i-priorytety)
- [🔒 Bezpieczeństwo i jakość kodu](#-bezpieczeństwo-i-jakość-kodu)
- [📝 Wymagania techniczne](#-wymagania-techniczne)
- [🔄 Migracja z wcześniejszych wersji](#-migracja-z-wcześniejszych-wersji)
- [⚠️ Ograniczenia](#️-ograniczenia)
- [🤝 Współpraca](#-współpraca)
- [💡 Sugestie dodatkowych funkcji](#-sugestie-dodatkowych-funkcji)
- [❓ FAQ](#-faq)
- [📊 Porównanie wersji](#-porównanie-wersji)
- [📄 Licencja](#-licencja)
- [🌟 Credits](#-credits)

---

## ✨ Co nowego w v1.6.0-beta?

### 🏢 Wersja MCC (Multi-Account Manager) - GOTOWA!
- 🎉 **Audyt wielu kont z jednego miejsca** - jeden skrypt dla całej agencji
- 🎯 **4 strategie filtrowania** - whitelist, blacklist, smart, all
- 📊 **2 tryby raportowania** - osobne arkusze lub raport zbiorczy
- 📁 **Link do folderu od razu w logach** - łatwy dostęp do raportów
- ✅ **1857 linii kodu gotowego do copy-paste** → [`audyt_konwersji_mcc.js`](audyt_konwersji_mcc.js)(plik ukryty, tylko dla klientów agencyjnych)

### 🔧 Poprawki i optymalizacje:
- ✅ Naprawiono błąd AWQL LIMIT clause (dla dużych kont)
- ✅ Naprawiono błąd filtrowania kont MCC po metrykach
- ✅ Wszystkie funkcje v1.5.2: parseNumeric(), LIMIT 5000 słów, linki bezpośrednie

## 🎯 Dla kogo?

- **Performance Marketerzy** - szybka diagnostyka problemów z konwersjami
- **Agencje PPC** - automatyzacja audytów klientów + **wersja MCC dostępna!** 🏢
- **E-commerce** - optymalizacja kampanii produktowych
- **Właściciele firm** - zrozumienie gdzie "leci" budżet

## ⚡ Quick Start

### 📱 Wersja dla pojedynczego konta

1. Skopiuj kod z [`audyt_konwersji.js`](audyt_konwersji.js)
2. Wklej do Google Ads → Narzędzia → Skrypty → Nowy Skrypt
3. Kliknij **"Uruchom"** (2-5 min)
4. Otwórz wygenerowany arkusz Google Sheets
5. 📁 Raporty zapisują się w folderze **"Audyty Google Ads"** w Google Drive

**Gotowe!** Masz listę problemów posortowanych według wpływu na konwersje.

### 🏢 Wersja MCC (dla agencji/wielu kont)

**✅ Dostępna teraz (v1.6.0-beta)!** Umożliwia:
- ✅ Audyt wszystkich kont klienta z poziomu MCC
- ✅ Jeden skrypt → wiele kont (aktualizacja w jednym miejscu)
- ✅ Porównanie performance między kontami
- ✅ Osobne arkusze per konto lub raport zbiorczy
- ✅ **Zaawansowane filtrowanie kont** - wybierz które konta audytować

#### Filtrowanie kont MCC:

**Whitelist** (audytuj TYLKO wybrane konta):
```javascript
ACCOUNT_STRATEGY: 'INCLUDE_ONLY',
ACCOUNTS_TO_INCLUDE: ['123-456-7890', 'Klient ABC', 'Klient XYZ']
```

**Blacklist** (wyklucz z audytu):
```javascript
ACCOUNT_STRATEGY: 'EXCLUDE_ONLY',
ACCOUNTS_TO_EXCLUDE: ['Test Account', 'DEMO', '999-888-7777']
```

**Smart** (automatyczne filtry - domyślne):
```javascript
ACCOUNT_STRATEGY: 'SMART',
SMART_FILTERS: {
  MIN_IMPRESSIONS: 100,        // Min. wyświetlenia (sprawdzane po selekcji)
  MIN_SPEND: 50,               // Min. wydatki (sprawdzane po selekcji)
  EXCLUDE_TEST_ACCOUNTS: true, // Pomija konta z "test", "demo"
  ONLY_MANAGED: true           // Tylko konta zarządzane
}
```

⚠️ Filtry MIN_IMPRESSIONS/MIN_SPEND wymagają sprawdzenia statystyk każdego konta (ograniczenie API).

#### 🚀 Jak używać wersji MCC:

1. Skopiuj kod z [`audyt_konwersji_mcc.js`](audyt_konwersji_mcc.js) ← **GOTOWY PLIK!**
2. Wklej do Google Ads MCC → Narzędzia → Skrypty → Nowy Skrypt
3. Dostosuj `MCC_CONFIG` (linie 42-86) - wybierz strategię filtrowania
4. Kliknij "Uruchom" lub "Podgląd"
5. Sprawdź logi i linki do raportów

📖 **Szczegóły:** [MCC_README.md](MCC_README.md) - pełna instrukcja konfiguracji

👉 **Pytania?** [Otwórz dyskusję](../../discussions)

---

## 📋 Co audytuje?

Skrypt sprawdza **7 kluczowych obszarów** wpływających na konwersje:

### 1. 🎯 Śledzenie konwersji
- Brak lub niewłaściwa konfiguracja tagów
- Konwersje bez wartości (brak optymalizacji ROAS)
- Niski współczynnik konwersji (<1%)

### 2. 📊 Ustawienia kampanii
- Niewłaściwe strategie licytacji (manual zamiast auto)
- Wstrzymane kampanie z dobrą historią konwersji
- Ograniczenia harmonogramu blokujące konwersje

### 3. 💰 Budżety i licytacja  
- Kampanie ograniczone przez budżet (>85% wykorzystania)
- Niskie stawki CPC blokujące aukcje
- Nieefektywna dystrybucja budżetu

### 4. 🔑 Słowa kluczowe
- Niski Quality Score (<5) = wysokie koszty
- Słowa bez konwersji pochłaniające budżet
- Duża liczba słów wymagających poprawy

### 5. 📢 Reklamy
- Odrzucone reklamy blokujące grupy
- Brak testów A/B (tylko 1 reklama w grupie)
- Brak rozszerzeń reklamowych
- Niska skuteczność (niski CTR)

### 6. ⚠️ Konflikty
- Duplikaty słów kluczowych (konkurencja wewnętrzna)
- Pozytywne słowa blokowane przez negatywne
- Exact match w wielu kampaniach

### 7. 🌐 Miejsca docelowe (Display/Video)
- Złe miejsca z wysokimi kosztami bez konwersji
- Niska jakość ruchu (spam, clickfarm)
- Kampanie bez wykluczeń miejsc
- Dobre miejsca do targetowania

---

## 📊 Wyniki

Skrypt tworzy **arkusz Google Sheets** z 4 zakładkami

### 📋 Podsumowanie
- Statystyki konta (konwersje, CR, koszt/konwersja)
- Liczba problemów wg priorytetu
- **TOP 5 najważniejszych problemów**

### 🔴 Problemy  
Szczegółowa lista problemów z:
- **Priorytet** - WYSOKI/ŚREDNI/NISKI
- **Kategoria** - obszar audytu
- **Problem** - co jest nie tak
- **Wpływ** - dlaczego to szkodzi konwersjom
- **Lokalizacja** - gdzie w koncie
- **Szczegóły** - dane liczbowe
- **Zalecane działanie** - co zrobić

### ✅ Zadania
Konkretne akcje do wykonania:
- Posortowane według priorytetu
- Oszacowanie czasu realizacji
- Potencjalny wzrost konwersji
- Status (do zrobienia/w trakcie/zrobione)
- **🔗 Linki bezpośrednie** - kliknij i otwórz konkretną kampanię w Google Ads!

#### 💡 Jak działają linki bezpośrednie?

**Zamiast szukać ręcznie:**
1. ~~Otwórz Google Ads~~
2. ~~Znajdź kampanię "Buty sportowe - Performance"~~
3. ~~Przejdź do słów kluczowych~~
4. ~~Szukaj problematycznego słowa~~

**Wystarczy kliknąć link** → otwiera się **dokładnie ta kampania**! ⚡

### 📈 Dane  
Surowe dane do własnej analizy

---

## 📥 Instalacja

### Krok 1: Dodaj skrypt do Google Ads

```bash
1. Zaloguj się do Google Ads → ads.google.com
2. Narzędzia → Zbiorcze działania → Skrypty
3. Kliknij "+ NOWY SKRYPT"
4. Skopiuj cały kod z audyt_konwersji.js
5. Wklej i zapisz jako "Audyt Konwersji"
```

### Krok 2: Uruchom

```bash
1. Kliknij "Uruchom" lub "Podgląd"
2. Przy pierwszym razie: zatwierdź uprawnienia
3. Poczekaj 2-5 minut
4. Skopiuj link do arkusza z logów
```

### Krok 3: Analizuj wyniki

```bash
1. Otwórz arkusz Google Sheets
2. Zakładka "Podsumowanie" → TOP 5 problemów  
3. Zakładka "Problemy" → pełna lista (filtruj, sortuj)
4. Zakładka "Zadania" → rozpocznij od HIGH priority
```

---

## ⚙️ Konfiguracja

Edytuj obiekt `CONFIG` na początku skryptu (linie 33-45):

```javascript
var CONFIG = {
  DAYS: 30,                    // Okres analizy (7, 14, 30, 90 dni)
  SPREADSHEET_NAME: 'Audyt Google Ads - Konwersje',
  MIN_CONVERSIONS: 1,          // Min. konwersji do analizy
  MIN_CONVERSION_RATE: 0.01,   // Min. CR = 1%
  HIGH_COST_THRESHOLD: 100,    // Próg wysokich kosztów (PLN/EUR/USD)
  MIN_QUALITY_SCORE: 5,        // Min. akceptowalny QS
  LOW_QS_CRITICAL: 3,          // Krytycznie niski QS
  MIN_CTR: 0.02,               // Min. CTR = 2%
  BUDGET_THRESHOLD: 0.85,      // Próg budżetu = 85%
  KEYWORDS_LIMIT: 5000         // Max słów do audytu (sortowane po Cost DESC)
};
```

### Dostosuj do swojej branży:

**E-commerce (wysokie wolumeny):**
```javascript
MIN_CONVERSION_RATE: 0.02,   // 2%
MIN_CTR: 0.03,               // 3%
```

**B2B/Lead Gen (niskie wolumeny):**
```javascript
MIN_CONVERSION_RATE: 0.005,  // 0.5%
HIGH_COST_THRESHOLD: 500,    // 500 PLN
```

**Local Business:**
```javascript
DAYS: 90,                    // Dłuższy okres
MIN_CONVERSIONS: 3,          // Wyższy próg
```

### Dostosuj limit słów kluczowych:

**Małe/Średnie konta (<5000 słów):**
```javascript
KEYWORDS_LIMIT: 5000         // Domyślnie - audytuje wszystkie
```

**Duże konta (5000-20000 słów):**
```javascript
KEYWORDS_LIMIT: 5000         // OK - audytuje top 5000 najdroższych
```

**Bardzo duże konta (>20000 słów) z timeoutami:**
```javascript
KEYWORDS_LIMIT: 3000         // Zmniejsz jeśli dalej timeouty
```

**Chcesz audytować wszystkie słowa (bez limitu):**
```javascript
KEYWORDS_LIMIT: 999999       // Praktycznie bez limitu (ryzyko timeout)
```

💡 **Tip:** Limit dotyczy tylko słów kluczowych. Sortowanie po Cost DESC = audytujesz te najbardziej kosztowne (Pareto 80/20).

---

## ⏰ Automatyzacja

**Uruchamiaj automatycznie co tydzień:**

1. W Google Ads Scripts kliknij ikonę ⏰ (harmonogram)
2. Wybierz: **"Co tydzień"** → **Poniedziałek** → **9:00**
3. Zapisz

Skrypt będzie generował nowy arkusz każdego poniedziałku.

**Rekomendowane częstotliwości:**
- **Budżet > 10k PLN/mies:** codziennie
- **Budżet 3-10k PLN/mies:** co 3 dni
- **Budżet < 3k PLN/mies:** raz w tygodniu

---

## 💡 Przykłady użycia

### Przykład 1: E-commerce - 350 PLN zmarnowane

**Problem wykryty:**
```
Priorytet: WYSOKI
Kategoria: Słowa kluczowe
Problem: Słowo "buty sportowe" - 350 PLN, 87 kliknięć, 0 konwersji
Zadanie: Wstrzymaj lub dodaj do negatywnych
```

**Akcja:** Wstrzymano słowo  
**Efekt:** 350 PLN/tydzień oszczędności → przekierowane na lepsze słowa → +12 konwersji/miesiąc

---

### Przykład 2: B2B - duplikaty słów

**Problem wykryty:**
```
Priorytet: WYSOKI  
Kategoria: Konflikty
Problem: Exact match "[oprogramowanie crm]" w 3 kampaniach
Zadanie: Pozostaw w 1 kampanii, w innych dodaj do negatywnych
```

**Akcja:** Pozostawiono tylko w najlepszej kampanii  
**Efekt:** Koszt/konwersja spadł o 45% (z 450 PLN do 247 PLN)

---

### Przykład 3: Display - złe miejsca docelowe

**Problem wykryty:**
```
Priorytet: WYSOKI
Kategoria: Miejsca docelowe  
Problem: 8 miejsc pochłaniających 1200 PLN/miesiąc bez konwersji
Zadanie: Wykonaj masowe wykluczenie
```

**Akcja:** Wykluczono aplikacje mobilne i strony spam  
**Efekt:** 40% oszczędności budżetu Display + wzrost CR z 0.3% do 1.2%

---

## 🎯 Najczęstsze problemy i rozwiązania

### 🔴 Kategoria: Konwersje

| Problem | Co zrobić | Oczekiwany efekt |
|---------|-----------|------------------|
| Brak tagów konwersji | Zainstaluj Global Site Tag + event snippet | +100% widoczność konwersji |
| Konwersje bez wartości | Dodaj wartości do akcji konwersji | Możliwość optymalizacji ROAS |
| CR < 1% | Audyt landing pages + dopasowanie reklam | +50-150% CR |

### 🔴 Kategoria: Budżety

| Problem | Co zrobić | Oczekiwany efekt |
|---------|-----------|------------------|
| Ograniczenie przez budżet | Zwiększ budżet o 20% LUB wstrzymaj słabe kampanie | +15-30% konwersji |
| Niskie CPC | Zwiększ stawki o 30-50% | Więcej aukcji = więcej ruchu |
| Zła dystrybucja | Przenieś budżet do kampanii z CR > 2% | +20% efektywność |

### 🔴 Kategoria: Quality Score

| Problem | Co zrobić | Oczekiwany efekt |
|---------|-----------|------------------|
| QS < 3 (krytyczny) | Wstrzymaj słowo LUB przebuduj grupę | -30% CPC |
| Wiele słów z niskim QS | Audit jakości reklam + LP | -20% średni koszt |

---

## 🚨 Troubleshooting

### ❌ "No conversions configured"
- Skonfiguruj śledzenie konwersji w Google Ads
- Lub zaimportuj cele z Google Analytics

### ❌ "Authorization required"
```
Przyczyna: Brak uprawnień do API
Rozwiązanie: Zatwierdź uprawnienia w pop-upie przy pierwszym uruchomieniu
```

### ❌ "Script timeout" / "Execution time limit"
```
Przyczyna: Duże konto (>100 kampanii)
Rozwiązanie: 
  1. Zmień CONFIG.DAYS z 30 na 7
  2. LUB uruchamiaj w godzinach nocnych (mniej obciążenie)
```

### ❌ "No data available"
```
Przyczyna: Brak danych w ostatnich 30 dniach
Rozwiązanie: Sprawdź czy kampanie są aktywne i mają wyświetlenia
```

### ❌ Błędy w konkretnych modułach
```
Blad w auditPlacements: To OK - brak kampanii Display/Video
Blad w auditConflicts: Możliwe małe konto bez konfliktów
```

### ❌ Arkusz nie zawiera danych
```
Przyczyna: Wszystkie moduły mają błędy
Rozwiązanie:
  1. Sprawdź logi - jaki dokładnie błąd
  2. Upewnij się że konto ma min. 100 wyświetleń
  3. Sprawdź poziom dostępu (Standard lub Admin wymagany)
```

### ⚠️ Skrypt znajduje 0 problemów
```
To DOBRA wiadomość! Twoje konto jest dobrze zoptymalizowane.
Możesz:
  - Obniżyć progi w CONFIG (bardziej restrykcyjne)
  - Uruchomić ponownie za tydzień
```

### ❌ "Infinity" lub "NaN" w arkuszu
```
Przyczyna: Stara wersja skryptu (v1.5.0 lub wcześniejsza)
Rozwiązanie: Zaktualizuj do v1.5.1 - zawiera zabezpieczenia przed dzieleniem przez zero
```

### ⚠️ Fałszywe alarmy o konfliktach słów
```
Przyczyna: Stara logika wykrywania konfliktów (v1.5.0 lub wcześniejsza)
Rozwiązanie: Zaktualizuj do v1.5.1 - używa word boundaries zamiast prostego indexOf
Przykład: "buty" już nie koliduje z "obuty sportowe"
```

---

## 💎 Best Practices

### Przed pierwszym uruchomieniem:
1. ✅ Sprawdź czy śledzenie konwersji działa poprawnie
2. ✅ Upewnij się że konto ma min. 100 wyświetleń w ostatnich 30 dniach
3. ✅ Dostosuj CONFIG do swojej branży (e-commerce vs B2B)
4. ✅ Uruchom w godzinach mniejszego ruchu (rano, przed 9:00)

### Po otrzymaniu raportu:
1. ✅ Zacznij od problemów HIGH priority
2. ✅ Kliknij linki bezpośrednie - otwierają konkretną kampanię
3. ✅ Zapisz arkusz w ulubionych (będziesz do niego wracać)
4. ✅ Zaimplementuj max 3-5 zmian dziennie (nie za dużo naraz)
5. ✅ Monitoruj przez 7 dni po zmianach

### Regularne audyty:
1. ✅ Ustaw harmonogram: co tydzień (lub co 3 dni dla dużych budżetów)
2. ✅ Porównuj arkusze tygodniowo - śledź postępy
3. ✅ Po każdej dużej zmianie: audyt codziennie przez tydzień
4. ✅ Dokumentuj wdrożone zmiany i ich efekty

### Praca z zespołem:
1. ✅ Udostępnij arkusz członkom zespołu (Google Sheets)
2. ✅ Przypisuj zadania używając komentarzy w arkuszu
3. ✅ Aktualizuj kolumnę "Status" po wdrożeniu
4. ✅ Trzymaj folder "Audyty Google Ads" zorganizowany

---

## 📊 Metryki i priorytety

### Jak priorytetyzujemy problemy?

**🔴 WYSOKI priorytet:**
- Bezpośredni wpływ na konwersje
- Duże marnotrawstwo budżetu (>100 PLN)
- Blokady systemowe (np. odrzucone reklamy)
- Konflikty wewnętrzne

**🟡 ŚREDNI priorytet:**  
- Potencjał optymalizacji 10-20%
- Problemy strukturalne
- Brak najlepszych praktyk

**🟢 NISKI priorytet:**
- Quick wins (<1h pracy)
- Możliwości rozwoju
- Małe usprawnienia

### Szacowany wzrost konwersji:

```
🔴 WYSOKI:    15-30% wzrost konwersji
🟡 ŚREDNI:    10-20% wzrost konwersji  
🟢 NISKI:     5-10% wzrost konwersji
```

---

## 🔒 Bezpieczeństwo i jakość kodu

### Zabezpieczenia wbudowane:

✅ **Try-catch na każdym module** - skrypt nie crashuje przy błędach  
✅ **Walidacja danych z API** - bezpieczne parsowanie liczb, eliminacja NaN/Infinity  
✅ **Zero-division protection** - sprawdzanie przed dzieleniem przez zero  
✅ **Bezpieczny regex** - escape znaków specjalnych w wykrywaniu konfliktów  
✅ **Fallback mechanizmy** - alternatywne metody pobierania danych  
✅ **Tylko odczyt** - skrypt **NIE modyfikuje** kampanii automatycznie

### Testowane na:
- ✅ Małych kontach (1-10 kampanii)
- ✅ Średnich kontach (10-100 kampanii)
- ✅ Dużych kontach (100+ kampanii, 10k+ słów kluczowych)
- ✅ Różnych branżach (e-commerce, B2B, local, lead gen)
- ✅ Różnych walutach (PLN, EUR, USD, GBP)

---

## 📝 Wymagania techniczne

### Wersja pojedyncze konto (`audyt_konwersji.js`):
- **Platforma:** Google Ads Scripts (JavaScript ES5)
- **Uprawnienia:** Standard lub Administrator
- **Dane:** Min. 100 wyświetleń w okresie audytu
- **Czas wykonania:** 2-5 minut (do 30 minut dla dużych kont)
- **Limit API:** Standardowe limity Google Ads API
- **Stabilność:** Production-ready z obsługą błędów
- **Optymalizacja:** LIMIT 5000 słów kluczowych (sortowane po Cost DESC)

### Wersja MCC (`audyt_konwersji_mcc.js`):
- **Platforma:** Google Ads Scripts w Manager Account (MCC)
- **Uprawnienia:** Dostęp do MCC z uprawnieniami Standard/Admin
- **Limit czasu:** Do 60 minut (max dla MCC scripts)
- **Konta:** Do 50 kont na uruchomienie (konfigurowalne)
- **Rozmiar:** 1857 linii kodu (kompletny, gotowy do użycia)

---

## 🔄 Migracja z wcześniejszych wersji

### Do v1.6.0-beta (MCC) – DLA AGENCJI 🆕

**Dla kogo:** Agencje zarządzające wieloma kontami  
**Czas:** 5 minut  
**Breaking changes:** Żadne (nowy plik)

**Co zyskujesz:**
- 🏢 Audyt wszystkich kont z jednego miejsca
- ⏱️ Oszczędność 80% czasu na aktualizacje
- 🎯 Filtrowanie kont (whitelist/blacklist/smart)
- 📁 Link do folderu od razu w logach

**Instrukcja:**
1. Pobierz [`audyt_konwersji_mcc.js`](audyt_konwersji_mcc.js)
2. Wklej do **MCC → Skrypty → Nowy Skrypt**
3. Skonfiguruj filtry w `MCC_CONFIG`
4. Zobacz [INSTALACJA_MCC.md](INSTALACJA_MCC.md) po szczegóły

**Wersja dla pojedynczego konta nadal działa!** Nie musisz nic zmieniać jeśli używasz tylko 1 konta.

---

### Z v1.5.1 → v1.5.2/v1.6.0

**Rekomendacja:** Zalecana dla wszystkich  
**Czas:** 2 minuty  
**Breaking changes:** Brak

**Co się zmieni:**
- ⚡ Szybsze działanie (nowa funkcja parseNumeric)
- ⚡ Limit 5000 słów (audytowane najdroższe)
- ✅ Naprawiono AWQL LIMIT clause
- ⚡ Mniej błędów parsowania danych

**Instrukcja:** Skopiuj nowy kod → Wklej → Zapisz

---

### Z v1.5.0 → v1.5.1

**Dlaczego warto zaktualizować?**
- ✅ Eliminuje crash przy budżecie = 0
- ✅ Usuwa fałszywe alarmy w konfliktach
- ✅ Wykrywa dodatkowe anomalie
- ✅ Lepsza stabilność na dużych kontach

**Jak zaktualizować?**
1. Otwórz swój skrypt w Google Ads Scripts
2. Zaznacz cały kod (Ctrl+A)
3. Usuń (Delete)
4. Skopiuj nowy kod z `audyt_konwersji.js`
5. Wklej (Ctrl+V)
6. Zapisz i uruchom

**Czy tracę dane?**  
Nie! Twoje poprzednie arkusze pozostają w folderze "Audyty Google Ads".

---

## ⚠️ Ograniczenia

### Co skrypt NIE robi:
❌ **Nie wprowadza zmian automatycznie** - tylko raportuje problemy  
❌ **Nie audytuje Performance Max** - brak dostępu do niektórych danych w API  
❌ **Nie analizuje jakości landing pages** - tylko dane z Google Ads  
❌ **Nie porównuje z konkurencją** - brak danych Auction Insights  
❌ **Nie gwarantuje wyników** - wymaga manualnej implementacji sugestii

### Limity techniczne:
- ⏱️ Max czas wykonania: 30 minut (limit Google Ads Scripts)
- 📊 Max raportowanych problemów: brak limitu (ale arkusz ma limit ~10M komórek)
- 🔍 Min dane do analizy: 100 wyświetleń w okresie
- 💾 Limity API: standardowe limity Google Ads API
- 🔑 **Słowa kluczowe: LIMIT 5000** (sortowane po Cost DESC - audytowane najdroższe)

**Dlaczego limit 5000 słów?**
- Optymalizacja czasu wykonania (duże konta mają 50k+ słów)
- Sortowanie po Cost DESC = audyt najważniejszych słów (Pareto 80/20)
- Zmniejszenie ryzyka timeout przy bardzo dużych kontach
- Jeśli masz <5000 słów - audytuje wszystkie

### Dla bardzo dużych kont (1000+ kampanii):
Jeśli występują timeouty:
1. ✅ **v1.5.2 ma już LIMIT 5000 słów** - powinno rozwiązać problem
2. Zmniejsz `CONFIG.DAYS` z 30 na 7
3. Uruchom w godzinach nocnych (mniejsze obciążenie)
4. Rozważ podział na mniejsze konta MCC

---

## 🤝 Współpraca

Chętnie przyjmujemy:
- 🐛 **Zgłoszenia błędów** - [Issues](../../issues)
- 💡 **Pomysły na funkcje** - [Discussions](../../discussions)
- 🔧 **Pull Requesty** - ulepsz kod
- 📖 **Dokumentację** - przykłady użycia

---

## 💡 Sugestie dodatkowych funkcji

Poniżej lista potencjalnych rozszerzeń skryptu z uzasadnieniem biznesowym i technicznym.  
**Zagłosuj na swoją ulubioną funkcję:** [GitHub Discussions](../../discussions)

### 🎯 Priorytet WYSOKI (najbardziej requested)

#### 0. 🏢 Wersja MCC (Multi-account Manager) - 🚧 W ROZWOJU
**Co będzie:**
- Audyt wielu kont naraz z poziomu Manager Account
- Porównanie performance między kontami klientów
- Consolidated reporting lub osobne arkusze per konto
- Bulk operations i centralne zarządzanie
- **Zaawansowane filtrowanie kont** - 4 strategie:
  - INCLUDE_ONLY - whitelist (tylko wybrane konta)
  - EXCLUDE_ONLY - blacklist (wyklucz z audytu)
  - SMART - automatyczne filtry (test accounts, min. spend)
  - ALL - wszystkie konta bez filtrów

**Dlaczego warto:**
- Dla agencji zarządzających wieloma klientami
- Oszczędność czasu - jeden skrypt w jednym miejscu
- Cross-account insights i benchmarking
- Elastyczne filtrowanie - pomijaj testy, nieaktywne
- Jeden raport = wszystkie konta

**Przykłady filtrowania:**
- Agencja z 50 klientami → pomijaj test accounts automatycznie
- Audytuj tylko TOP 5 klientów → whitelist
- Wyklucz zawieszone projekty → blacklist

**Potencjalny impact:** Agency-level efficiency - oszczędność 80% czasu na aktualizacje

**Status:** ✅ Zaplanowane v1.6.0 (Q1 2026)

---

#### 1. 📊 Audyt rozszerzeń reklam (Ad Extensions)
**Co sprawdzi:**
- Kampanie bez sitelinks, callouts, structured snippets
- Nieaktywne rozszerzenia (wygasłe, odrzucone)
- Brak rozszerzeń połączeń w kampaniach lokalnych
- Niska skuteczność rozszerzeń (CTR)

**Dlaczego warto:**
- Rozszerzenia zwiększają CTR o 10-25%
- Zajmują więcej miejsca w SERP = więcej kliknięć
- Darmowe (nie zwiększają CPC)

**Potencjalny impact:** +15-25% konwersji

---

#### 2. 🔍 Audyt Search Terms Report
**Co sprawdzi:**
- Frazy wyszukiwania pochłaniające budżet bez konwersji
- Nieodpowiednie frazy do dodania jako negatywne
- Wartościowe frazy do dodania jako słowa kluczowe
- Problemy z dopasowaniem (broad match chaos)

**Dlaczego warto:**
- Wykrywa 30-50% marnotrawstwa budżetu
- Identyfikuje nowe okazje (high-converting terms)
- Pokazuje co NAPRAWDĘ wyszukują użytkownicy

**Potencjalny impact:** +20-40% ROI

---

#### 3. 🎭 Audyt grup odbiorców (Audiences)
**Co sprawdzi:**
- Kampanie bez remarketing list
- Małe lub wygasłe listy remarketingowe (<100 users)
- Brak wykluczeń konwertujących użytkowników
- Nieużywane listy Customer Match
- Performance grup odbiorców (RLSA)

**Dlaczego warto:**
- Remarketing ma 2-3x wyższy CR niż cold traffic
- Wykluczenie konwertujących oszczędza budżet
- Customer Match = najlepsze targety

**Potencjalny impact:** +25-50% konwersji

---

#### 4. 📱 Analiza urządzeń (Device Performance)
**Co sprawdzi:**
- Kampanie z wysokimi kosztami mobile bez konwersji
- Desktop vs Mobile vs Tablet performance
- Brak dostosowania stawek per urządzenie
- Mobile landing pages bez responsywności

**Dlaczego warto:**
- Mobile często ma 50% niższy CR niż desktop
- Możliwość oszczędności 20-30% przez bid adjustments
- Identyfikacja problemów UX mobile

**Potencjalny impact:** +15-30% efektywności budżetu

---

### 🚀 Priorytet ŚREDNI (nice to have)

#### 5. 🏆 Analiza konkurencji (Auction Insights)
**Co sprawdzi:**
- Share of Voice vs konkurencja
- Kampanie gdzie przegrywamy aukcje
- Overlap rate z konkurentami
- Position above rate

**Dlaczego warto:**
- Strategiczne decyzje o budżecie
- Identyfikacja luk w pokryciu
- Benchmark wydajności

**Potencjalny impact:** Insights strategiczne

---

#### 6. 📈 Porównanie z poprzednim audytem (Trend Analysis)
**Co sprawdzi:**
- Czy problemy zostały naprawione
- Nowe problemy od ostatniego audytu
- Trendy wzrostowe/spadkowe (CR, koszt, konwersje)
- Skuteczność wdrożonych zmian

**Dlaczego warto:**
- Proof of improvement
- Accountability zespołu
- Data-driven decision making

**Potencjalny impact:** Lepsze zarządzanie

---

#### 7. 🌍 Audyt geografii i harmonogramu
**Co sprawdzi:**
- Lokalizacje z wysokimi kosztami bez konwersji
- Najlepsze godziny/dni tygodnia dla konwersji
- Niewykorzystane geo-targety
- Ad schedule vs conversion patterns

**Dlaczego warto:**
- 20-40% budżetu może być marnowane na złe geo/time
- Możliwość realokacji budżetu
- Better timing = better performance

**Potencjalny impact:** +10-25% ROI

---

#### 8. 📄 Eksport do CSV/PDF z wizualizacjami
**Co będzie:**
- Eksport raportu do PDF (executive summary)
- Eksport danych do CSV (analiza w Excel)
- Wykresy i grafy (trends, pie charts)
- Branded reporting dla agencji

**Dlaczego warto:**
- Łatwiejsze prezentacje dla klientów
- Analiza w innych narzędziach
- Professional look

**Potencjalny impact:** Better client communication

---

### 🔮 Priorytet NISKI (długoterminowe)

#### 9. 🤖 Machine Learning Recommendations
**Co będzie:**
- AI-powered suggestions bazujące na historii
- Predictive analysis (przyszłe konwersje)
- Automated bid recommendations
- Smart budget allocation

**Dlaczego warto:**
- Inteligentniejsze decyzje
- Predictive insights
- Automation

**Potencjalny impact:** Next-level optimization

---

#### 10. 🎯 Performance Max Campaign Audit
**Co sprawdzi:**
- Asset groups performance
- Audience signals effectiveness
- Budget pacing
- URL expansion issues

**Dlaczego warto:**
- PMax to przyszłość Google Ads
- Limited visibility = więcej problemów
- Obecnie brak audytów dla PMax

**Potencjalny impact:** PMax optimization (gdy API udostępni dane)

---

#### 12. 🔗 Integracja z Google Analytics 4
**Co będzie:**
- Połączenie danych Google Ads + GA4
- Analiza full funnel (not just conversions)
- Bounce rate, time on site per campaign
- Landing page performance

**Dlaczego warto:**
- Pełniejszy obraz user journey
- Wykrywanie problemów LP/UX
- Better attribution

**Potencjalny impact:** Holistic optimization

---

### 🗳️ Jak wpłynąć na roadmap?

1. **Zagłosuj** na funkcję w [GitHub Discussions](../../discussions)
2. **Zaproponuj** własny pomysł
3. **Zgłoś** case study jak funkcja by Ci pomogła
4. **Wspomóż** development (Pull Request)

**Najczęściej requested funkcje będą priorytetyzowane w roadmap! 🚀**

---

### 📋 Krótkie Roadmap (najbliższe 3-6 miesięcy)

#### v1.6.0 (Q1 2026) - 🚧 W TRAKCIE
- [x] 🏢 **Wersja MCC** - audyt wielu kont z poziomu Manager Account ✅ GOTOWE (beta)
- [ ] Audyt rozszerzeń reklam
- [ ] Search Terms Report analysis
- [ ] Analiza urządzeń

#### v1.7.0 (Q2 2026)
- [ ] Audyt grup odbiorców
- [ ] Analiza geografii i harmonogramu
- [ ] Porównanie z poprzednim audytem

#### v2.0.0 (Q3 2026)
- [ ] Eksport do CSV/PDF z wykresami
- [ ] Auction Insights
- [ ] Performance Max support (gdy API ready)

**Śledź postępy:** [CHANGELOG.md](CHANGELOG.md#roadmap-przyszłych-wersji)

---

## ❓ FAQ

**Q: Czy skrypt może uszkodzić moje kampanie?**  
A: Nie. Skrypt tylko odczytuje dane i tworzy raport. Nie wprowadza żadnych zmian automatycznie.

**Q: Jak często uruchamiać audyt?**  
A: Zalecane 1x/tydzień. Dla dużych budżetów: codziennie. Po zmianach: codziennie przez tydzień.

**Q: Czy działa z kampaniami Shopping/Display/Video?**  
A: Tak! Wersja 1.2+ audytuje Display/Video (miejsca docelowe). Search i Shopping zawsze działają.

**Q: Czy mogę dostosować priorytety?**  
A: Tak, możesz edytować logikę w funkcjach `auditXXX()` i `generateTasks()`.

**Q: Co z kontami w innych walutach?**  
A: Działa z każdą walutą. Zmień tylko `HIGH_COST_THRESHOLD` w CONFIG (np. 100 EUR, 100 USD).

**Q: Czy skrypt wysyła dane na zewnątrz?**  
A: Nie. Wszystkie dane pozostają w Twoim koncie Google Ads i Google Sheets.

**Q: Czy mogę używać komercyjnie?**  
A: Tak, licencja MIT pozwala na użytek komercyjny bez ograniczeń.

**Q: Co nowego w v1.5.1 vs v1.5.0?**  
A: Głównie poprawki stabilności - lepsze wykrywanie konfliktów, zabezpieczenie przed crashem przy dzieleniu przez zero, wykrywanie anomalii budżetowych.

**Q: Czy muszę aktualizować skrypt?**  
A: Zalecane. v1.5.1 eliminuje potencjalne błędy runtime i fałszywe alarmy w wykrywaniu konfliktów.

**Q: Czy jest wersja dla MCC (Manager Account)?**  
A: ✅ **TAK! Dostępna teraz w v1.6.0-beta!** Pobierz [`audyt_konwersji_mcc.js`](audyt_konwersji_mcc.js) - gotowy do użycia plik (1857 linii). Zobacz [INSTALACJA_MCC.md](INSTALACJA_MCC.md) po instrukcję.

**Q: Czy mogę używać skryptu dla wielu kont?**  
A: ✅ **TAK!** Użyj wersji MCC - jeden skrypt audytuje wszystkie konta z poziomu Manager Account. Oszczędza 80% czasu na aktualizacje!

**Q: Jak filtrować konta w wersji MCC?**  
A: Wersja MCC ma 4 strategie:
- **INCLUDE_ONLY** - audytuj tylko wybrane konta (whitelist)
- **EXCLUDE_ONLY** - wyklucz konkretne konta (blacklist)  
- **SMART** - automatycznie pomija testy/nieaktywne (domyślne)
- **ALL** - wszystkie konta bez filtrów

Zobacz [MCC_README.md](MCC_README.md) po szczegóły i przykłady.

**Q: Czy mogę pominąć konta testowe automatycznie?**  
A: Tak! W wersji MCC ustaw `EXCLUDE_TEST_ACCOUNTS: true` - automatycznie pominie konta z "test", "demo", "sandbox" w nazwie.

**Q: Czy skrypt śledzi moje dane?**  
A: Absolutnie NIE. Kod jest open-source, możesz to zweryfikować. Wszystko działa lokalnie w Twoim Google Ads.

**Q: Jak długo trwa analiza?**  
A: 2-5 minut dla typowych kont. Duże konta (100+ kampanii): 10-30 minut. Jeśli timeout - zmniejsz CONFIG.DAYS.

---

## 📊 Porównanie wersji

| Funkcja | v1.5.0 | v1.5.2 | v1.6.0-beta (MCC) |
|---------|--------|--------|-------------------|
| Wykrywanie konfliktów | Proste indexOf | ✅ Word boundaries | ✅ Word boundaries |
| Dzielenie przez zero | ❌ Możliwy crash | ✅ Walidacja | ✅ Walidacja |
| Anomalie budżetowe | - | ✅ Wykrywanie | ✅ Wykrywanie |
| Parsowanie danych | Częściowe | ✅ Pełne z fallback | ✅ Pełne z fallback |
| Precyzyjne linki | ✅ Tak | ✅ Tak | ✅ Tak |
| AWQL LIMIT clause | ❌ Błąd | ❌ Błąd | ✅ **Naprawione** |
| **Multi-Account (MCC)** | ❌ Nie | ❌ Nie | ✅ **TAK!** |
| Filtrowanie kont | - | - | ✅ **4 strategie** |
| Link do folderu w logach | - | - | ✅ **TAK** |
| Tryby raportowania | 1 | 1 | ✅ **2 (SEPARATE/CONSOLIDATED)** |
| Stabilność | Dobra | Bardzo dobra | ✅ **Doskonała** |

---

## 📄 Licencja

**MIT License** - możesz swobodnie używać, modyfikować i dystrybuować.

```
Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

## 🌟 Credits

**Wersja:** 1.6.0-beta 🏢  
**Ostatnia aktualizacja:** 10 Listopad 2025  
**Status:** Production Ready + **MCC Beta** - Aktywnie rozwijane  
**Kod:** Open Source (MIT License)  
**Nowość:** ✅ **Wersja MCC dostępna!** → [`audyt_konwersji_mcc.js`](audyt_konwersji_mcc.js)

### Changelog v1.6.0-beta (10.11.2025):
- 🏢 **Wersja MCC** - audyt wielu kont z Manager Account (1857 linii, ready-to-use)
- 🎯 **4 strategie filtrowania kont** - whitelist, blacklist, smart, all
- 📊 **2 tryby raportowania** - SEPARATE (osobne arkusze) lub CONSOLIDATED (zbiorczy)
- 📁 **Link do folderu w logach** - od razu na początku audytu
- ✅ **Naprawiono AWQL LIMIT** - clause error (dla dużych kont)
- ✅ **Naprawiono filtrowanie MCC** - poprawne sprawdzanie metryk po selekcji
- 📚 **Kompletna dokumentacja** - INSTALACJA_MCC.md, MCC_README.md
- ⚡ **Wszystkie funkcje v1.5.2** - parseNumeric(), LIMIT 5000, precyzyjne linki

**Używasz tego skryptu?** ⭐ Zostaw gwiazdkę na GitHub!  
**Znalazłeś bug?** 🐛 [Zgłoś issue](../../issues)  
**Masz pomysł?** 💡 [Otwórz dyskusję](../../discussions)

---

<div align="center">

### 🚀 Zbuduj lepsze kampanie. Zwiększ konwersje. Oszczędź budżet.

[📥 Pobierz skrypt](audyt_konwersji.js) • [🐛 Zgłoś problem](../../issues) • [💡 Zaproponuj funkcję](../../discussions)

**Made with ❤️ for Google Ads optimizers**

</div>
