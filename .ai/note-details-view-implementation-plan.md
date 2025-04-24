# Plan implementacji widoku Szczegółów notatki

## 1. Przegląd

Widok Szczegółów notatki ma za zadanie wyświetlić pełne informacje dotyczące danej notatki podróżniczej, w tym tytuł, treść oraz wygenerowany przez AI plan podróży. Użytkownik ma możliwość ponownego wygenerowania planu, jeżeli zachodzi taka potrzeba. Widok integruje dane z API i zapewnia intuicyjną prezentację informacji z podziałem na sekcje, obsługę operacji asynchronicznych oraz walidację kluczowych danych.

## 2. Routing widoku

- Ścieżka: `/notes/:noteId`

## 3. Struktura komponentów

- **NoteDetailsContainer** – główny komponent odpowiedzialny za pobranie i prezentację danych notatki.
- **NoteContent** – komponent wyświetlający tytuł i treść notatki.
- **AiPlanModule** – moduł prezentujący wygenerowany plan podróży wraz z datą generacji oraz przyciskiem do ponownego wygenerowania planu.
- **Loader** – komponent wyświetlany w trakcie operacji asynchronicznych (np. pobierania danych czy generowania planu).
- **ErrorAlert** – komponent (opcjonalny) do wyświetlania komunikatów o błędach.

## 4. Szczegóły komponentów

### NoteDetailsContainer

- **Opis:** Główny kontener widoku, który odpowiada za pobranie danych notatki (oraz planu) oraz zarządzanie stanem całego widoku.
- **Główne elementy:** Wywołanie API na podstawie `noteId`, logika warunkowa do wyświetlania loadera lub błędu.
- **Obsługiwane interakcje:** Inicjalne pobranie danych, reakcja na kliknięcie przycisku "Generuj ponownie".
- **Walidacja:** Sprawdzenie, czy notatka ma odpowiednią długość oraz czy odpowiedź API zawiera wymagane pola.
- **Typy:** Użycie `TravelNoteDTO` oraz `TravelPlanDTO` zdefiniowanych w `types.ts`.
- **Props:** Może przyjmować `noteId` przekazane z parametru routingu.

### NoteContent

- **Opis:** Prezentacja podstawowych informacji notatki – tytułu i treści.
- **Główne elementy:** Nagłówek z tytułem, paragraf z treścią notatki.
- **Obsługiwane interakcje:** Brak bezpośrednich interakcji, tylko prezentacja danych.
- **Walidacja:** Upewnienie się, że dane są niepuste.
- **Typy:** `TravelNoteDTO`.
- **Props:** `title` i `content` przekazywane z rodzica.

### AiPlanModule

- **Opis:** Moduł odpowiedzialny za wyświetlanie wygenerowanego planu podróży oraz umożliwienie jego ponownego generowania.
- **Główne elementy:** Sekcja z tytułem planu, treścią planu, datą generacji oraz przyciskiem "Generuj ponownie".
- **Obsługiwane interakcje:** Kliknięcie przycisku, które inicjuje wywołanie endpointu POST do generowania planu.
- **Walidacja:** Weryfikacja odpowiedzi z endpointu (status 201, struktura danych planu) oraz sprawdzenie poprawności pól.
- **Typy:** `TravelPlanDTO` jako model danych planu.
- **Props:** `plan` (obiekt planu) oraz funkcja callback do odświeżenia planu.

### Loader

- **Opis:** Komponent prezentujący animację ładowania w trakcie operacji asynchronicznych.
- **Główne elementy:** Animowany spinner lub progres bar.
- **Obsługiwane interakcje:** Brak – informacja wizualna.
- **Typy:** Standardowy komponent bez dodatkowych typów.
- **Props:** Opcjonalnie rozmiar lub tekst.

### ErrorAlert (opcjonalnie)

- **Opis:** Komponent do wyświetlania komunikatów o błędach w widoku.
- **Główne elementy:** Wiadomość błędu, ikona ostrzeżenia.
- **Obsługiwane interakcje:** Brak – tylko prezentacja.
- **Walidacja:** Komunikat musi być czytelny i zgodny z WCAG.
- **Typy:** String dla komunikatu błędu.
- **Props:** `message`.

## 5. Typy

Wykorzystać istniejące typy z `types.ts`:

- `TravelNoteDTO` – zawiera pola: `id`, `title`, `content`, `created_at`, `updated_at`.
- `TravelPlanDTO` – zawiera pola planu: `note_id`, `title`, `content`, `generated_at`.

Dodatkowo, można zdefiniować ViewModel:

```typescript
interface NoteDetailsViewModel {
  note: TravelNoteDTO;
  plan?: TravelPlanDTO;
  isLoading: boolean;
  error?: string;
}
```

## 6. Zarządzanie stanem

- Użycie React Hooków (useState, useEffect) w komponencie `NoteDetailsContainer` do zarządzania stanem:
  - `note` – przechowuje dane notatki
  - `plan` – przechowuje dane wygenerowanego planu
  - `isLoading` – flaga ładowania
  - `error` – przechowuje komunikaty błędów
- Opcjonalnie, stworzenie custom hooka `useNoteDetails` do kapsułkowania logiki pobierania i generowania planu.

## 7. Integracja API

- **GET /api/travel-notes/{noteId}** – pobranie szczegółów notatki.
- **POST /api/travel-notes/{noteId}/generate-plan** – wygenerowanie planu podróży na podstawie notatki.
  - **Typ żądania:** Żądanie bez dodatkowych parametrów
  - **Typ odpowiedzi:** `TravelPlanDTO` (status 201) lub błąd (400, 422, 500)
- Wywołania API powinny być asynchroniczne z odpowiednią obsługą stanu ładowania i błędów.

## 8. Interakcje użytkownika

- Na załadowaniu widoku następuje pobranie danych notatki i (opcjonalnie) wygenerowanego planu.
- Kliknięcie przycisku "Generuj ponownie" w module AiPlanModule:
  - Przycisk inicjuje wywołanie POST /api/travel-notes/{noteId}/generate-plan.
  - W trakcie operacji wyświetlany jest Loader.
  - Po zakończeniu operacji dane planu są aktualizowane w widoku.
  - W przypadku błędu, użytkownik otrzymuje komunikat (przez ErrorAlert) oraz log błędu w konsoli.

## 9. Warunki i walidacja

- Walidacja długości notatki (100 - 10 000 znaków) przed wysłaniem żądania do API.
- Weryfikacja struktury odpowiedzi API – upewnienie się, że wszystkie wymagane pola są obecne (np. `generated_at`, `content`).
- Przycisk "Generuj ponownie" powinien być wyłączony w trakcie trwania operacji ładowania.

## 10. Obsługa błędów

- W przypadku niepowodzenia wywołań API:
  - Ustawienie stanu `error` w komponencie i wyświetlenie komunikatu błędu za pomocą ErrorAlert.
  - Logowanie szczegółów błędu do konsoli.
  - Ponowne udostępnienie przycisku do ponownego wygenerowania planu.

## 11. Kroki implementacji

1. Utworzenie nowej routingu `/notes/:noteId` i dodanie powiązanego komponentu `NoteDetailsContainer`.
2. Implementacja logiki pobierania danych notatki za pomocą GET /api/travel-notes/{noteId} w `NoteDetailsContainer`.
3. Stworzenie komponentu `NoteContent` w celu prezentacji tytułu i treści notatki.
4. Implementacja modułu `AiPlanModule` z przyciskiem "Generuj ponownie" oraz integracją z POST /api/travel-notes/{noteId}/generate-plan.
5. Dodanie komponentu `Loader` i (opcjonalnie) `ErrorAlert` do obsługi stanów ładowania i błędów.
6. Zastosowanie React Hooków (useState, useEffect) lub custom hooka `useNoteDetails` do zarządzania stanem widoku.
7. Walidacja danych wejściowych oraz odpowiedzi API zgodnie z wymaganiami.
