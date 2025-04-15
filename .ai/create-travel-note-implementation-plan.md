# API Endpoint Implementation Plan: POST /api/travel-notes (Create Travel Note)

## 1. Przegląd punktu końcowego

Endpoint umożliwia tworzenie nowej notatki podróżniczej. Uwierzytelniony użytkownik może przesłać tytuł i treść notatki, której długość musi być pomiędzy 100 a 10 000 znaków. Notatka zostaje zapisana w bazie danych i zwrócona w odpowiedzi, a akcja jest logowana w tabeli `logs`.

## 2. Szczegóły żądania

- Metoda HTTP: POST
- Struktura URL: /api/travel-notes
- Parametry:
  - Wymagane:
    - Request Body:
      - `title`: string
      - `content`: string (długość od 100 do 10 000 znaków)
  - Opcjonalne: Brak

## 3. Wykorzystywane typy

- `CreateTravelNoteCommand` (z `src/types.ts`): zawiera pola `title` oraz `content`.
- `TravelNoteDTO` (z `src/types.ts`): zawiera pola `id`, `title`, `content`, `created_at` oraz `updated_at`.

## 4. Szczegóły odpowiedzi

- Sukces:
  - Kod statusu: 201 Created
  - Treść odpowiedzi: Obiekt `TravelNoteDTO` z danymi nowo utworzonej notatki.
- Błędy:
  - 400 Bad Request – nieprawidłowe dane wejściowe (np. zbyt krótka lub zbyt długa treść)
  - 401 Unauthorized – brak autoryzacji
  - 500 Internal Server Error – błąd po stronie serwera

## 5. Przepływ danych

1. Żądanie trafia do endpointu POST /api/travel-notes.
2. Middleware lub funkcja autoryzacyjna sprawdza, czy użytkownik jest uwierzytelniony (wykorzystanie Supabase w kontekście).
3. Dane wejściowe są walidowane za pomocą Zod, aby upewnić się, że `title` nie jest pusty oraz `content` spełnia wymaganie długości od 100 do 10 000 znaków.
4. Po walidacji, dane (wraz z `user_id` pobranym z kontekstu) są wstawiane do tabeli `travel_notes` w bazie danych.
5. Po udanym utworzeniu rekordu, odpowiedź zawierająca obiekt notatki (`TravelNoteDTO`) jest zwracana klientowi z kodem 201.
6. Akcja tworzenia notatki jest logowana w tabeli `logs` przy użyciu `user_id`, `action_type` (np. 'create_travel_note') oraz bieżącego znacznika czasu.

## 6. Względy bezpieczeństwa

- Uwierzytelnianie: Endpoint dostępny tylko dla zweryfikowanych użytkowników poprzez integrację z Supabase Auth.
- Autoryzacja: Sprawdzenie uprawnień użytkownika przed wykonaniem operacji.
- Walidacja wejścia: Użycie Zod do walidacji danych oraz egzekwowanie ograniczeń długości treści notatki.
- Ochrona przed SQL Injection: Wykorzystanie zapytań parametryzowanych oraz mechanizmów oferowanych przez Supabase.
- Logowanie: Rejestrowanie akcji użytkownika w tabeli `logs` w celu audytu i monitorowania.

## 7. Obsługa błędów

- 401 Unauthorized: Zwrócenie błędu, jeśli użytkownik nie jest uwierzytelniony.
- 400 Bad Request: Zwrócenie błędu, jeśli dane wejściowe nie spełniają warunków (np. zbyt krótka/długa treść lub brak wymaganych pól).
- 500 Internal Server Error: Zwrócenie błędu w przypadku problemów z bazą danych lub innych nieoczekiwanych błędów. Wszystkie błędy powinny być logowane zgodnie z zasadami obsługi błędów.

## 8. Rozważania dotyczące wydajności

- Wstawianie pojedynczego rekordu powinno być operacją lekką, jednak należy upewnić się, że odpowiednie indeksy (szczególnie na `user_id`) są ustawione.
- Logowanie akcji do tabeli `logs` powinno być optymalizowane, aby nie wpływać negatywnie na czas odpowiedzi endpointu, np. przez asynchroniczne przetwarzanie przy większej liczbie żądań.
- Utrzymanie niskiego czasu odpowiedzi jest kluczowe przy wysokim obciążeniu, dlatego warto monitorować wydajność zapytań do bazy danych.

## 9. Etapy wdrożenia

1. Stworzenie Zod schema do walidacji danych wejściowych (`title` i `content`).
2. Implementacja mechanizmu autoryzacji, aby zapewnić, że endpoint jest dostępny tylko dla zalogowanych użytkowników.
3. Utworzenie warstwy serwisowej odpowiedzialnej za:
   - Pobieranie danych z żądania
   - Walidację danych za pomocą Zod
   - Wstawienie nowej notatki do tabeli `travel_notes`
   - Rejestrowanie akcji w tabeli `logs`
4. Utworzenie endpointu API w `/api/travel-notes`, który integruje logikę serwisową.
5. Implementacja obsługi błędów oraz zwracanie odpowiednich kodów statusu (201, 400, 401, 500).
