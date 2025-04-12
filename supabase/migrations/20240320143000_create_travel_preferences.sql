-- Migration: Create travel preferences table
-- Description: Creates the travel_preferences table to store user travel preferences
-- with proper RLS policies for authenticated users.

-- Create the travel_preferences table
create table travel_preferences (
    user_id uuid references auth.users(id) not null primary key,
    travel_type text,
    budget text,
    style text,
    number_of_people integer,
    travel_duration integer,
    activity_level text,
    preferred_climates text,
    restrictions text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create index for faster lookups
create index travel_preferences_user_id_idx on travel_preferences(user_id);

-- Enable RLS
alter table travel_preferences enable row level security;

-- Create RLS policies for authenticated users
create policy "Users can view their own preferences"
    on travel_preferences
    for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can insert their own preferences"
    on travel_preferences
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own preferences"
    on travel_preferences
    for update
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can delete their own preferences"
    on travel_preferences
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create trigger for updating the updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_travel_preferences_updated_at
    before update on travel_preferences
    for each row
    execute function update_updated_at_column(); 
