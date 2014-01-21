using System.Web.Mvc;

namespace IssueTracker.Web.Helpers
{
	public static class ButtonHelper
	{
		public static MvcHtmlString IconButton(this HtmlHelper htmlHelper, string text, string icon = null, string style = null, bool isRight = false, string dataBind = null, string id = null, string labelDataBind = null)
		{
			var button = new TagBuilder("button");

			SetAttribute(button, "id", id);
			SetAttribute(button, "data-bind", dataBind);
			SetCssClasses(icon, style, isRight, button);

			if (string.IsNullOrEmpty(icon))
				button.SetInnerText(text);
			else
				AddInnerElements(text, icon, button, labelDataBind, isRight);

			return MvcHtmlString.Create(button.ToString());
		}

		private static void AddInnerElements(string text, string icon, TagBuilder button, string labelDataBind, bool isRight)
		{
			var iconTag = new TagBuilder("i");
			iconTag.AddCssClass("fa " + icon);

			var labelTag = new TagBuilder("span");
			labelTag.SetInnerText(text);
			SetAttribute(labelTag, "data-bind", labelDataBind);

			if (isRight)
			{
				button.InnerHtml += labelTag.ToString();
				button.InnerHtml += iconTag.ToString();
			}
			else
			{
				button.InnerHtml += iconTag.ToString();
				button.InnerHtml += labelTag.ToString();
			}
		}

		private static void SetCssClasses(string icon, string style, bool isRight, TagBuilder button)
		{
			if (!string.IsNullOrEmpty(icon))
				button.AddCssClass("icon");
			if (!string.IsNullOrEmpty(style))
				button.AddCssClass(style);
			if (isRight)
				button.AddCssClass("right");
		}

		private static void SetAttribute(TagBuilder button, string name, string id)
		{
			if (!string.IsNullOrEmpty(id))
				button.MergeAttribute(name, id);
		}

		
	}
}