using System;

namespace IssueTracker.Common.Models
{
	public class DateRange
	{
		public Guid Id { get; set; }
		public DateTime Begin { get; set; }
		public DateTime End { get; set; }
	}
}
