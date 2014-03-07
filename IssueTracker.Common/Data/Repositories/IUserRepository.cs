using IssueTracker.Common.Models;

namespace IssueTracker.Common.Data.Repositories
{
	public interface IUserRepository : IBaseProjectRepository<User>
	{
		User Email(string email);
	}
}