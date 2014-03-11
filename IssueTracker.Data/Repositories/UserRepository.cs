using System;
using System.Linq;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.Data.Repositories
{
	public class UserRepository : BaseProjectRepository<User>, IUserRepository
	{
		public User Email(string email)
		{
			return Context.Users.FirstOrDefault(x => x.EmailAddress == email);
		}

		public override void Update(User model, User user)
		{
			using (var transaction = Context.Database.BeginTransaction())
			{
				var old = Details(model.Id);
				var retrieved = Context.UserProfiles.FirstOrDefault(x => x.UserName == old.EmailAddress);
				if (retrieved != null)
				{
					retrieved.UserName = model.EmailAddress;
					Context.SaveChanges();
				}

				base.Update(model, user);

				transaction.Commit();
			}
		}
	}
}