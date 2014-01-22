using System;
using System.Collections.Generic;
using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
	public class Filter : ProjectModel
	{
		public ICollection<FilterPriority> Priorities { get; set; }
		public ICollection<FilterStatus> Statuses { get; set; }
		public ICollection<FilterUser> Developers { get; set; }
		public ICollection<FilterUser> Testers { get; set; }
		public ICollection<string> Text { get; set; }
		public ICollection<DateTime> OpenStart { get; set; }
		public ICollection<DateTime> OpenEnd { get; set; }
		public ICollection<DateTime> CloseStart { get; set; }
		public ICollection<DateTime> CloseEnd { get; set; }
	}
}
