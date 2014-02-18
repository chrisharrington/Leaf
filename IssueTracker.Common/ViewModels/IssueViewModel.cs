using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace IssueTracker.Common.ViewModels
{
	public class IssueViewModel
	{
		[Required] public Guid id { get; set; }
		[Required] public int number { get; set; }
		[Required] public string description { get; set; }
		public string comments { get; set; }
		public string priority { get; set; }
		[Required] public Guid priorityId { get; set; }
		public string status { get; set; }
		[Required] public Guid statusId { get; set; }
		public string developer { get; set; }
		[Required] public Guid developerId { get; set; }
		public string tester { get; set; }
		[Required] public Guid testerId { get; set; }
		public string milestone { get; set; }
		[Required] public Guid milestoneId { get; set; }
		[Required] public string opened { get; set; }
		public string closed { get; set; }
		[Required] public Guid updatedId { get; set; }
		[Required] public string updated { get; set; }
		[Required] public string updatedBy { get; set; }
		public IEnumerable<object> transitions { get; set; }
	}
}
