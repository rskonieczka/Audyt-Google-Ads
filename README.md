# 🔍 Audyt Google Ads - Maksymalizacja Konwersji

[![Google Ads](https://img.shields.io/badge/Google%20Ads-Scripts-4285F4?logo=google-ads)](https://ads.google.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.8.0-blue.svg)](CHANGELOG.md)
[![MCC](https://img.shields.io/badge/MCC-Ready-orange.svg)](audyt_konwersji_mcc.js)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success.svg)](https://github.com)
[![Performance](https://img.shields.io/badge/Performance-Optimized-brightgreen.svg)](CHANGELOG.md)

Automatyczny skrypt audytu konta Google Ads, który identyfikuje problemy blokujące konwersje i generuje konkretne zadania optymalizacyjne. Stworzony dla marketerów, którzy chcą szybko znaleźć quick wins i zwiększyć ROI kampanii.

> 🏢 **NOWOŚĆ v1.8.0:** Audyt Search Terms Report! Wykryj marnotrawstwo budżetu na kosztowne frazy bez konwersji → +20-40% ROI | Wersja MCC: [`audyt_konwersji_mcc.js`](audyt_konwersji_mcc.js)

---

## 📑 Spis treści

- [✨ Co nowego w v1.8.0?](#-co-nowego-w-v180)
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

## ✨ Co nowego w v1.8.0?

### 🔍 NOWY MODUŁ: Audyt Search Terms Report (Frazy wyszukiwania)
- 💸 **Kosztowne frazy bez konwersji** - wykrywa marnotrawstwo budżetu >2x threshold
- ❌ **Słowa negatywne** - auto-detekcja fraz jak: darmowy, instrukcja, praca, używany
- ⭐ **Wartościowe frazy** - identyfikuje ≥2 konwersje + ≥10 kliknięć do dodania jako keywords
- 🎯 **Grupowanie per kampania** - pokazuje TOP 3 najdroższe/najlepsze frazy
- 📈 **Potencjalny ROI:** +20-40% przez eliminację 30-50% marnotrawstwa

### 📈 Podsumowanie wersji 1.6.0 - 1.8.0:

**v1.6.0** - 🏢 Wersja MCC + 📢 Audyt rozszerzeń reklam
- ✅ Multi-account manager dla agencji (4 strategie filtrowania)
- ✅ Audyt sitelinks, callouts, structured snippets
- ✅ Folder Google Drive do organizacji raportów

**v1.7.0** - 🎭 Audyt grup odbiorców (Audiences)
- ✅ Wykrywanie kampanii bez remarketingu (RLSA)
- ✅ Małe/wygasłe listy <500 userów, nieużywane Customer Match
- ✅ Brak wykluczeń konwertujących użytkowników
- ✅ Potencjał: +25-50% wzrost konwersji

**v1.8.0** - 🔍 Audyt fraz wyszukiwania (Search Terms Report)
- ✅ Kosztowne frazy bez konwersji
- ✅ Auto-detekcja słów negatywnych
- ✅ Wartościowe frazy do rozbudowy
- ✅ Potencjał: +20-40% ROI

### 📊 Statystyki projektu:
- **10 modułów audytu** - kompleksowa analiza konta
- **2470+ linii kodu** - pełna implementacja single + MCC
- **3 zakładki raportu** - Podsumowanie, Problemy, Zadania
- **3 priorytety** - HIGH/MEDIUM/LOW dla szybkiej akcji
- **Inteligentne linki** - ścieżka nawigacji + podpowiedzi filtrów w nawiasach

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

Skrypt sprawdza **10 kluczowych obszarów** wpływających na konwersje:

### 1. 🎯 Śledzenie konwersji
- Brak lub niewłaściwa konfiguracja tagów konwersji
- Konwersje bez wartości (brak optymalizacji ROAS)
- Niski współczynnik konwersji (<1%)
- Kampanie bez dostępu do danych konwersji
- Brak śledzenia mikrokonwersji (phone clicks, form submits)

### 2. 📊 Ustawienia kampanii
- Niewłaściwe strategie licytacji (Manual CPC zamiast Target CPA/ROAS)
- Wstrzymane kampanie z dobrą historią konwersji (>10 konwersji)
- Ograniczenia harmonogramu blokujące konwersje w peak hours
- Kampanie bez odpowiedniego targetowania (location, language)
- Brak rotacji reklam (stuck on manual rotation)

### 3. 💰 Budżety i licytacja  
- Kampanie ograniczone przez budżet (>85% wykorzystania dzienny)
- Niskie stawki CPC blokujące aukcje (poniżej first page bid)
- Nieefektywna dystrybucja budżetu (80/20 rule violation)
- Kampanie bez konwersji z dużym budżetem
- Za wysokie stawki na słowa nisko konwertujące

### 4. 🔑 Słowa kluczowe
- Niski Quality Score (<5) = wysokie koszty CPC
- Słowa bez konwersji pochłaniające budżet (>100 PLN, 0 konwersji)
- Duża liczba słów wymagających poprawy (QS 3-4)
- Keywords z bardzo niskim CTR (<1%) - irrelevance
- Zbyt szerokie dopasowania bez kontroli (broad match chaos)

### 5. 📢 Reklamy
- Odrzucone reklamy blokujące wyświetlanie grup (disapproved/under review)
- Brak testów A/B - tylko 1 reklama aktywna w grupie
- Grupy reklam bez Expanded Text Ads (ETA) lub Responsive Search Ads (RSA)
- Niska skuteczność - CTR <1% dla Search, <0.5% dla Display
- Brak wykorzystania wszystkich headline/description slots w RSA
- Reklamy bez wezwań do działania (CTA)

### 6. ⚠️ Konflikty
- Duplikaty słów kluczowych (konkurencja wewnętrzna między kampaniami)
- Pozytywne słowa blokowane przez negatywne keywords
- Exact match w wielu kampaniach (keyword cannibalization)
- Overlap między kampaniami Brand vs Generic
- Negative keywords conflicts - blokowanie własnych kampanii

### 7. 🌐 Miejsca docelowe (Display/Video)
- Złe miejsca (placements) z wysokimi kosztami >100 PLN bez konwersji
- Niska jakość ruchu - podejrzane domeny (spam, clickfarm, parking pages)
- Kampanie Display/Video bez automatic placements exclusions
- Identyfikacja wartościowych placementów do dodania jako managed
- Mobile apps z wysokim spend bez konwersji

### 8. 📢 Rozszerzenia reklam (Ad Extensions)
- Kampanie bez sitelinks - brak linków do podstron (min. 4 wymagane)
- Kampanie bez callouts - brak tekstów promocyjnych ("Darmowa dostawa", "24/7")
- Kampanie bez structured snippets - brak kategoryzacji (Marki, Typy, Usługi)
- Brak call extensions w kampaniach lead generation
- Priorytetyzacja kampanii konwertujących (>5 konwersji = HIGH priority)

### 9. 🎭 Grupy odbiorców (Audiences)
- Kampanie bez list remarketingowych (RLSA) - brak 2-3x boost w CR
- Brak wykluczeń konwertujących użytkowników (marnowanie budżetu)
- Małe listy remarketingowe <500 użytkowników (nieefektywne, limited reach)
- Zamknięte listy nie zbierające nowych userów (isClosed = true)
- Nieużywane listy Customer Match (CRM_BASED) - najlepsze targety leżą odchami

### 10. 🔍 Frazy wyszukiwania (Search Terms)
- Kosztowne frazy bez konwersji >2x HIGH_COST_THRESHOLD (marnotrawstwo budżetu)
- Nierelewantne frazy do dodania jako słowa negatywne (≥3 fraz w kampanii)
- Wartościowe frazy ≥2 konwersje + ≥10 clicks - dodaj jako exact match keywords
- Auto-detekcja słów wykluczy: darmowy, free, instrukcja, tutorial, praca, cv, używany
- Grupowanie per kampania - pokazuje TOP 3 najdroższe/najlepsze frazy

---

## 📊 Wyniki

Skrypt tworzy **arkusz Google Sheets** z **3 zakładkami:**

### 📋 Podsumowanie
- **Statystyki konta** - konwersje, CR, koszt/konwersja, CPC, CTR
- **Liczba problemów** wg priorytetu (HIGH/MEDIUM/LOW)
- **TOP 5 najważniejszych problemów** - quick wins do natychmiastowej akcji
- **Podział problemów** wg kategorii (10 modułów audytu)

### 🔴 Problemy  
Szczegółowa lista **wszystkich wykrytych problemów** z:
- **Priorytet** - HIGH (🔴 czerwony) / MEDIUM (🟡 żółty) / LOW (🟢 zielony)
- **Kategoria** - który moduł audytu wykrył problem
- **Problem** - krótki opis co jest nie tak
- **Wpływ** - dlaczego to szkodzi konwersjom i ROI
- **Lokalizacja** - konkretna kampania/grupa/słowo kluczowe
- **Szczegóły** - dane liczbowe (koszt, konwersje, CTR, QS, etc.)
- **Zalecane działanie** - konkretna instrukcja naprawy

**🛠️ Funkcje arkusza:**
- 📊 Sortuj po priorytecie/kategorii/wpływie
- 🔍 Filtruj problemy (np. tylko HIGH priority)
- 📋 Kopiuj do innych narzędzi (Trello, Asana, Jira)

### ✅ Zadania (Action Items)
Konkretne **zadania do wykonania** - gotowe do wdrożenia:
- 🎯 **Posortowane według priorytetu** - zacznij od HIGH
- ⏱️ **Oszacowanie czasu** - Quick Win / 1h / 1 dzień
- 📈 **Potencjalny wzrost** - 5-10% / 10-20% / 15-30%
- 📋 **Status** - Do zrobienia / W trakcie / Zrobione (edytowalna kolumna)
- 🔗 **Inteligentne linki** - bezpośrednie przejście do Google Ads + podpowiedzi!

#### 🧭 Inteligentne linki z podpowiedziami filtrów

**NOWOŚĆ v1.8.0:** Linki pokazują **dokładną ścieżkę nawigacji + sugerowane filtry!**

**Przykłady:**
- ➜ Kampanie → Słowa kluczowe **(Filtr: Wskaźnik jakości < 5)**
- ➜ Kampanie → Frazy wyszukiwania **(Sortuj: Koszt malejąco)**
- ➜ Kampanie → Reklamy i rozszerzenia → Rozszerzenia **(Dodaj: min. 4 sitelinki)**
- ➜ Kampanie → Grupy odbiorców **(Dodaj: Grupy odbiorców)**
- ➜ Narzędzia i ustawienia → Pomiar → Konwersje

**Zamiast szukać ręcznie:**
1. ~~Otwórz Google Ads~~
2. ~~Znajdź "Kampanie"~~
3. ~~Kliknij "Słowa kluczowe"~~
4. ~~Ustaw filtr "Quality Score < 5"~~
5. ~~Szukaj problematycznego słowa~~

**Wystarczy kliknąć link** → otwiera się **dokładnie ta kampania** + wiesz **jaki filtr ustawić**! ⚡🎯

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
1. Otwórz arkusz Google Sheets (link w logach)
2. Zakładka "Podsumowanie" → przegląd TOP 5 problemów  
3. Zakładka "Problemy" → pełna lista (filtruj, sortuj po priorytecie)
4. Zakładka "Zadania" → rozpocznij od HIGH priority
5. Kliknij link w kolumnie "Akcja" → przejście do Google Ads + podpowiedzi filtrów!
```

### 📁 Organizacja raportów

Raporty automatycznie zapisują się w folderze **"Audyty Google Ads"** w Google Drive:
```
Google Drive/
└── Audyty Google Ads/
    ├── Audyt_2025-11-12_Nazwa-Konta.xlsx
    ├── Audyt_2025-11-11_Nazwa-Konta.xlsx
    └── (kolejne audyty...)
```

**Korzyści:**
- 📅 Historia auditów - porównuj wyniki w czasie
- 🔄 Łatwy dostęp - wszystko w jednym miejscu
- 📈 Tracking postępów - monitoruj poprawy

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

### ✅ ZAIMPLEMENTOWANE

#### 🏢 Wersja MCC (Multi-account Manager) - **v1.6.0 ✅ GOTOWE**
- ✅ Audyt wielu kont naraz z poziomu Manager Account
- ✅ Porównanie performance między kontami klientów
- ✅ Consolidated reporting lub osobne arkusze per konto
- ✅ **Zaawansowane filtrowanie kont** - 4 strategie:
  - INCLUDE_ONLY - whitelist (tylko wybrane konta)
  - EXCLUDE_ONLY - blacklist (wyklucz z audytu)
  - SMART - automatyczne filtry (test accounts, min. spend)
  - ALL - wszystkie konta bez filtrów
- ✅ Folder Google Drive do organizacji raportów

**Potencjalny impact:** Oszczędność 80% czasu dla agencji zarządzających wieloma klientami

---

### 🎯 Priorytet WYSOKI (najbardziej requested)

#### 1. 📱 Analiza urządzeń (Device Performance)
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

**Status:** 🚧 Planowane v1.9.0

---

#### 2. 🎯 Audyt landing pages (Quality Score factors)
**Co sprawdzi:**
- Landing page experience score
- Mobile-friendliness
- Page load speed
- Relevance content vs keywords
- Missing HTTPS

**Dlaczego warto:**
- Landing page ma 30-40% wpływu na Quality Score
- Szybkie strony konwertują lepiej (50% bounce rate przy >3s load)
- Mobile-first indexing Google

**Potencjalny impact:** +20-40% Quality Score = niższe CPC

**Status:** 🚧 Planowane v2.0.0

---

### 🚀 Priorytet ŚREDNI (nice to have)

#### 3. 🏆 Analiza konkurencji (Auction Insights)
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

**Status:** 🚧 Planowane v2.0.0+

---

#### 4. 📈 Porównanie z poprzednim audytem (Trend Analysis)
**Co sprawdzi:**
- Czy problemy zostały naprawione
- Nowe problemy od ostatniego audytu
- Trendy wzrostowe/spadkowe (CR, koszt, konwersje)
- Skuteczność wdrożonych zmian

**Dlaczego warto:**
- Proof of improvement
- Accountability zespołu
- Data-driven decision making

**Potencjalny impact:** Lepsze zarządzanie i accountability

**Status:** 🚧 Planowane v1.9.0

---

#### 5. 🌍 Audyt geografii i harmonogramu
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

**Status:** 🚧 Planowane v2.0.0

---

#### 6. 📄 Eksport do CSV/PDF z wizualizacjami
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

**Status:** 🚧 Planowane v2.0.0+

---

### 🔮 Priorytet NISKI (długoterminowe)

#### 7. 🤖 Machine Learning Recommendations
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

#### v1.6.0 (2025-11-12) - ✅ GOTOWE
- [x] 🏢 **Wersja MCC** - audyt wielu kont z poziomu Manager Account ✅ GOTOWE (beta)
- [x] 📢 **Audyt rozszerzeń reklam** - sitelinks, callouts, structured snippets ✅ GOTOWE

#### v1.7.0 (2025-11-12) - ✅ GOTOWE
- [x] 🎭 **Audyt grup odbiorców** - remarketing, Customer Match, RLSA ✅ GOTOWE
- [x] Wykrywanie kampanii bez remarketingu i wykluczeń ✅ GOTOWE

#### v1.8.0 (2025-11-12) - ✅ GOTOWE
- [x] 🔍 **Audyt Search Terms Report** - frazy wyszukiwania ✅ GOTOWE
- [x] Wykrywanie kosztownych fraz bez konwersji ✅ GOTOWE
- [x] Identyfikacja słów negatywnych i wartościowych fraz ✅ GOTOWE

#### v1.9.0 (Q1 2026) - 🚧 PLANOWANE
- [ ] Analiza urządzeń (Device Performance)

#### v2.0.0 (Q2 2026)
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
A: Tak! Audytuje wszystkie typy kampanii: Search, Shopping, Display, Video. Moduł "Miejsca docelowe" specjalnie dla Display/Video wykrywa spam domains i clickfarm.

**Q: Czy mogę dostosować priorytety?**  
A: Tak, możesz edytować logikę w funkcjach `auditXXX()` i `generateTasks()`.

**Q: Co z kontami w innych walutach?**  
A: Działa z każdą walutą. Zmień tylko `HIGH_COST_THRESHOLD` w CONFIG (np. 100 EUR, 100 USD).

**Q: Czy skrypt wysyła dane na zewnątrz?**  
A: Nie. Wszystkie dane pozostają w Twoim koncie Google Ads i Google Sheets.

**Q: Czy mogę używać komercyjnie?**  
A: Tak, licencja MIT pozwala na użytek komercyjny bez ograniczeń.

**Q: Co nowego w v1.8.0?**  
A: NOWY MODUŁ - Audyt Search Terms Report! Wykrywa kosztowne frazy bez konwersji, auto-detekcja słów negatywnych, wartościowe frazy do rozbudowy. BONUS: Inteligentne linki z podpowiedziami filtrów w nawiasach!

**Q: Czy muszę aktualizować skrypt do v1.8.0?**  
A: Zalecane! v1.8.0 dodaje 10. moduł audytu (Search Terms) + inteligentne linki z podpowiedziami. Potencjał: +20-40% ROI przez eliminację marnotrawstwa budżetu.

**Q: Co to są "inteligentne linki z podpowiedziami filtrów"?**  
A: NOWOŚĆ v1.8.0 - zamiast ogólnego "Otwórz Google Ads", linki pokazują dokładną ścieżkę (np. "Kampanie → Słowa kluczowe") + sugerowany filtr w nawiasie (np. "Filtr: QS < 5"). Oszczędzasz 80% czasu na szukaniu!

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

**Q: Ile zakładek ma raport?**  
A: 3 zakładki: (1) Podsumowanie - TOP 5 problemów + statystyki, (2) Problemy - pełna lista do filtrowania, (3) Zadania - konkretne akcje z linkami + podpowiedziami.

**Q: Jak audyt fraz wyszukiwania pomaga oszczędzać budżet?**  
A: Wykrywa 3 typy fraz: (1) Kosztowne bez konwersji >2x threshold = marnotrawstwo, (2) Nierelewantne ("darmowy", "praca") = dodaj jako negatywne, (3) Wartościowe (≥2 konwersje) = dodaj jako exact match. Typowo eliminuje 30-50% marnotrawstwa.

**Q: Czy skrypt śledzi moje dane?**  
A: Absolutnie NIE. Kod jest open-source, możesz to zweryfikować. Wszystko działa lokalnie w Twoim Google Ads.

**Q: Jak długo trwa analiza?**  
A: 2-5 minut dla typowych kont. Duże konta (100+ kampanii): 10-30 minut. Jeśli timeout - zmniejsz CONFIG.DAYS.

---

## 📊 Porównanie wersji

| Funkcja | v1.5.2 | v1.6.0 | v1.7.0 | v1.8.0 (latest) |
|---------|--------|--------|--------|------------------|
| **Liczba modułów audytu** | 7 | 8 | 9 | ✅ **10** |
| Moduł: Rozszerzenia reklam | ❌ | ✅ | ✅ | ✅ |
| Moduł: Grupy odbiorców | ❌ | ❌ | ✅ | ✅ |
| **Moduł: Search Terms Report** | ❌ | ❌ | ❌ | ✅ **NOWE!** |
| **Inteligentne linki z filtrami** | ❌ | ❌ | ❌ | ✅ **NOWE!** |
| Precyzyjne linki (per kampania) | ✅ | ✅ | ✅ | ✅ |
| **Multi-Account (MCC)** | ❌ | ✅ | ✅ | ✅ |
| Filtrowanie kont MCC | - | ✅ 4 strategie | ✅ | ✅ |
| Tryby raportowania MCC | - | ✅ 2 tryby | ✅ | ✅ |
| Folder Google Drive | - | ✅ | ✅ | ✅ |
| **Zakładki raportu** | 4 | 4 | 4 | ✅ **3** (bez "Dane") |
| AWQL/GAQL compatibility | Dobre | ✅ Bardzo dobre | ✅ | ✅ |
| Operator >= dla metrics | - | - | - | ✅ **Naprawione** |
| **Potencjalny ROI impact** | +15-25% | +20-35% | +25-50% | ✅ **+30-60%** |
| **Linie kodu (single+MCC)** | ~1200 | ~1900 | ~2200 | ✅ **2470+** |
| Stabilność | Bardzo dobra | ✅ Doskonała | ✅ | ✅ |

### 🎉 Najważniejsze ulepszenia v1.8.0:
- 🔍 **10. moduł audytu** - Search Terms Report (frazy wyszukiwania)
- 🧭 **Inteligentne linki** - ścieżka nawigacji + podpowiedzi filtrów
- 📋 **3 zakładki** - usunięto zakładkę "Dane" (zbyteczna)
- 🔧 **Poprawka API** - operator >= → > dla metrics.conversions
- 📈 **Większy impact** - potencjał +30-60% ROI (10 modułów audytu)

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

**Wersja:** 1.8.0 ✅  
**Ostatnia aktualizacja:** 12 Listopad 2025  
**Status:** Production Ready - Aktywnie rozwijane  
**Kod:** Open Source (MIT License)  
**Nowość:** 🔍 **Audyt Search Terms Report!** - Wykryj marnotrawstwo budżetu +20-40% ROI  
**Autor:** Skonieczka Rafał

**📊 Statystyki projektu:**
- **10 modułów audytu** - kompleksowa analiza konta
- **2470+ linii kodu** - pełna implementacja single + MCC
- **Zakładki raportu:** Podsumowanie, Problemy, Zadania
- **Bezpośrednie linki** - jeden klik do Google Ads UI + podpowiedzi filtrów

### Changelog v1.8.0 (12.11.2025):
- 🔍 **NOWY MODUŁ: Audyt Search Terms Report** - analiza fraz wyszukiwania
- 💸 **Kosztowne frazy bez konwersji** - wykrywa marnotrawstwo >2x threshold
- ❌ **Auto-detekcja słów negatywnych** - darmowy, instrukcja, praca, używany, free, tutorial, cv
- ⭐ **Wartościowe frazy** - identyfikuje ≥2 konwersje + ≥10 kliknięć
- 🧭 **Inteligentne linki** - ścieżki nawigacji + podpowiedzi filtrów w nawiasach
- 📊 **Potencjalny ROI:** +20-40% przez eliminację 30-50% marnotrawstwa
- 🔧 **Naprawiono:** QueryError OPERATOR_FIELD_MISMATCH (>= → > dla metrics.conversions)

### Changelog v1.7.0 (11.11.2025):
- 🎭 **NOWY MODUŁ: Audyt grup odbiorców (Audiences)**
- 📊 **Wykrywanie kampanii bez remarketingu** (RLSA) - 2-3x boost w CR
- ⚠️ **Małe/wygasłe listy** - <500 użytkowników (limited reach)
- 🔒 **Zamknięte listy** - nie zbierają nowych userów (isClosed = true)
- 💼 **Nieużywane Customer Match** - najlepsze targety leżą odłogiem
- ❌ **Brak wykluczeń** - marnowanie budżetu na konwertujących
- 📈 **Potencjalny impact:** +25-50% wzrost konwersji

### Changelog v1.6.0 (10.11.2025):
- 🏢 **Wersja MCC** - audyt wielu kont z Manager Account (2470+ linii)
- 📢 **NOWY MODUŁ: Audyt rozszerzeń reklam** - sitelinks, callouts, snippets
- 🎯 **4 strategie filtrowania kont** - whitelist, blacklist, smart, all
- 📊 **2 tryby raportowania** - SEPARATE (osobne arkusze) lub CONSOLIDATED
- 📁 **Folder Google Drive** - automatyczna organizacja raportów
- ✅ **Naprawiono AWQL/GAQL** - compatibility issues z nowymi API
- 📚 **Kompletna dokumentacja MCC** - INSTALACJA_MCC.md

**Używasz tego skryptu?** ⭐ Zostaw gwiazdkę na GitHub!  
**Znalazłeś bug?** 🐛 [Zgłoś issue](../../issues)  
**Masz pomysł?** 💡 [Otwórz dyskusję](../../discussions)

---

<div align="center">

### 🚀 Zbuduj lepsze kampanie. Zwiększ konwersje. Oszczędź budżet.

[📥 Pobierz skrypt](audyt_konwersji.js) • [🐛 Zgłoś problem](../../issues) • [💡 Zaproponuj funkcję](../../discussions)

**Made with ❤️ for Google Ads optimizers**

</div>
