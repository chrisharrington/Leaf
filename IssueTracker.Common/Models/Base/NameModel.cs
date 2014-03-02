using System;

namespace IssueTracker.Common.Models.Base
{
    public abstract class NameModel : IdModel
    {
		public string Name { get; set; }

	    public override string ToString()
	    {
		    return Name;
	    }
    }
}
