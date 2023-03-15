module.exports.COLLEGE_SET_UPDATED_AT = `CREATE TRIGGER set_updated_at
    BEFORE UPDATE 
    ON public.college
    FOR EACH ROW
    EXECUTE PROCEDURE public.trigger_set_updated_at();`;

module.exports.CDUSER_SET_UPDATED_AT = `CREATE TRIGGER set_updated_at
BEFORE UPDATE
ON public.cduser
FOR EACH ROW
EXECUTE PROCEDURE public.trigger_set_updated_at();`;