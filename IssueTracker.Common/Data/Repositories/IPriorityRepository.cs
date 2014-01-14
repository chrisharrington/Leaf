using IssueTracker.Common.Models;

namespace IssueTracker.Common.Data.Repositories
{
	public interface IPriorityRepository : IBaseProjectRepository<Priority>
	{
		Priority Name(string priority);
	}
}