--Check the scheduled job
SELECT * FROM cron.job;

--DELETE the job
SELECT cron.unschedule(jobid) FROM cron.job WHERE jobid = your_job_id;


/*Create the Function to Delete Old Records:
Define a SQL function that deletes records older than 3 hours from your table. Replace your_table_name with the actual name of your table.
*/
CREATE OR REPLACE FUNCTION delete_old_records() RETURNS void LANGUAGE plpgsql AS $$
BEGIN
    DELETE FROM buzz_host
    WHERE created_at < NOW() - INTERVAL '3 hours';
END;
$$;

--
SELECT cron.schedule('delete_old_records_every_5_min', '*/5 * * * *', 'SELECT delete_old_records();');

--Varify the job
SELECT * FROM cron.job WHERE jobname = 'delete_old_records_every_5_min';

---TRIGGER ONCE
SELECT delete_old_records();



-------BUZZ_GAME Table
create table
  public.buzz_game (
    id bigint generated by default as identity,
    created_at timestamp with time zone not null default now(),
    fk_uuid uuid null,
    fk_buzzed_user bigint not null,
    name text null,
    constraint buzz_game_pkey primary key (id),
    constraint buzz_game_fk_buzzed_user_key unique (fk_buzzed_user),
    constraint buzz_game_fk_buzzed_user_fkey foreign key (fk_buzzed_user) references buzz_users (id) on update cascade on delete cascade
  ) tablespace pg_default;

create trigger set_fk_uuid_and_name_trigger before insert on buzz_game for each row
execute function set_fk_uuid_and_name ();
-------



--TO SEE THE SET Triggered function
SELECT pg_get_functiondef(p.oid) AS trigger_function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' -- Replace 'public' with the schema name if it's different
  AND p.proname = 'set_fk_uuid_and_name';

---CONTENT
CREATE OR REPLACE FUNCTION public.set_fk_uuid_and_name()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Fetch the fk_uuid from buzz_users table based on fk_buzzed_user
    SELECT fk_uuid INTO NEW.fk_uuid
    FROM buzz_users
    WHERE id = NEW.fk_buzzed_user;

    -- Fetch the name from buzz_users table based on fk_buzzed_user
    SELECT name INTO NEW.name
    FROM buzz_users
    WHERE id = NEW.fk_buzzed_user;

    RETURN NEW;
END;
$function$

-----
