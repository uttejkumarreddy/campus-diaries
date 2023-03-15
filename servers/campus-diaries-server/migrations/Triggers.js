module.exports.CREATE_TRIGGER_COLLEGE_SET_UPDATED_AT = `
  CREATE TRIGGER set_updated_at
  BEFORE UPDATE 
  ON public.COLLEGE
  FOR EACH ROW
  EXECUTE PROCEDURE public.trigger_set_updated_at();`;

module.exports.CREATE_TRIGGER_ATTACHMENT_SET_UPDATED_AT = `CREATE TRIGGER set_updated_at
  BEFORE UPDATE
  ON public.ATTACHMENT
  FOR EACH ROW
  EXECUTE PROCEDURE public.trigger_set_updated_at();`;

module.exports.CREATE_TRIGGER_GROUP_SET_UPDATED_AT = `CREATE TRIGGER set_updated_at
  BEFORE UPDATE
  ON public.GROUP
  FOR EACH ROW
  EXECUTE PROCEDURE public.trigger_set_updated_at();`;

module.exports.CREATE_TRIGGER_USERS_SET_UPDATED_AT = `CREATE TRIGGER set_updated_at
  BEFORE UPDATE
  ON public.USERS
  FOR EACH ROW
  EXECUTE PROCEDURE public.trigger_set_updated_at();`;

module.exports.CREATE_TRIGGER_POST_SET_UPDATED_AT = `CREATE TRIGGER set_updated_at
  BEFORE UPDATE
  ON public.POST
  FOR EACH ROW
  EXECUTE PROCEDURE public.trigger_set_updated_at();`;