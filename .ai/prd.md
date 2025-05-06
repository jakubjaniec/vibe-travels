# Dokument wymagań produktu (PRD) - VibeTravels

## 1. Przegląd produktu

VibeTravels to aplikacja mająca na celu uproszczenie procesu planowania angażujących i interesujących wycieczek. Dzięki wykorzystaniu technologii AI, aplikacja zamienia proste, tekstowe notatki o miejscach i celach podróży na szczegółowe plany wyjazdowe, dostosowane do indywidualnych preferencji użytkowników. Kluczowymi elementami systemu są: zarządzanie notatkami, strona profilu z preferencjami turystycznymi oraz integracja z systemem AI do generowania planów podróży.

## 2. Problem użytkownika

Użytkownicy napotykają trudności na początku procesu planowania podróży z powodu:

- Skomplikowanego procesu, w którym brakuje jasnego przewodnika krok po kroku.
- Nadmiaru informacji, które mogą przytłaczać.
- Braku intuicyjnych narzędzi umożliwiających szybkie przekształcenie pomysłów w konkretne plany wyjazdowe.

## 3. Wymagania funkcjonalne

- Zarządzanie notatkami podróżniczymi:
  - Zapisywanie i odczytywanie notatek o przyszłych wycieczkach
  - Edycja notatek bezpośrednio w widoku szczegółów
  - Usuwanie notatek
  - Generowanie planów podróży na podstawie notatek
- System kont użytkowników:
  - Rejestracja i logowanie.
  - Powiązanie notatek z konkretnym użytkownikiem.
  - Usuwanie konta
- Strona profilu użytkownika:
  - Umożliwienie uzupełnienia profilu o podstawowe dane potrzebne do personalizacji planu podróży (np. typ podróży, budżet, styl, liczba osób, długość wyjazdu, poziom aktywności, preferowane klimaty, ograniczenia).
- Integracja z systemem AI:
  - Przetwarzanie notatek w formacie plain text, z walidacją długości (od 100 do 10 000 znaków), w celu wygenerowania szczegółowego planu podróży.
- Logowanie kluczowych akcji:
  - Zapis notatek oraz generowanie planów są logowane w bazie danych, co umożliwia analizę interakcji użytkowników.

## 4. Granice produktu

- Brak możliwości współdzielenia planów podróży między kontami użytkowników.
- Brak obsługi i analizy multimediów (np. zdjęć miejsc do odwiedzenia).
- Brak zaawansowanego planowania logistyki oraz szczegółowego planowania czasu wyjazdu.
- Ograniczona walidacja notatek, polegająca wyłącznie na sprawdzaniu długości tekstu.
- Brak wyszukiwania notatek i planów podróży
- Brak systemu powiadomień

## 5. Historyjki użytkowników

US-001  
Tytuł: Rejestracja i logowanie  
Opis: Jako nowy użytkownik chcę założyć konto oraz zalogować się, aby móc korzystać z aplikacji i tworzyć swoje notatki podróżnicze.  
Kryteria akceptacji:

- Użytkownik może zarejestrować się, podając wymagane dane (email, hasło).
- Po udanej rejestracji użytkownik otrzymuje potwierdzenie.
- Użytkownik może zalogować się przy użyciu poprawnych danych.

US-002  
Tytuł: Uzupełnienie i modyfikacja profilu użytkownika  
Opis: Jako zalogowany użytkownik pragnę uzupełnić swoje preferencje turystyczne, aby aplikacja mogła dostosować generowany plan podróży do moich potrzeb.  
Kryteria akceptacji:

- Dostęp do strony profilu wymaga aktywnej sesji użytkownika.
- Profil zawiera pola: typ podróży, budżet, styl, liczba osób, długość wyjazdu, poziom aktywności, preferowane klimaty, ograniczenia.
- Zmiany w profilu są zapisywane i dostępne przy kolejnych logowaniach.

US-003  
Tytuł: Zarządzanie notatkami podróżniczymi  
Opis: Jako zalogowany użytkownik chcę zapisywać, edytować, przeglądać oraz usuwać notatki o przyszłych wycieczkach, aby łatwo zarządzać swoimi pomysłami na wyjazdy.  
Kryteria akceptacji:

- Wszystkie operacje na notatkach wymagają aktywnej sesji użytkownika.
- Użytkownik może dodać nową notatkę.
- Użytkownik może przeglądać szczegóły notatki.
- Użytkownik może edytować notatkę bezpośrednio w widoku szczegółów.
- Użytkownik może przełączać się między trybem podglądu a edycji.
- Zmiany w notatce są walidowane w czasie rzeczywistym.
- Użytkownik może anulować edycję i wrócić do ostatnio zapisanej wersji.
- Użytkownik może usuwać notatki.
- Notatki są powiązane z kontem użytkownika i zapisywane w bazie danych.

US-004  
Tytuł: Generowanie planu podróży  
Opis: Jako zalogowany użytkownik chcę wygenerować szczegółowy plan podróży na podstawie zapisanej notatki, aby otrzymać gotowy plan wyjazdu, uwzględniający moje preferencje.  
Kryteria akceptacji:

- Notatka musi zawierać od 100 do 10 000 znaków.
- Po kliknięciu przycisku generowania planu, system przetwarza notatkę za pomocą integracji z systemem AI.
- Użytkownik otrzymuje szczegółowy plan podróży, dostosowany do danych zawartych w profilu.
- Akcja generowania planu jest logowana w bazie danych.

US-005  
Tytuł: Bezpieczny dostęp i autoryzacja  
Opis: Jako użytkownik chcę mieć pewność, że moje dane są chronione, a dostęp do wszystkich funkcji aplikacji jest możliwy tylko po poprawnej autoryzacji.  
Kryteria akceptacji:

- Wszystkie ścieżki aplikacji są chronione i wymagają autentykacji.
- Próba dostępu do chronionej funkcjonalności przez niezalogowanego użytkownika skutkuje przekierowaniem do strony logowania.
- System przechowuje i weryfikuje tokeny sesji.
- Mechanizm autoryzacji działa zgodnie z integracją systemu Supabase.
- Po wylogowaniu wszystkie tokeny sesji są unieważniane.

## 6. Metryki sukcesu

- 90% użytkowników posiada wypełnione preferencje turystyczne w swoim profilu.
- 75% użytkowników generuje co najmniej 3 plany podróży rocznie.
- System loguje kluczowe akcje (zapis notatek oraz generowanie planów), umożliwiając analizę interakcji użytkowników i ocenę skuteczności produktu.
