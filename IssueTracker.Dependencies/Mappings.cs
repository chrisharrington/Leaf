using AutoMapper;
using IssueTracker.Common.Models;
using IssueTracker.Common.ViewModels;
using IssueTracker.Dependencies.MappingResolvers;

namespace IssueTracker.Dependencies
{
	public static class Mappings
	{
		public static void Register()
		{
			Mapper.CreateMap<IssueViewModel, Issue>()
				.ForMember(dest => dest.Priority, opt => opt.ResolveUsing<DatabaseDetailsResolver<Priority>>().FromMember(x => x.priorityId))
				.ForMember(dest => dest.Status, opt => opt.ResolveUsing<DatabaseDetailsResolver<Status>>().FromMember(x => x.statusId))
				.ForMember(dest => dest.Assignee, opt => opt.ResolveUsing<DatabaseDetailsResolver<User>>().FromMember(x => x.assigneeId))
				.ForMember(dest => dest.Owner, opt => opt.ResolveUsing<DatabaseDetailsResolver<User>>().FromMember(x => x.ownerId))
				.ForMember(dest => dest.UpdatedBy, opt => opt.ResolveUsing<DatabaseDetailsResolver<User>>().FromMember(x => x.updatedId));
		}
	}
}
