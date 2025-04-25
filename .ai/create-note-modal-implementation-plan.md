# Plan implementacji modalu Create Note Modal

## 1. Przegląd

Widok reprezentuje modal dodawania notatki, który umożliwia użytkownikowi stworzenie nowej notatki podróżniczej. Modal zawiera formularz z polami: tytuł oraz treść, z obsługą walidacji inline (m.in. długość treści od 100 do 10 000 znaków). Widok jest dostępny tylko dla zalogowanych użytkowników.

## 2. Routing widoku

Modal nie posiada dedykowanej ścieżki URL, lecz jest wywoływany z poziomu dashboardu. Jego aktywacja odbywa się poprzez przycisk "Dodaj notatkę" na stronie głównej, co powoduje nadanie widoczności modalowi poprzez zmianę stanu w komponencie dashboard.

## 3. Struktura komponentów

- **CreateNoteModal** – główny komponent modala, zarządzający wyświetlaniem okna, focus trapem i warstwą tła.
- **NoteForm** – komponent zawierający formularz dodawania notatki.
- **InputField** – komponent do wprowadzania tytułu (może być prostym kontrolowanym inputem).
- **TextAreaField** – komponent do wprowadzania treści notatki, z obsługą walidacji długości.
- **ValidationMessage** – komponent wyświetlający komunikaty walidacji inline.
- **ModalActions** – komponent zawierający przyciski: Zapisz (submit) oraz Anuluj (cancel).

## 4. Szczegóły komponentów

### CreateNoteModal

- **Opis**: Kontener modala invokowanego z dashboardu. Odpowiada za pokazanie/ukrycie okna oraz zapewnienie focus trapu i responsywności.
- **Główne elementy**:
  - Tytuł modala (np. "Add New Travel Note")
  - Komponent NoteForm
  - Overlay modal
- **Obsługiwane interakcje**:
  - Otwarcie i zamknięcie modala
  - Przekazywanie zdarzenia submit do rodzica
- **Obsługiwana walidacja**: Delegowana do NoteForm
- **Typy**: Props określające widoczność (boolean) oraz callback do zamknięcia modala
- **Propsy**: {
  isOpen: boolean,
  onClose: () => void,
  onNoteCreated?: (note: TravelNoteDTO) => void
  }

### NoteForm

- **Opis**: Formularz umożliwiający wpisanie tytułu i treści notatki oraz wysyłkę danych do API.
- **Główne elementy**:
  - InputField do tytułu
  - TextAreaField do treści
  - Przyciski Zapisz i Anuluj
  - Komponent ValidationMessage do wyświetlania błędów
- **Obsługiwane interakcje**:
  - Zmiana wartości pól (onChange)
  - Walidacja przy blur oraz przy próbie submit
  - Wysłanie formularza (onSubmit)
- **Obsługiwana walidacja**:
  - Tytuł: wymagany
  - Treść: wymagana, długość od 100 do 10 000 znaków
- **Typy**: Lokalne stany formularza (tytuł, treść, błędy), typy z DTO (CreateTravelNoteCommand)
- **Propsy**: Callback onCancel oraz onSuccess (po udanym dodaniu notatki)

### InputField & TextAreaField

- **Opis**: Kontrolowane komponenty formularza do zbierania tekstu.
- **Główne elementy**: Pole tekstowe (input lub textarea) z etykietą
- **Obsługiwane interakcje**: onChange, onBlur
- **Warunki walidacji**: Przekazywane z NoteForm
- **Typy**: value: string, onChange: (value: string) => void, error?: string

### ModalActions

- **Opis**: Przyciski akcji w formularzu (submit i cancel).
- **Główne elementy**:
  - Przycisk "Zapisz" (aktywowany przy poprawnych danych)
  - Przycisk "Anuluj" (zamyka modal bez akcji)
- **Obsługiwane interakcje**: onClick dla każdego przycisku

## 5. Typy

- **CreateTravelNoteCommand**: { title: string, content: string } – wykorzystywany do wysyłki do endpointu.
- **TravelNoteDTO**: Typ zwracany przez endpoint (id, title, content, created_at, updated_at).
- **CreateNoteModalViewModel**: Lokalny model stanu formularza zawierający:
  - title: string
  - content: string
  - errors: { title?: string; content?: string }
  - isLoading: boolean

## 6. Zarządzanie stanem

- Użycie hooków useState do przechowywania wartości pól (title, content) oraz błędów walidacyjnych.
- Custom hook (opcjonalnie) np. useCreateNoteForm do enkapsulacji logiki walidacji i wysyłki API.
- Stan modala (otwarty/zamknięty) zarządzany przez komponent rodzica (dashboard) i przekazywany jako props do CreateNoteModal.

## 7. Integracja API

- Wywołanie endpointu POST /api/travel-notes przy użyciu fetch lub biblioteki do zarządzania zapytaniami (np. react-query).
- Żądanie: JSON z polami { title, content } zgodnie z CreateTravelNoteCommand.
- Odpowiedź: Obiekt TravelNoteDTO, który po sukcesie powinien zostać przekazany do rodzica i zaktualizować listę notatek.
- Weryfikacja: Sprawdzenie kodu odpowiedzi (201) oraz walidacja odpowiedzi na frontendzie.

## 8. Interakcje użytkownika

- Użytkownik klika przycisk "Dodaj notatkę" na dashboardzie – modal się otwiera.
- Użytkownik wpisuje tytuł i treść notatki. W trakcie wpisywania wyświetlane są komunikaty walidacji, jeżeli dane są niepoprawne.
- Po wciśnięciu przycisku "Zapisz":
  - Formularz wykonuje walidację lokalną.
  - W przypadku poprawnych danych następuje wysłanie zapytania do API.
  - W momencie sukcesu modal zamyka się, a nowa notatka zostaje dodana do listy.
- Użytkownik może anulować operację, klikając "Anuluj", co zamyka modal bez zapisywania danych.

## 9. Warunki i walidacja

- Tytuł: Pole wymagane (niepuste).
- Treść: Pole wymagane, długość od 100 do 10 000 znaków. Walidacja odbywa się zarówno po stronie klienta (inline) jak i serwera.
- Przycisk "Zapisz" jest aktywny tylko wtedy, gdy wszystkie pola przejdą walidację.

## 10. Obsługa błędów

- Błędy walidacji wyświetlane inline pod odpowiednimi polami.
- Błąd zwracany przez API (np. 400 Bad Request) jest wyświetlany użytkownikowi w postaci komunikatu o błędzie.
- W przypadku wystąpienia błędów sieciowych lub innych nieoczekiwanych błędów wyświetlić ogólny komunikat "Wystąpił błąd podczas tworzenia notatki" oraz zalogować błąd w konsoli.

## 11. Kroki implementacji

1. Utworzenie komponentu CreateNoteModal jako nowego pliku w folderze np. `src/components`.
2. Implementacja struktury modala, wykorzystując Shadcn/ui oraz Tailwind dla stylów.
3. Utworzenie komponentu NoteForm z polami InputField (tytuł) oraz TextAreaField (treść), wraz z walidacją inline.
4. Dodanie logiki zarządzania stanem (useState lub custom hook) do kontrolowania wartości pól oraz błędów.
5. Integracja wywołania API: wysłanie POST do /api/travel-notes przy zatwierdzeniu formularza.
6. Obsługa odpowiedzi API: w przypadku sukcesu, przekazanie danych do rodzica i zamknięcie modala; w przypadku błędu, wyświetlenie odpowiednich komunikatów.
7. Dodanie funkcjonalności przycisku Anuluj, który zamyka modal i resetuje stan formularza.
8. Zapewnienie responsywności i dostępności: implementacja focus trap, odpowiednie oznaczenia dla elementów formularza.
