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
				.ForMember(dest => dest.Developer, opt => opt.ResolveUsing<DatabaseDetailsResolver<User>>().FromMember(x => x.developerId))
				.ForMember(dest => dest.Tester, opt => opt.ResolveUsing<DatabaseDetailsResolver<User>>().FromMember(x => x.testerId))
				.ForMember(dest => dest.UpdatedBy, opt => opt.ResolveUsing<DatabaseDetailsResolver<User>>().FromMember(x => x.updatedId))
				.ForMember(dest => dest.Milestone, opt => opt.ResolveUsing<DatabaseDetailsResolver<Milestone>>().FromMember(x => x.milestoneId))
				.ForMember(dest => dest.Name, opt => opt.MapFrom(x => x.description));
		}
	}
}
