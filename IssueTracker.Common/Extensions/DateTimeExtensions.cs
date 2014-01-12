using System;

namespace IssueTracker.Common.Extensions
{
	public static class DateTimeExtensions
	{
		public static string ToApplicationString(this DateTime date)
		{
			return date.ToString("yyyy-MM-dd");
		}

		public static string ToApplicationString(this DateTime? date)
		{
			return date.HasValue ? ((DateTime) date).ToApplicationString() : "";
		}
	}
}