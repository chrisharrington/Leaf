using System;
using IssueTracker.Common.Models;

namespace IssueTracker.Common.ViewModels
{
	public class Sort
	{
		public SortDirection Direction { get; set; }
		public Func<Issue, object> Comparer { get; set; } 
	}

	public enum SortDirection
	{
		Ascending,
		Descending
	}
}
