using System;

namespace IssueTracker.Common.Data.Attributes
{
	[AttributeUsage(AttributeTargets.Class)]
	public class TableNameAttribute : Attribute
	{
		public string Name { get; private set; }

		public TableNameAttribute(string name)
		{
			Name = name;
		}
	}
}