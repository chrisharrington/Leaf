using System;
using IssueTracker.Common.Models;

namespace IssueTracker.Common.ViewModels
{
	public class Sort
	{
		public SortDirection direction { get; set; }
		public string comparer { get; set; }

		public Func<Issue, object> GetComparerFunction()
		{
			if (string.IsNullOrEmpty(comparer))
				throw new ArgumentNullException("comparer");

			switch (comparer.ToLower())
			{
				case "name":
					return x => x.Name;
				case "priority":
					return x => x.Priority.Order;
				case "status":
					return x => x.Status.Order;
				case "assignee":
					return x => x.Assignee.Name;
				case "owner":
					return x => x.Owner.Name;
				case "opened":
					return x => x.Opened;
				case "closed":
					return x => x.Closed;
			}

			throw new InvalidOperationException("No func for comparer \"" + comparer + "\".");
		} 
	}

	public enum SortDirection
	{
		Ascending,
		Descending
	}
}
