using System;
using System.Collections.Generic;
using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
	public class IssueAudit : IdModel
	{
		public Issue Issue { get; set; }
		public User User { get; set; }
		public DateTime Date { get; set; }
		public virtual ICollection<Audit> Changes { get; set; }
	}
}
