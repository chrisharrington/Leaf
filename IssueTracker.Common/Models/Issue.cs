using System;
using IssueTracker.Common.Data.Attributes;

namespace IssueTracker.Common.Models
{
	[TableName("Issues")]
    public class Issue : Base
    {
		public int Number { get;set; }
		public string Description { get; set; }
		public Guid OwnerId { get; set; }
		public Guid AssigneeId { get; set; }
		public Guid PriorityId { get; set; }
		public Guid StatusId { get; set; }
		public DateTime Opened { get; set; }
		public DateTime? Closed { get; set; }
    }
}
