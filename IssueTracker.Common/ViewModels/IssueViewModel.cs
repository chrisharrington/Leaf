using System;
using System.Collections.Generic;

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
		public string developer { get; set; }
		public Guid developerId { get; set; }
		public string tester { get; set; }
		public Guid testerId { get; set; }
		public string opened { get; set; }
		public string closed { get; set; }
		public Guid updatedId { get; set; }
		public string updated { get; set; }
		public IEnumerable<object> transitions { get; set; }
	}
}
