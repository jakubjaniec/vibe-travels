# Plan implementacji widoku Dashboard

## 1. Przegląd

Dashboard (Strona główna) prezentuje pełną listę notatek podróżniczych użytkownika. Głównym celem widoku jest umożliwienie szybkiego przeglądu zapisanych notatek oraz inicjacja procesu tworzenia nowej notatki.

## 2. Routing widoku

Widok dostępny pod ścieżką: `/`
Dostęp do widoku mają tylko zalogowani użytkownicy.

## 3. Struktura komponentów

- **DashboardPage**: Główna strona widoku, odpowiedzialna za pobieranie danych i renderowanie podkomponentów.
  - **NoteList**: Komponent wyświetlający listę notatek.
    - **NoteCard**: Pojedyncza karta notatki.
  - **AddNoteButton**: Przycisk inicjujący proces dodawania nowej notatki.

## 4. Szczegóły komponentów

### DashboardPage

- Opis: Strona główna widoku, pobiera notatki z API i przekazuje dane do komponentów.
- Główne elementy: Opakowanie widoku, nagłówek, kontener na listę notatek, przycisk "Dodaj notatkę".
- Obsługiwane interakcje: Pobieranie danych przy załadowaniu, obsługa kliknięcia przycisku "Dodaj notatkę".
- Obsługiwana walidacja: Sprawdzenie autoryzacji użytkownika; weryfikacja poprawności danych z API.
- Typy: Użycie `TravelNoteDTO` dla pojedynczej notatki.
- Propsy: Brak, dane pobierane wewnętrznie.

### NoteList

- Opis: Komponent odpowiedzialny za iteracyjne renderowanie listy notatek.
- Główne elementy: Kontener listy, mapowanie danych na karty notatek.
- Obsługiwane interakcje: Brak bezpośrednich interakcji, przekazanie informacji do potomnych komponentów.
- Obsługiwana walidacja: Wyświetlenie informacji ("Brak notatek") przy pustej liście.
- Typy: Tablica `TravelNoteDTO[]`.
- Propsy: `notes: TravelNoteDTO[]`.

### NoteCard

- Opis: Komponent reprezentujący pojedynczą notatkę.
- Główne elementy: Tytuł notatki, krótki podgląd zawartości (np. 100 znaków), daty utworzenia/edycji.
- Obsługiwane interakcje: Kliknięcie na kartę przekierowuje do szczegółowego widoku notatki.
- Obsługiwana walidacja: Sprawdzenie istnienia wymaganych pól notatki.
- Typy: Użycie `TravelNoteDTO` dla danych notatki oraz dodatkowy typ `NoteCardProps` dla przyjmowanych właściwości.
- Propsy: `note: TravelNoteDTO`, `onClick?: () => void`.

### AddNoteButton

- Opis: Przycisk umożliwiający dodawanie nowej notatki.
- Główne elementy: Button z etykietą "Dodaj notatkę".
- Obsługiwane interakcje: Kliknięcie powoduje przejście do widoku tworzenia notatki.
- Obsługiwana walidacja: Brak specyficznych, oprócz sprawdzenia autoryzacji.
- Typy: Standardowy typ przycisku.
- Propsy: `onClick: () => void`.

## 5. Typy

- **TravelNoteDTO:** Typ eksportowany z `src/types.ts`, reprezentuje dane pojedynczej notatki.
- **NoteCardProps:** Nowy typ zawierający:
  - `note: TravelNoteDTO`
  - Opcjonalne `onClick?: () => void`
- **ViewModel (opcjonalnie):** Możliwe rozszerzenie danych dla widoku listy, np. dodanie pola `snippet: string` (skrócony podgląd zawartości notatki, np. 100 znaków).

## 6. Zarządzanie stanem

- Użycie hooków `useState` oraz `useEffect` do zarządzania stanem:
  - `notes: TravelNoteDTO[]` – przechowuje pobrane notatki.
  - `loading: boolean` – informuje o stanie ładowania danych.
  - `error: string | null` – przechowuje informacje o błędzie, jeśli wystąpi.
- Opcjonalnie: Utworzenie customowego hooka `useTravelNotes` do obsługi logiki pobierania danych z API.

## 7. Integracja API

- **Endpoint:** GET `/api/travel-notes`
- **Opis integracji:** Przy użyciu metody `fetch` pobieramy dane notatek. Oczekiwany format odpowiedzi:
  ```json
  {
    "notes": [
      { "id": "UUID", "title": "string", "content": "string", "created_at": "timestamp", "updated_at": "timestamp" }
    ]
  }
  ```
- **Typy żądania/odpowiedzi:** Żądanie nie wymaga ciała. Odpowiedź przetwarzana jako obiekt zawierający `notes: TravelNoteDTO[]`.
- **Weryfikacja:** W przypadku błędu (status != 200) wyświetlenie komunikatu błędu oraz obsługa stanu `error`.

## 8. Interakcje użytkownika

- Automatyczne pobieranie notatek przy załadowaniu strony (loading state).
- Kliknięcie karty notatki przenosi użytkownika do widoku szczegółów notatki.
- Kliknięcie przycisku "Dodaj notatkę" przenosi użytkownika do widoku tworzenia nowej notatki.
- Efekt hover na kartach notatek i wizualne potwierdzenie aktywności przycisków.

## 9. Warunki i walidacja

- Weryfikacja autoryzacji – widok dostępny tylko dla zalogowanych użytkowników.
- Sprawdzenie, czy dane z API zawierają wymagane pola (np. id, title, content, daty).
- Walidacja minimalnej długości dla podglądu zawartości notatki (np. skracanie do 100 znaków).
- Informowanie użytkownika o błędach pobierania danych przy nieudanej odpowiedzi z API.

## 10. Obsługa błędów

- Wyświetlanie komunikatu o błędzie w przypadku niepowodzenia pobrania danych.
- Fallback UI przy pustej liście notatek.
- Logowanie błędów (np. przy użyciu `console.error`) dla celów debugowania.

## 11. Kroki implementacji

1. Utworzyć nowy widok Dashboard (plik `src/pages/index.astro` lub komponent `DashboardPage.tsx`).
2. Zaimplementować customowy hook `useTravelNotes` do pobierania notatek z endpointu GET `/api/travel-notes`.
3. Zbudować komponent `NoteList`, który iteruje po tablicy notatek i renderuje komponenty `NoteCard`.
4. Zaimplementować komponent `NoteCard`, który wyświetla tytuł, skrócony podgląd zawartości oraz daty notatki.
5. Stworzyć komponent `AddNoteButton` reagujący na kliknięcie i inicjujący nawigację do widoku tworzenia nowej notatki.
6. Dodać obsługę stanów `loading` i `error` w komponencie `DashboardPage`.
7. Dostosować UI zgodnie z wytycznymi Tailwind oraz Shadcn/ui.
