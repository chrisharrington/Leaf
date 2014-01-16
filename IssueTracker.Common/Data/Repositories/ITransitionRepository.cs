using System.Collections.Generic;
using IssueTracker.Common.Models;

namespace IssueTracker.Common.Data.Repositories
{
	public interface ITransitionRepository : IBaseProjectRepository<Transition>
	{
		IEnumerable<Transition> Status(Status status);
	}
}