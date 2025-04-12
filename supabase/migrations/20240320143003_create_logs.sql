-- Migration: Create logs table
-- Description: Creates the logs table to store user activity logs
-- with proper RLS policies for authenticated users.

-- Create the logs table
create table logs (
    id serial primary key,
    user_id uuid references auth.users(id) not null,
    timestamp timestamptz not null default now(),
    action_type text not null
);

-- Create index for faster lookups
create index logs_user_id_idx on logs(user_id);
create index logs_timestamp_idx on logs(timestamp);

-- Enable RLS
alter table logs enable row level security;

-- Create RLS policies for authenticated users
create policy "Users can view their own logs"
    on logs
    for select
    to authenticated
    using (auth.uid() = user_id);

-- Only allow inserts, no updates or deletes for logs
create policy "Users can create their own logs"
    on logs
    for insert
    to authenticated
    with check (auth.uid() = user_id); 
