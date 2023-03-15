module.exports.CREATE_TRIGGER_FUNC_SET_UPDATED_AT = `
  CREATE OR REPLACE FUNCTION trigger_set_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;`;