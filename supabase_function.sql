--CHECK ALL TRIGGFER FUNCTIONS

SELECT 
    t.tgname AS trigger_name,
    t.tgenabled AS trigger_enabled,
    e.event_manipulation AS trigger_event,
    e.event_object_table AS table_name,
    p.proname AS function_name,
    pg_get_functiondef(p.oid) AS function_definition
FROM 
    pg_trigger t
JOIN 
    pg_proc p ON t.tgfoid = p.oid
JOIN 
    information_schema.triggers e ON e.trigger_name = t.tgname
WHERE 
    NOT t.tgisinternal;


---END

--CHECK THE EXSISTING FUNCTION SQL WITH NAME
SELECT pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
WHERE p.proname = 'set_unique_pass';


--CREATE RANDOM USERS
-- Define the number of users you want to generate
DO $$
DECLARE
    num_users INTEGER := 10; -- Set the number of users to generate
    i INTEGER;
    random_name TEXT;
    random_win_num SMALLINT;
BEGIN
    FOR i IN 1..num_users LOOP
        -- Generate a random name
        random_name := 
            chr(trunc(65 + random() * 26)::int) || 
            chr(trunc(65 + random() * 26)::int) || 
            chr(trunc(65 + random() * 26)::int) || 
            chr(trunc(65 + random() * 26)::int) || 
            chr(trunc(65 + random() * 26)::int);

        -- Generate a random win number between 0 and 100
        random_win_num := trunc(random() * 101)::smallint;

        -- Insert the random user data into the table
        INSERT INTO public.buzz_users (name, win_num, fk_uuid)
        VALUES (random_name, random_win_num, '5d92a80c-864c-4f2f-ae91-89a617f5b521');
    END LOOP;
END $$;

--END

-- ADD ALL Exsisting User to buzz_game table
-- Insert records into buzz_game using all existing ids from buzz_users
-- and leave fk_uuid and name as NULL, ignoring existing records
INSERT INTO public.buzz_game (fk_buzzed_user)
SELECT id
FROM public.buzz_users
ON CONFLICT (fk_buzzed_user) DO NOTHING;

--end
