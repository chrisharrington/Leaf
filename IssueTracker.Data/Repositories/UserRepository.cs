using System.Linq;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.Data.Repositories
{
	public class UserRepository : BaseRepository<User>, IUserRepository
	{
		public User Email(string email)
		{
			return Context.Users.FirstOrDefault(x => x.EmailAddress == email);
		}
	}
}