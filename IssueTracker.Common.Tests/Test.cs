using System;
using Xunit;

namespace IssueTracker.Common.Tests
{
    public class Test
    {
		protected void AssertPropertiesAreEqual<Model>(Model first, Model second, params Func<Model, object>[] properties)
	    {
			foreach (var property in properties)
			{
				Assert.True(property(first).Equals(property(second)));
			}
	    }
    }
}
