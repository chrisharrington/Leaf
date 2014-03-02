using System;

namespace IssueTracker.Common.Models.Base
{
	public class IdModel
	{
		public Guid Id { get; set; }
		public bool IsDeleted { get; set; }
	}
}