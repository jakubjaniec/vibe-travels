-- Migration: Create travel plans table
-- Description: Creates the travel_plans table to store AI-generated travel plans
-- with proper RLS policies for authenticated users.

-- Create the travel_plans table
create table travel_plans (
    note_id uuid primary key references travel_notes(id) on delete cascade,
    title text not null,
    content text not null,
    generated_at timestamptz not null default now()
);

-- Enable RLS
alter table travel_plans enable row level security;

-- Create RLS policies for authenticated users
-- Note: We join with travel_notes to check ownership since travel_plans
-- doesn't directly store user_id
create policy "Users can view their own plans"
    on travel_plans
    for select
    to authenticated
    using (
        exists (
            select 1
            from travel_notes
            where travel_notes.id = note_id
            and travel_notes.user_id = auth.uid()
        )
    );

create policy "Users can create plans for their notes"
    on travel_plans
    for insert
    to authenticated
    with check (
        exists (
            select 1
            from travel_notes
            where travel_notes.id = note_id
            and travel_notes.user_id = auth.uid()
        )
    );

create policy "Users can update their own plans"
    on travel_plans
    for update
    to authenticated
    using (
        exists (
            select 1
            from travel_notes
            where travel_notes.id = note_id
            and travel_notes.user_id = auth.uid()
        )
    );

create policy "Users can delete their own plans"
    on travel_plans
    for delete
    to authenticated
    using (
        exists (
            select 1
            from travel_notes
            where travel_notes.id = note_id
            and travel_notes.user_id = auth.uid()
        )
    ); 
