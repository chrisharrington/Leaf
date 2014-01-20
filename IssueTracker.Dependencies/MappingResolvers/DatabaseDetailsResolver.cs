using System;
using AutoMapper;
using IssueTracker.Common.Data.Repositories;
using IssueTracker.Common.Models;

namespace IssueTracker.Dependencies.MappingResolvers
{
	public class DatabaseDetailsResolver<Model> : ValueResolver<Guid, Model> where Model : BaseModel
	{
		public IRepository<Model> Repository { get; set; }

		protected override Model ResolveCore(Guid source)
		{
			return Repository.Details(source);
		}
	}
}
