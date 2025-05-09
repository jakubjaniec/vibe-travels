# Plan Testów - Vibe Travels

## 1. Wprowadzenie i Cele Testowania

Vibe Travels to aplikacja do planowania podróży, która przekształca proste notatki na temat destynacji lub pomysłów na wycieczkę w szczegółowe, spersonalizowane plany podróży. Celem testów jest zapewnienie wysokiej jakości, niezawodności oraz bezpieczeństwa aplikacji zarówno po stronie frontendu, jak i backendu. Testy mają na celu wykrycie i eliminację błędów oraz zagwarantowanie, że aplikacja spełnia wymagania funkcjonalne oraz niefunkcjonalne.

## 2. Zakres Testów

- **Frontend**: Testy funkcjonalności i wyglądu interfejsu użytkownika, responsywności, kompatybilności przeglądarkowej oraz poprawności interakcji przy użyciu Astro, React, Tailwind i Shadcn/ui.
- **Backend**: Testy endpointów API, integracji z bazą danych Supabase, uwierzytelnienia i autoryzacji użytkowników.
- **Integracja**: Weryfikacja komunikacji pomiędzy frontendem a backendem, w tym interakcje z usługą AI (Openrouter.ai) oraz integracja przepływu danych.
- **Przepływy Użytkownika**: Testy scenariuszy związanych z rejestracją, tworzeniem notatek podróży, generowaniem planów oraz zarządzaniem zapisami.
- **Wydajność i Bezpieczeństwo**: Testy pod kątem szybkości działania oraz zabezpieczeń, zwłaszcza w kontekście danych użytkowników i autoryzacji.

## 3. Typy Testów

- **Testy jednostkowe**: Testowanie pojedynczych funkcji i komponentów (np. komponenty React, moduły pomocnicze) z wykorzystaniem Jest oraz React Testing Library.
- **Testy integracyjne**: Weryfikacja współdziałania między komponentami aplikacji oraz integracji z usługami backendowymi (Supabase, API AI).
- **Testy end-to-end (E2E)**: Symulacja kompletnego przepływu użytkownika (np. rejestracja, logowanie, tworzenie notatek, generowanie planu podróży) przy użyciu narzędzi takich jak Cypress.
- **Testy wydajnościowe**: Ocena odpowiedzi aplikacji i backendu przy zwiększonym obciążeniu, wykorzystując narzędzia typu Lighthouse lub dedykowane testy obciążeniowe.
- **Testy bezpieczeństwa**: Weryfikacja mechanizmów uwierzytelnienia i autoryzacji, zabezpieczenia danych oraz odporności na typowe ataki (np. SQL Injection, XSS).

## 4. Scenariusze Testowe dla Kluczowych Funkcjonalności

- **Rejestracja i Logowanie**:
  - Walidacja formularzy rejestracyjnych i logowania.
  - Sprawdzenie poprawności interakcji z Supabase przy zapisie i uwierzytelnianiu użytkowników.
  - Testy scenariuszy błędnych danych wejściowych i reakcji systemu na nie.
- **Tworzenie i Zarządzanie Notatkami Podróży**:
  - Testy CRUD (utworzenie, odczyt, aktualizacja, usunięcie) notatek.
  - Weryfikacja walidacji danych wprowadzanych przez użytkownika.
  - Testy zachowania interfejsu przy edycji i usuwaniu notatek.
- **Generowanie Planu Podróży z Wykorzystaniem AI**:
  - Testowanie procesu wysyłania zapytań do usługi Openrouter.ai.
  - Weryfikacja poprawności generowanego planu na podstawie podanych notatek.
  - Sprawdzanie, czy komunikaty błędów są odpowiednio obsługiwane.
- **Interfejs Użytkownika**:
  - Testy wizualne komponentów UI (z wykorzystaniem Shadcn/ui) oraz ich responsywności.
  - Sprawdzenie kompatybilności z różnymi przeglądarkami i urządzeniami.
  - Testy dostępności (accessibility) oraz intuicyjności interfejsu.
- **Integracja API i Komunikacja Backend-Frontend**:
  - Testy endpointów API w `src/pages/api` pod kątem poprawności odpowiedzi oraz obsługi błędów.
  - Weryfikacja harmonii wymiany danych między frontendem a backendem.
  - Testowanie scenariuszy awaryjnych, takich jak przerwy w komunikacji z Supabase.

## 5. Środowisko Testowe

- **Lokalne Środowisko Developerskie**: Używane głównie do testów jednostkowych i integracyjnych.
- **Środowisko CI/CD (np. GitHub Actions)**: Automatyczne uruchamianie testów przy każdym commicie i przed wdrożeniem.
- **Środowisko Staging**: Testy end-to-end oraz wydajnościowe przed finalnym wdrożeniem na produkcję.

## 6. Narzędzia do Testowania

- **Vitest** i **React Testing Library**: Do testów jednostkowych i integracyjnych komponentów.
- **Playwright**: Do testowania pełnych scenariuszy end-to-end.
- **Postman/Insomnia**: Do ręcznego testowania oraz weryfikacji endpointów API.
- **Lighthouse**: Do oceny wydajności, dostępności i optymalizacji strony.
- **Supabase CLI oraz Mocki**: Do symulacji backendu oraz integracji API podczas testów.

## 7. Harmonogram Testów

- **Etap Rozwoju**: Wdrażanie testów jednostkowych i integracyjnych w trakcie developmentu.
- **Etap Przedwdrożeniowy**: Przeprowadzanie testów end-to-end oraz wydajnościowych na środowisku staging.
- **Etap Produkcyjny**: Regularne testy regresji oraz monitorowanie działania aplikacji w środowisku produkcyjnym.

## 8. Kryteria Akceptacji Testów

- Uzyskanie minimum 80% pokrycia testami dla kluczowych funkcjonalności.
- Wszystkie krytyczne scenariusze muszą zakończyć się sukcesem bez błędów.
- Aplikacja musi wykazywać stabilność w testach wydajnościowych oraz odporność na przeciążenia.
- Zgłoszone błędy o krytycznym znaczeniu muszą zostać naprawione przed wdrożeniem na produkcję.

## 9. Role i Odpowiedzialności

- **Zespół QA**: Projektowanie, implementacja i wykonywanie testów oraz raportowanie wykrytych błędów.
- **Developerzy**: Tworzenie testów jednostkowych, wspieranie integracji testów oraz naprawa wykrytych błędów.
- **Testerzy E2E**: Odpowiedzialność za przygotowanie i uruchomienie testów symulujących pełne przepływy użytkownika.
- **DevOps**: Utrzymanie i konfiguracja środowisk testowych (CI/CD, staging).
- **Kierownik Projektu**: Koordynacja pracy zespołów i zatwierdzanie kryteriów akceptacji.

## 10. Procedury Raportowania Błędów

- Wszystkie błędy będą raportowane za pomocą systemu Jira lub GitHub Issues.
- Każde zgłoszenie powinno zawierać dokładny opis błędu, kroki reprodukcji, oczekiwane zachowanie oraz, jeśli to możliwe, zrzuty ekranu lub logi.
- Zespół QA będzie odpowiedzialny za dokumentowanie i śledzenie błędów, a regularne przeglądy statusu będą odbywały się podczas spotkań zespołowych.
- Wyniki testów będą integrowane z procesem CI/CD, umożliwiając automatyczne powiadamianie o nieudanych testach.
