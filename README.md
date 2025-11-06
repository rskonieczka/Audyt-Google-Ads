# 🔍 Audyt Google Ads - Maksymalizacja Konwersji

[![Google Ads](https://img.shields.io/badge/Google%20Ads-Scripts-4285F4?logo=google-ads)](https://ads.google.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.5.0-blue.svg)](CHANGELOG.md)

Automatyczny skrypt audytu konta Google Ads, który identyfikuje problemy blokujące konwersje i generuje konkretne zadania optymalizacyjne. Stworzony dla marketerów, którzy chcą szybko znaleźć quick wins i zwiększyć ROI kampanii.

## 🎯 Dla kogo?

- **Performance Marketerzy** - szybka diagnostyka problemów z konwersjami
- **Agencje PPC** - automatyzacja audytów klientów  
- **E-commerce** - optymalizacja kampanii produktowych
- **Właściciele firm** - zrozumienie gdzie "leci" budżet

## ⚡ Quick Start

1. Skopiuj kod z [`audyt_konwersji.js`](audyt_konwersji.js)
2. Wklej do Google Ads → Narzędzia → Skrypty → Nowy Skrypt
3. Kliknij **"Uruchom"** (2-5 min)
4. Otwórz wygenerowany arkusz Google Sheets
5. 📁 Raporty zapisują się w folderze **"Audyty Google Ads"** w Google Drive

**Gotowe!** Masz listę problemów posortowanych według wpływu na konwersje.

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

Edytuj obiekt `CONFIG` na początku skryptu (linie 25-35):

```javascript
var CONFIG = {
  DAYS: 30,                    // Okres analizy (7, 14, 30, 90 dni)
  SPREADSHEET_NAME: 'Audyt Google Ads - Konwersje',
  MIN_CONVERSIONS: 1,          // Min. konwersji do analizy
  MIN_CONVERSION_RATE: 0.01,   // Min. CR = 1%
  HIGH_COST_THRESHOLD: 100,    // Próg wysokich kosztów (PLN)
  MIN_QUALITY_SCORE: 5,        // Min. akceptowalny QS
  LOW_QS_CRITICAL: 3,          // Krytycznie niski QS
  MIN_CTR: 0.02,               // Min. CTR = 2%
  BUDGET_THRESHOLD: 0.85       // Próg budżetu = 85%
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

## 📝 Wymagania techniczne

- **Platforma:** Google Ads Scripts (JavaScript ES5)
- **Uprawnienia:** Standard lub Administrator
- **Dane:** Min. 100 wyświetleń w okresie audytu
- **Czas wykonania:** 2-5 minut (do 30 minut dla dużych kont)
- **Limit API:** Standardowe limity Google Ads API

---

## 🤝 Współpraca

Chętnie przyjmujemy:
- 🐛 **Zgłoszenia błędów** - [Issues](../../issues)
- 💡 **Pomysły na funkcje** - [Discussions](../../discussions)
- 🔧 **Pull Requesty** - ulepsz kod
- 📖 **Dokumentację** - przykłady użycia

### Roadmap (planowane funkcje):

- [ ] Audyt grup odbiorców (audiences)
- [ ] Analiza konkurencji (Auction Insights)
- [ ] Rekomendacje automatycznych wykluczeń
- [ ] Eksport do CSV/PDF
- [ ] Dashboard z wykresami
- [ ] Porównanie z poprzednim audytem

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

**Wersja:** 1.5.0  
**Ostatnia aktualizacja:** Listopad 2025  
**Status:** Aktywnie rozwijane

**Używasz tego skryptu?** ⭐ Zostaw gwiazdkę na GitHub!

---

<div align="center">

### 🚀 Zbuduj lepsze kampanie. Zwiększ konwersje. Oszczędź budżet.

[📥 Pobierz skrypt](audyt_konwersji.js) • [🐛 Zgłoś problem](../../issues) • [💡 Zaproponuj funkcję](../../discussions)

**Made with ❤️ for Google Ads optimizers**

</div>
