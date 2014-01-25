using System;

namespace IssueTracker.Common.ViewModels
{
	public class UserViewModel
	{
		public Guid id { get; set; }
		public string name { get; set; }
		public string emailAddress { get; set; }
	}
}