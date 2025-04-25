# API Endpoint Implementation Plan: GET /api/travel-notes

## 1. Przegląd punktu końcowego

Endpoint ten służy do pobierania listy notatek podróżniczych dla uwierzytelnionego użytkownika. Umożliwia on użytkownikom przeglądanie zapisanych notatek, które zawierają tytuł, treść oraz znaczniki czasu stworzenia i aktualizacji.

## 2. Szczegóły żądania

- Metoda HTTP: GET
- Struktura URL: /api/travel-notes
- Parametry:
  - Wymagane: Brak dodatkowych parametrów w URL poza uwierzytelnieniem
  - Opcjonalne: Brak
- Request Body: Brak

## 3. Wykorzystywane typy

- `TravelNoteDTO`: określa strukturę pojedynczej notatki (id, title, content, created_at, updated_at)
- `TravelNotesResponseDTO`: obiekt zawierający tablicę notatek w polu "notes"

## 4. Szczegóły odpowiedzi

- Kod 200 OK: W przypadku sukcesu, zwraca obiekt JSON:
  {
  "notes": [
  { "id": "UUID", "title": "string", "content": "string", "created_at": "timestamp", "updated_at": "timestamp" }
  ]
  }
- Kod 401 Unauthorized: Jeżeli użytkownik nie jest uwierzytelniony
- Kod 500 Internal Server Error: W przypadku błędów serwera lub problemów z bazą danych

## 5. Przepływ danych

1. Żądanie HTTP trafia do endpointu GET /api/travel-notes.
2. Middleware sprawdza, czy użytkownik jest uwierzytelniony (używając sesji Supabase lub tokenu).
3. Po pomyślnej weryfikacji, logika w warstwie serwisów (np. `travelNotesService`) wykonuje zapytanie do tabeli `travel_notes`, filtrowane na podstawie `user_id` użytkownika.
4. Wyniki zapytania są mapowane do typu `TravelNoteDTO`.
5. Wyniki są zwracane jako część obiektu `TravelNotesResponseDTO`.
6. Dodatkowo, logowana jest akcja odczytu notatek (opcjonalnie w tabeli `logs`).

## 6. Względy bezpieczeństwa

- Uwierzytelnianie: Weryfikacja sesji użytkownika przed wykonaniem zapytania do bazy danych.
- Autoryzacja: Upewnienie się, że użytkownik ma dostęp tylko do swoich notatek (filtracja po `user_id`).
- Walidacja danych: Choć endpoint nie przyjmuje danych wejściowych, należy sprawdzić poprawność sesji i tokena.

## 7. Obsługa błędów

- 401 Unauthorized: Gdy użytkownik nie dostarczy poprawnych danych uwierzytelniających.
- 500 Internal Server Error: W przypadku błędów przy komunikacji z bazą danych lub innych nieobsłużonych wyjątków.
- Dodatkowe logowanie błędów w systemie (tabela `logs` lub inny mechanizm logowania) do monitorowania nieautoryzowanych lub nieoczekiwanych zdarzeń.

## 8. Rozważania dotyczące wydajności

- Upewnić się, że baza danych ma indeks na kolumnę `user_id` w tabeli `travel_notes` dla szybkiego filtrowania.
- W przypadku spodziewania się bardzo dużej liczby notatek, rozważyć implementację paginacji.
- Optymalizacja zapytań SQL i ograniczenie przesyłanych danych tylko do niezbędnych pól.

## 9. Kroki implementacji

1. Utworzenie nowego endpointu w katalogu `./src/pages/api/travel-notes` z obsługą metody GET.
2. Implementacja middleware uwierzytelniającego, wykorzystującego Supabase do weryfikacji sesji użytkownika.
3. Wyodrębnienie logiki dostępu do danych do nowego serwisu (np. `src/lib/services/travelNotesService.ts`), który:
   - Sprawdza autentyczność użytkownika
   - Wykonuje zapytanie do tabeli `travel_notes` filtrując po `user_id`
4. Zastosowanie odpowiednich typów (`TravelNoteDTO`, `TravelNotesResponseDTO`) w implementacji endpointu.
5. Dodanie obsługi błędów i walidacji, aby zwrócić kod 401 lub 500 w razie potrzeby.
6. Opcjonalne: logowanie akcji użytkownika w tabeli `logs` dla celów audytu.
7. Weryfikacja zgodności z zasadami implementacji związanymi z Astro, Supabase, i stosowanym stackiem technologicznym.
