using System;

namespace IssueTracker.Common.ViewModels
{
	public class TransitionViewModel
	{
		public Guid id { get; set; }
		public string name { get; set; }
		public Guid fromId { get; set; }
		public Guid toId { get; set; }
	}
}