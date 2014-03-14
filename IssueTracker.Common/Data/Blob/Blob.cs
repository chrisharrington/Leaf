using System;
using System.IO;

namespace IssueTracker.Common.Data.Blob
{
	public class  Blob
	{
		public Guid Id { get; set; }
		public string Name { get; set; }
		public string MimeType { get; set; }
		public Stream Contents { get; set; }
	}
}