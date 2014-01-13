using System;

namespace IssueTracker.Common.Models
{
    public class Base
    {
		public Guid Id { get; set; }
		public string Name { get; set; }

	    public override string ToString()
	    {
		    return Name;
	    }
    }
}
