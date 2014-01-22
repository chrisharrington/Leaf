using System;

namespace IssueTracker.Common.Models.Base
{
    public abstract class FilterModel
    {
		public Guid Id { get; set; }
		public Filter Filter { get; set; }
    }
}
