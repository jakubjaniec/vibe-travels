# Architektura UI dla VibeTravels

## 1. Przegląd struktury UI

Aplikacja VibeTravels opiera się na wspólnym layoucie, który zapewnia spójną nawigację i prezentację widoków. Główne widoki aplikacji obejmują stronę logowania, dashboard z listą notatek, widok profilu oraz szczegółowy widok generowanego planu podróży. Całość budowana jest przy użyciu React oraz komponentów Shadcn/ui.

## 2. Lista widoków

### 2.1 Strona logowania

- **Ścieżka widoku:** `/login`
- **Główny cel:** Umożliwienie logowania użytkowników.
- **Kluczowe informacje:** Formularz logowania zawierający pola: email i hasło.
- **Kluczowe komponenty:** Formularz logowania, przycisk, link do rejestracji.
- **UX, dostępność i bezpieczeństwo:**
  - Jasno oznaczone pola formularza i etykiety.
  - Obsługa błędów logowania z komunikatami.
  - Bezpieczne przekazywanie danych uwierzytelniających.

### 2.2 Strona rejestracji

- **Ścieżka widoku:** `/register`
- **Główny cel:** Umożliwienie rejestracji nowych użytkowników.
- **Kluczowe informacje:** Formularz rejestracji zawierający pola: email i hasło.
- **Kluczowe komponenty:** Formularz rejestracji, przycisk rejestracji, link do logowania.
- **UX, dostępność i bezpieczeństwo:**
  - Jasno oznaczone pola formularza oraz etykiety.
  - Walidacja w czasie rzeczywistym i obsługa błędów.
  - Bezpieczne przesyłanie danych oraz zabezpieczenia przed atakami (np. XSS, CSRF).

### 2.3 Dashboard (Strona główna z listą notatek)

- **Ścieżka widoku:** `/`
- **Główny cel:** Prezentacja pełnej listy notatek podróżniczych użytkownika.
- **Kluczowe informacje:** Lista notatek (tytuł, krótki podgląd, daty utworzenia/edycji) oraz widoczny przycisk "Dodaj notatkę".
- **Kluczowe komponenty:** Lista notatek, karta notatki, przycisk dodawania notatki.
- **UX, dostępność i bezpieczeństwo:**
  - Przejrzysty układ listy notatek.
  - Widoczny przycisk działania.
  - Ograniczony dostęp tylko dla zalogowanych użytkowników.

### 2.4 Widok szczegółów notatki

- **Ścieżka widoku:** `/notes/:noteId`
- **Główny cel:** Prezentacja i edycja szczegółów notatki podróżniczej oraz wygenerowanego planu podróży.
- **Kluczowe informacje:**
  - Tryb podglądu: tytuł notatki, treść notatki, szczegóły wygenerowanego planu
  - Tryb edycji: formularz edycji tytułu i treści z walidacją inline
  - Data ostatniej modyfikacji, opcje generowania planu
- **Kluczowe komponenty:**
  - Widok szczegółowy notatki z możliwością przełączania między trybem podglądu a edycją
  - Moduł prezentujący wygenerowany plan
  - Komponent loadera dla operacji asynchronicznych
  - Przyciski akcji (edytuj, zapisz, anuluj, generuj plan)
- **UX, dostępność i bezpieczeństwo:**
  - Intuicyjna prezentacja informacji z logicznym podziałem na sekcje
  - Płynne przejście między trybem podglądu a edycją
  - Zachowanie stanu edycji w przypadku przypadkowego wyjścia
  - Loader dla długotrwałych operacji
  - Obsługa błędów z logowaniem do konsoli
  - Walidacja formularza w czasie rzeczywistym

### 2.5 Modal dodawania notatki

- **Ścieżka widoku:** Modal wywoływany z dashboardu.
- **Główny cel:** Umożliwienie tworzenia notatek podróżniczych.
- **Kluczowe informacje:** Formularz z polami: tytuł oraz treść (walidacja inline dla długości treści).
- **Kluczowe komponenty:** Modal, formularz, mechanizm walidacji inline.
- **UX, dostępność i bezpieczeństwo:**
  - Przejrzysta walidacja formularza.
  - Focus trap w modalu oraz responsywny design.
  - Dostępny tylko dla zalogowanych użytkowników.

### 2.6 Widok profilu

- **Ścieżka widoku:** `/profile`
- **Główny cel:** Przegląd i aktualizacja preferencji podróżniczych użytkownika.
- **Kluczowe informacje:** Formularz z danymi preferencyjnymi (typ podróży, budżet, styl, liczba osób, długość wyjazdu, poziom aktywności, preferowane klimaty, ograniczenia).
- **Kluczowe komponenty:** Formularz profilu, przycisk zapisu zmian.
- **UX, dostępność i bezpieczeństwo:**
  - Jasne oznaczenie pól formularza.
  - Walidacja danych i obsługa błędów.
  - Bezpieczne przechowywanie danych użytkownika.

## 3. Mapa podróży użytkownika

1. Użytkownik rozpoczyna od strony logowania (`/login`), gdzie widzi formularz logowania oraz komunikat zachęcający do rejestracji.
2. Po zalogowaniu użytkownik trafia do dashboardu (`/`), gdzie widzi pełną listę swoich notatek oraz możliwość dodania nowej.
3. Kliknięcie przycisku "Dodaj notatkę" otwiera modal do tworzenia nowej notatki z formularzem walidacji inline.
4. Kliknięcie na istniejącą notatkę przenosi użytkownika do widoku szczegółowym (`/notes/:noteId`), gdzie widoczny jest wygenerowany plan podróży.
5. Użytkownik może przejść do widoku profilu (`/profile`) w celu aktualizacji swoich preferencji podróżniczych.
6. Podczas operacji asynchronicznych (np. generowanie planu), wyświetlany jest loader, a ewentualne błędy są logowane do konsoli.
7. Nawigacja pomiędzy widokami jest spójna dzięki wspólnemu layoutowi, umożliwiając łatwe przełączanie się między dashboardem a profilem.

## 4. Układ i struktura nawigacji

- Aplikacja korzysta ze wspólnego layoutu zawierającego nagłówek z intuicyjną nawigacją, umożliwiającą przełączanie się między głównymi widokami: "Notatki" (Dashboard) oraz "Profil".
- Nagłówek zawiera także logo oraz informacje o aktualnie zalogowanym użytkowniku.
- Nawigacja jest zoptymalizowana pod kątem desktopów, z uwzględnieniem zasad dostępności WCAG (czytelne etykiety, wysoki kontrast, łatwość klikania).
- Spójna struktura układu umożliwia łatwą orientację w aplikacji oraz szybkie przełączanie się między widokami.

## 5. Kluczowe komponenty

- **Layout:** Wspólny layout dla wszystkich widoków zawierający nagłówek, nawigację oraz miejsce na główną zawartość.
- **Modal:** Komponent odpowiedzialny za wyświetlanie formularzy dodawania/edycji notatek z walidacją inline.
- **Formularze:** Komponenty formularzy do logowania, tworzenia/edycji notatek oraz aktualizacji profilu, implementujące zasadę wczesnych walidacji.
- **Loader:** Komponent wyświetlający animowany loader podczas asynchronicznych operacji (np. generowanie planu).
- **Karta notatki:** Komponent reprezentujący pojedynczą notatkę w liście, zawierający skrócony podgląd treści oraz daty.
- **Error Handling:** Mechanizmy wyświetlania komunikatów błędów oraz logowania problemów do konsoli.
