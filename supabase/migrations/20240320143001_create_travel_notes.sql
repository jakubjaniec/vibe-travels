-- Migration: Create travel notes table
-- Description: Creates the travel_notes table to store user travel notes
-- with proper RLS policies for authenticated users.

-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- Create the travel_notes table
create table travel_notes (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    title text not null,
    content text not null check (char_length(content) between 100 and 10000),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Create index for faster lookups
create index travel_notes_user_id_idx on travel_notes(user_id);

-- Enable RLS
alter table travel_notes enable row level security;

-- Create RLS policies for authenticated users
create policy "Users can view their own notes"
    on travel_notes
    for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can create their own notes"
    on travel_notes
    for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update their own notes"
    on travel_notes
    for update
    to authenticated
    using (auth.uid() = user_id);

create policy "Users can delete their own notes"
    on travel_notes
    for delete
    to authenticated
    using (auth.uid() = user_id);

-- Create trigger for updating the updated_at timestamp
create trigger update_travel_notes_updated_at
    before update on travel_notes
    for each row
    execute function update_updated_at_column(); 
