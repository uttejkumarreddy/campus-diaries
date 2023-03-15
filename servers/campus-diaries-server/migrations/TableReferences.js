// Queries will be executed in the order they are present here
module.exports.CREATE_FKEYS_IN_TABLE_GROUP = `ALTER TABLE public.GROUP
  ADD CONSTRAINT group_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.USERS(id);
`;

module.exports.CREATE_FKEYS_IN_TABLE_USERS = `ALTER TABLE public.USERS
  ADD CONSTRAINT user_college_id_fkey FOREIGN KEY (college_id) REFERENCES public.COLLEGE(id);
`;

module.exports.CREATE_FKEYS_IN_TABLE_POST = `ALTER TABLE public.POST
  ADD CONSTRAINT post_posted_by_fkey FOREIGN KEY (posted_by) REFERENCES public.USERS(id),
  ADD CONSTRAINT post_posted_in_fkey FOREIGN KEY (posted_in) REFERENCES public.GROUP(id);
`;