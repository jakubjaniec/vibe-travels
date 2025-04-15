# API Endpoint Implementation Plan: POST /api/travel-notes/{noteId}/generate-plan

## 1. Przegląd punktu końcowego

Celem endpointu jest generowanie szczegółowego planu podróży na podstawie zapisanej notatki podróży. Proces wykorzystuje integrację AI do tworzenia personalizowanego planu oraz zapisuje wynik w bazie danych. Dodatkowo, akcja generowania jest logowana dla celów audytu.

## 2. Szczegóły żądania

- **Metoda HTTP:** POST
- **Struktura URL:** /api/travel-notes/{noteId}/generate-plan
- **Parametry:**
  - **Wymagane:**
    - `noteId` (UUID): identyfikator notatki podróży.

## 3. Wykorzystywane typy

- **DTOs:**
  - `TravelPlanDTO`: reprezentuje rekord w tabeli travel_plans.
  - `LogDTO`: reprezentuje rekord loga.
- **Command Modele:**
  - `GenerateTravelPlanCommand`: pusty typ reprezentujący komendę generowania planu.

## 4. Szczegóły odpowiedzi

- **Sukces (201 Created):**
  ```json
  {
    "note_id": "UUID",
    "title": "string",
    "content": "string", // wygenerowany plan podróży
    "generated_at": "timestamp"
  }
  ```
- **Kody błędów:**
  - 400 Bad Request – dla nieprawidłowych danych wejściowych.
  - 401 Unauthorized – dla nieautoryzowanego dostępu.
  - 422 Unprocessable Entity – gdy długość treści notatki nie mieści się między 100 a 10,000 znaków.
  - 404 Not Found – gdy notatka nie zostanie znaleziona.
  - 500 Internal Server Error – dla nieoczekiwanych błędów serwerowych.

## 5. Przepływ danych

1. **Autoryzacja:** Żądanie zabezpieczone tokenem; walidacja użytkownika przy użyciu Supabase Auth.
2. Pobranie `noteId` z URL.
3. Pobranie notatki podróży z bazy danych na podstawie `noteId`.
4. Walidacja długości treści notatki (100-10,000 znaków).
5. Wywołanie usługi AI do wygenerowania planu podróży.
6. Zapis wygenerowanego planu do tabeli `travel_plans` (relacja 1:1 z notatką: `noteId`).
7. Rejestracja akcji w tabeli `logs`.
8. Zwrócenie odpowiedzi z generowanym planem podróży.

## 6. Względy bezpieczeństwa

- **Autoryzacja:** Weryfikacja tokena JWT; dostęp do zasobu ograniczony do właściciela notatki.
- **Walidacja:** Użycie Zod do weryfikacji danych wejściowych.
- **Sanityzacja wejścia:** Zapobieganie atakom SQL Injection oraz Cross-Site Scripting.
- **Bezpieczna komunikacja z usługą AI:** Zapewnienie, że klucze API oraz komunikacja są odpowiednio zabezpieczone.

## 7. Obsługa błędów

- Walidacja nieprawidłowej długości treści notatki: zwrócenie 422 Unprocessable Entity.
- Brak notatki: zwrócenie 404 Not Found.
- Nieautoryzowany dostęp: zwrócenie 401 Unauthorized.
- Problemy z integracją AI lub błędy bazy danych: zwrócenie 500 Internal Server Error.
- Szczegółowe logowanie błędów dla celów audytu i debugowania.

## 8. Rozważania dotyczące wydajności

- Wykorzystanie asynchronicznych wywołań do usługi AI w celu nie blokowania endpointu.

## 9. Etapy wdrożenia

1. Utworzenie nowego pliku endpointu, np. `src/pages/api/travel-notes/[noteId]/generate-plan.ts`.
2. Pobranie notatki podróży z bazy danych przy użyciu Supabase client (`context.locals.supabase`).
3. Walidacja długości treści notatki i obsługa błędów.
4. Wywołanie usługi AI do generowania planu podróży.
5. Zapis wygenerowanego planu do tabeli `travel_plans`.
6. Rejestracja akcji w tabeli `logs`.
7. Zwrócenie odpowiedzi z kodem 201 i danymi wygenerowanego planu.
