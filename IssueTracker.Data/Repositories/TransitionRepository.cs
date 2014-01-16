using System;
using System.Collections.Generic;
using System.Linq;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.Data.Repositories
{
	public class TransitionRepository : BaseProjectRepository<Transition>, ITransitionRepository
	{
		public IEnumerable<Transition> Status(Status status)
		{
			if (status == null)
				throw new ArgumentNullException("status");

			return Context.Transitions.Where(x => x.From.Id == status.Id);
		}
	}
}