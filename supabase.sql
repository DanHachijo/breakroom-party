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
