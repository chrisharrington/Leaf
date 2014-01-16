using System;

namespace IssueTracker.Common.ViewModels
{
	public class IssueViewModel
	{
		public Guid id { get; set; }
		public int number { get; set; }
		public string name { get; set; }
		public string description { get; set; }
		public string priority { get; set; }
		public Guid priorityId { get; set; }
		public string status { get; set; }
		public Guid statusId { get; set; }
		public string assignee { get; set; }
		public Guid assigneeId { get; set; }
		public string owner { get; set; }
		public Guid ownerId { get; set; }
		public string opened { get; set; }
		public string closed { get; set; }
		public int transition { get; set; }
	}
}
