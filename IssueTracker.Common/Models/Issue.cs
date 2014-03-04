using System;
using System.Collections.Generic;
using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
    public class Issue : ProjectModel
    {
		public int Number { get;set; }
		public string Details { get; set; }
		public DateTime Opened { get; set; }
		public DateTime? Closed { get; set; }
		public DateTime Updated { get; set; }

		public virtual User Tester { get; set; }
		public virtual User Developer { get; set; }
		public virtual Priority Priority { get; set; }
		public virtual Status Status { get; set; }
		public virtual Milestone Milestone { get; set; }
		public virtual ICollection<IssueAudit> Audits { get; set; }
		public virtual ICollection<Comment> Comments { get; set; }
		public User UpdatedBy { get; set; }

	    public Issue()
	    {
		    Audits = new List<IssueAudit>();
		    Comments = new List<Comment>();
	    }
    }
}
