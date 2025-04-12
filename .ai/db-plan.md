# Database Schema for VibeTravels

## 1. Tabele

### 1.1. users

This table is managed by Supabase Auth

- id: UUID, PRIMARY KEY.
- email: TEXT, NOT NULL, UNIQUE.
- encrypted_password: TEXT, NOT NULL.
- created_at: TIMESTAMPTZ, NOT NULL, DEFAULT NOW().
- confirmed_at: TIMESTAMPTZ, DEFAULT NULL.

### 1.2. travel_preferences

- user_id: UUID, NOT NULL, REFERENCES users(id).
- travel_type: TEXT.
- budget: TEXT.
- style: TEXT.
- number_of_people: INTEGER.
- travel_duration: INTEGER.
- activity_level: TEXT.
- preferred_climates: TEXT.
- restrictions: TEXT.

### 1.3. travel_notes

- id: UUID, PRIMARY KEY, DEFAULT uuid_generate_v4().
- user_id: UUID, NOT NULL, REFERENCES users(id).
- title: TEXT, NOT NULL.
- content: TEXT, NOT NULL, CHECK (char_length(content) BETWEEN 100 AND 10000).
- created_at: TIMESTAMPTZ, NOT NULL, DEFAULT NOW().
- updated_at: TIMESTAMPTZ, NOT NULL, DEFAULT NOW().

### 1.4. travel_plans

- note_id: UUID, PRIMARY KEY, REFERENCES travel_notes(id).
- title: TEXT, NOT NULL.
- content: TEXT, NOT NULL.
- generated_at: TIMESTAMPTZ, NOT NULL, DEFAULT NOW().

### 1.5. logs

- id: SERIAL, PRIMARY KEY.
- user_id: UUID, NOT NULL, REFERENCES users(id).
- timestamp: TIMESTAMPTZ, NOT NULL, DEFAULT NOW().
- action_type: TEXT, NOT NULL.

## 2. Relacje między tabelami

- `travel_preferences.user_id` odnosi się do `users.id`.
- `travel_notes.user_id` odnosi się do `users.id`.
- Relacja 1:1 między `travel_notes` a `travel_plans` poprzez identyczny klucz: `travel_notes.id` odpowiada `travel_plans.note_id`.
- `logs.user_id` odnosi się do `users.id`.

## 3. Indeksy

- Unikalny indeks na `users(email)`.
- Indeks na `travel_preferences(user_id)`.
- Indeks na `travel_notes(user_id)`.
- Indeks na `logs(user_id)`.

## 4. Zasady PostgreSQL (RLS)

- Włączenie RLS na wszystkich tabelach.
- Przykładowa polityka:
  ```sql
  ALTER TABLE travel_preferences ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "User can access own preferences" ON travel_preferences FOR ALL USING (user_id = current_setting('myapp.current_user_id')::uuid);
  -- Podobne polityki można zastosować dla travel_notes, travel_plans i logs.
  ```

## 5. Dodatkowe uwagi

- Wszystkie kolumny dat używają typu `TIMESTAMPTZ` dla poprawnego zarządzania strefami czasowymi.
- Relacja 1:1 między `travel_notes` a `travel_plans` jest zapewniona poprzez użycie `note_id` jako klucza głównego w tabeli `travel_plans`.
