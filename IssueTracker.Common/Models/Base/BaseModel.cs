using System;

namespace IssueTracker.Common.Models.Base
{
    public abstract class BaseModel
    {
		public Guid Id { get; set; }
		public string Name { get; set; }

	    public override string ToString()
	    {
		    return Name;
	    }
    }
}
