using System;

namespace IssueTracker.Common.ViewModels
{
	public class IssueHistoryViewModel
	{
		public string text { get; set; }
		public string date { get; set; }
		public string user { get; set; }
		public Guid issueId { get; set; }
	}
}