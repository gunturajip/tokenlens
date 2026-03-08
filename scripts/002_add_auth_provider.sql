-- Add auth_provider column to user_profiles table
alter table user_profiles add column if not exists auth_provider text default 'email';

-- Update the trigger function to handle auth_provider
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_provider text;
begin
  v_provider := coalesce(
    new.raw_user_meta_data->>'provider',
    case 
      when new.identities->0->>'provider' is not null then new.identities->0->>'provider'
      else 'email'
    end
  );

  insert into public.user_profiles (id, display_name, plan, calculations_used, auth_provider)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', null),
    'free',
    0,
    v_provider
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Create a function to update auth_provider when user logs in via OAuth
create or replace function public.handle_user_auth()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.app_metadata is not null and new.app_metadata->>'provider' is not null then
    update public.user_profiles
    set auth_provider = new.app_metadata->>'provider'
    where id = new.id;
  end if;
  
  return new;
end;
$$;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_updated on auth.users;

-- Create trigger to update auth_provider on user update
create trigger on_auth_user_updated
  after update on auth.users
  for each row
  execute function public.handle_user_auth();
