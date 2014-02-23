using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Autofac;
using Autofac.Integration.Mvc;
using AutoMapper;
using dotless.Core;
using IssueTracker.Dependencies;
using IssueTracker.Dependencies.MappingResolvers;
using WebMatrix.WebData;

namespace IssueTracker.Web
{
	public class MvcApplication : HttpApplication
	{
		protected void Application_Start()
		{
			AreaRegistration.RegisterAllAreas();
			WebSecurity.InitializeDatabaseConnection("DefaultDataConnection", "UserProfiles", "UserId", "UserName", true);

			RegisterRoutes(RouteTable.Routes);
			RegisterBundles(BundleTable.Bundles);
			RegisterDependencies();
			Mappings.Register();
		}

		private void RegisterRoutes(RouteCollection routes)
		{
			routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
			routes.MapRoute("Default", "{controller}/{action}", new {controller = "Root", action = "Index"});
		}

		private void RegisterBundles(BundleCollection bundles)
		{
			var script = new ScriptBundle("~/code").Include("~/Scripts/Global.js").IncludeDirectory("~/Scripts/ThirdParty", "*.js").IncludeDirectory("~/Scripts", "*.js", true);
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
			IContainer container = null;
			var builder = Dependencies.Dependencies.Register();
			builder.RegisterControllers(typeof(MvcApplication).Assembly).PropertiesAutowired();

			Mapper.Initialize(x => x.ConstructServicesUsing(y => container.Resolve(y)));

			builder.RegisterGeneric(typeof(DatabaseDetailsResolver<>)).AsSelf().PropertiesAutowired();

			container = builder.Build();

			DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
		}

		private class LessMinify : CssMinify
		{
			public override void Process(BundleContext context, BundleResponse response)
			{
				var builder = new StringBuilder();
				foreach (var bundle in context.BundleCollection.Where(x => x is LessBundle))
				{
					var files = bundle.EnumerateFiles(context);
					var global = files.FirstOrDefault(x => x.VirtualFile.VirtualPath.EndsWith("Global.less"));
					var remaining = files.Where(x => !x.VirtualFile.VirtualPath.EndsWith("Global.less")).ToList();
					remaining.Insert(0, global);
					foreach (var file in remaining)
					{
						var location = HttpContext.Current.Server.MapPath(file.VirtualFile.VirtualPath);
						using (var reader = new StreamReader(File.Open(location, FileMode.Open, FileAccess.Read)))
						{
							string line;
							while ((line = reader.ReadLine()) != null)
								if (!line.Contains("@import"))
									builder.AppendLine(line);
						}

					}
				}
				response.Content = Less.Parse(builder.ToString());
				base.Process(context, response);
			}
		}
	}
}