using IssueTracker.Common.Models;

namespace IssueTracker.Common.Data.Repositories
{
	public interface IUserRepository : IRepository<User>
	{
		User Email(string email);
	}
}