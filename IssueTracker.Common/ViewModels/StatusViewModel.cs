using System;

namespace IssueTracker.Common.ViewModels
{
	public class StatusViewModel
	{
		public Guid id { get; set; }
		public string name { get; set; }
		public int order { get; set; }
	}
}