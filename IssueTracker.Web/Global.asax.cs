using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Autofac;
using Autofac.Integration.Mvc;
using dotless.Core;

namespace IssueTracker.Web
{
	public class MvcApplication : HttpApplication
	{
		protected void Application_Start()
		{
			AreaRegistration.RegisterAllAreas();

			RegisterRoutes(RouteTable.Routes);
			RegisterBundles(BundleTable.Bundles);
			RegisterDependencies();
		}

		private void RegisterRoutes(RouteCollection routes)
		{
			routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
			routes.MapRoute("Default", "{controller}/{action}", new {controller = "Root", action = "Index"});
		}

		private void RegisterBundles(BundleCollection bundles)
		{
			var script = new ScriptBundle("~/scripts").Include("~/Scripts/Global.js").IncludeDirectory("~/Scripts/ThirdParty", "*.js").IncludeDirectory("~/Scripts", "*.js", true);
            if (!HttpContext.Current.IsDebuggingEnabled)
                script.Transforms.Add(new JsMinify());
			bundles.Add(script);

			var less = new LessBundle("~/style").IncludeDirectory("~/CSS", "*.css").IncludeDirectory("~/CSS", "*.less", true);
            if (!HttpContext.Current.IsDebuggingEnabled)
                less.Transforms.Add(new LessMinify());
			bundles.Add(less);
		}

		private void RegisterDependencies()
		{
			DependencyResolver.SetResolver(new AutofacDependencyResolver(Dependencies.Dependencies.Register()));
		}

		private class LessMinify : CssMinify
		{
			public override void Process(BundleContext context, BundleResponse response)
			{
				response.Content = Less.Parse(response.Content);
				base.Process(context, response);
			}
		}
	}
}