using System;

namespace IssueTracker.Common.ViewModels
{
	public class OrderViewModel
	{
		public Guid id { get; set; }
		public string name { get; set; }
		public int order { get; set; }
	}
}