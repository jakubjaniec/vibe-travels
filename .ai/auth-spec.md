# Specyfikacja modułu rejestracji i logowania dla VibeTravels

## 1. ARCHITEKTURA INTERFEJSU UŻYTKOWNIKA

### Struktura strony i layouty

- Utworzenie nowych stron Astro, np. `/login` oraz `/register`, dedykowanych do operacji autentykacji.
- Wprowadzenie nowego layoutu (auth layout), który będzie wykorzystywany na stronach związanych z logowaniem/rejestracją. Layout ten będzie zawierał wspólne elementy (np. nagłówek, stopkę, komunikaty systemowe) oraz schemat nawigacji dla użytkowników autoryzowanych i nieautoryzowanych.
- Rozdzielenie widoków: strony publiczne (dostępne dla wszystkich) oraz strony chronione (dostępne wyłącznie dla zalogowanych użytkowników). Middleware w Astro (np. w `/src/middleware/index.ts`) będzie weryfikował sesję użytkownika i decydował o dalszym renderowaniu.

### Komponenty client-side React

- Formularze logowania i rejestracji zostaną utworzone jako dedykowane komponenty React, umieszczone w katalogu `/src/components/auth`.
- Każdy formularz będzie zawierał pola niezbędne do rejestracji (email, hasło) lub logowania (email, hasło).
- Walidacja danych po stronie klienta obejmie:
- Format poprawności adresu email.
- Minimalną długość hasła (np. 8 znaków).
- Sprawdzenie zgodności hasła i potwierdzenia w przypadku rejestracji.
- Komponenty będą odpowiedzialne za wyświetlanie komunikatów błędów (np. "Nieprawidłowy adres email", "Hasło jest zbyt krótkie", "Błąd logowania") oraz sukcesów, korzystając z reaktywnych mechanizmów stanu (np. hooki w React).
- Po poprawnej walidacji, formularze będą komunikować się z backendem poprzez wywołania API (fetch lub Supabase SDK), a w przypadku sukcesu – przekierowywać użytkownika do strony chronionej, np. profilu.

### Integracja z Astro

- Strony Astro odpowiedzialne za routing (umieszczone w `/src/pages`) będą integrować komponenty React, osadzając je w ramach serwerowego renderowania.
- Na poziomie stron Astro, integracja z backendem autentykacji zapewni, że widoki chronione są renderowane jedynie dla zweryfikowanych użytkowników. W przypadkach braku aktywnej sesji, użytkownik będzie przekierowywany na stronę logowania.

### Walidacja i obsługa błędów

- Walidacja po stronie klienta w komponentach React zapewni natychmiastową informację zwrotną dla użytkownika.
- Back-end również przeprowadzi walidację danych wejściowych (np. format email, długość hasła) oraz obsłuży nieoczekiwane wyjątki, zwracając czytelne komunikaty błędów.
- Kluczowe przypadki obejmują:
  - Próby logowania z nieprawidłowymi danymi.
  - Próby rejestracji z już istniejącym kontem.
  - Błędy wynikające z problemów z komunikacją z usługą Supabase Auth.

## 2. LOGIKA BACKENDOWA

### Struktura endpointów API

- Utworzenie dedykowanych endpointów w katalogu `/src/pages/api/auth`:
  - `POST /api/auth/register` – rejestracja nowego użytkownika.
  - `POST /api/auth/login` – logowanie użytkownika.
  - `POST /api/auth/logout` – wylogowywanie użytkownika.

### Modele danych i walidacja wejścia

- Dane wejściowe (email, hasło) są walidowane przy użyciu bibliotek wspierających TypeScript (np. zod) i/lub customowych funkcji walidacyjnych.
- Modele danych definiowane są w `/src/types.ts`, zawierając interfejsy dla żądań i odpowiedzi API.
- Weryfikacja poprawności danych (np. pasujący format email, minimalna liczba znaków w haśle) odbywa się na poziomie endpointów API, z natychmiastowym zwrotem błędu przy niepoprawnych danych.

### Obsługa wyjątków i logowanie

- Każdy endpoint API zabezpiecza się poprzez try-catch, a w przypadku wystąpienia wyjątku:
  - Loguje błąd wewnętrzny (bez ujawniania wrażliwych danych użytkownikowi).
  - Zwraca odpowiedni kod HTTP (np. 400, 401, 500) wraz z przyjaznym komunikatem błędu.
- Kluczowe akcje, takie jak rejestracja i logowanie, są logowane w bazie danych, zgodnie z wymaganiami z dokumentu PRD.

### Renderowanie stron server-side

- Wykorzystanie middleware umieszczonego w `/src/middleware/index.ts` do weryfikacji sesji użytkownika przed renderowaniem stron chronionych.
- Middleware odczytuje token z ciasteczek i, przy pomocy Supabase Auth, weryfikuje poprawność sesji. W przypadku braku lub nieprawidłowej sesji, następuje przekierowanie do strony logowania.

## 3. SYSTEM AUTENTYKACJI

### Integracja z Supabase Auth

- Wykorzystanie Supabase Auth jako podstawowego systemu zarządzania użytkownikami:
  - Rejestracja: nowy użytkownik jest dodawany do bazy danych Supabase.
  - Logowanie: uwierzytelnianie odbywa się przez Supabase, po czym token sesyjny jest przechowywany w ciasteczkach.
  - Wylogowywanie: token sesyjny jest usuwany, a stan aplikacji jest aktualizowany, aby odzwierciedlić brak autentykacji.

### Komponenty Systemu Autentykacji

- Serwis autentykacyjny umieszczony w `/src/db` lub `/src/lib`, który integruje Supabase SDK i dostarcza funkcje: `register`, `login` oraz `logout`.
- Interfejsy (typy) oraz kontrakty danych zdefiniowane w `/src/types.ts`, które określają strukturę żądań i odpowiedzi między frontendem, backendem i Supabase.
- Middleware do weryfikacji sesji, wykorzystywany zarówno w endpointach API, jak i stronach renderowanych serwerowo.

## Podsumowanie

Specyfikacja opisuje architekturę modułu rejestracji i logowania w aplikacji VibeTravels, uwzględniając:

- Podział na warstwę interfejsu użytkownika, logikę backendową oraz system autentykacji.
- Wykorzystanie technologii Astro 5, React 19, TypeScript 5, Tailwind 4, Shadcn/ui oraz Supabase Auth, zgodnie z dokumentacją techniczną projektu.
- Spójne zarządzanie sesjami użytkowników, walidację danych oraz obsługę błędów, które zapewniają bezpieczeństwo i niezawodność działania.
- Integrację komponentów, serwisów i middleware, umożliwiającą łatwe rozszerzenie funkcjonalności przy jednoczesnym zachowaniu istniejących zachowań aplikacji.

Dzięki powyższej architekturze aplikacja zapewni bezpieczne, wydajne oraz przyjazne dla użytkownika zarządzanie procesem rejestracji i logowania, co jest kluczowe dla sukcesu systemu VibeTravels.
