using System;

namespace IssueTracker.Common.Extensions
{
	public static class DateTimeExtensions
	{
		public static string ToApplicationString(this DateTime date, int timezoneOffset)
		{
			return date.AddMinutes(timezoneOffset*-1).ToString("yyyy-MM-dd");
		}

		public static string ToApplicationString(this DateTime? date, int timezoneOffset)
		{
			return date.HasValue ? ((DateTime) date).ToApplicationString(timezoneOffset) : "";
		}

		public static string ToLongApplicationString(this DateTime date, int timezoneOffset)
		{
			return date.AddMinutes(timezoneOffset*-1).ToString("yyyy-MM-dd H:mm:ss");
		}
	}
}