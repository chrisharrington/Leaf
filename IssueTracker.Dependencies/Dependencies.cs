using System.Reflection;
using Autofac;
using IssueTracker.Common.Models;
using IssueTracker.Data;
using IssueTracker.Data.Repositories;

namespace IssueTracker.Dependencies
{
	public static class Dependencies
	{
		public static ContainerBuilder Register()
		{
			var builder = new ContainerBuilder();
			RegisterAssemblyTypes(builder, typeof (UserRepository).Assembly);
			RegisterAssemblyTypes(builder, typeof (User).Assembly);
			builder.RegisterType<DataContext>().AsImplementedInterfaces().AsSelf().PropertiesAutowired().SingleInstance();
			return builder;
		}

		public static void RegisterAssemblyTypes(ContainerBuilder builder, Assembly assembly)
		{
			builder.RegisterAssemblyTypes(assembly).AsImplementedInterfaces().AsSelf().PropertiesAutowired();
		}
	}
}