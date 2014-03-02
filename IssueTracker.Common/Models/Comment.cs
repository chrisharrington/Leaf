using System;
using IssueTracker.Common.Models.Base;

namespace IssueTracker.Common.Models
{
	public class Comment : IdModel
	{
		public string Text { get; set; }
		public DateTime Date { get; set; }
		public User User { get; set; }
		public Issue Issue { get; set; }
	}
}