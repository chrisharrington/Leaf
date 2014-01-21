using System.Web.Mvc;

namespace IssueTracker.Web.Helpers
{
	public static class ButtonHelper
	{
		public static MvcHtmlString IconButton(this HtmlHelper htmlHelper, string id, string text, string icon = null, string style = null)
		{
			var button = new TagBuilder("button");
			button.MergeAttribute("id", id);
			if (!string.IsNullOrEmpty(icon))
				button.AddCssClass("icon");
			if (!string.IsNullOrEmpty(style))
				button.AddCssClass(style);
			
			if (string.IsNullOrEmpty(icon))
				button.SetInnerText(text);
			else
			{
				var iconTag = new TagBuilder("i");
				iconTag.AddCssClass("fa " + icon);
				button.InnerHtml += iconTag.ToString();

				var labelTag = new TagBuilder("span");
				labelTag.SetInnerText(text);
				button.InnerHtml += labelTag.ToString();
			}

			return MvcHtmlString.Create(button.ToString());
		}
	}
}