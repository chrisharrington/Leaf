using System.ComponentModel.DataAnnotations;

namespace IssueTracker.Common.ViewModels
{
	public class SignInViewModel
	{
		[Required] public string email { get; set; }
		[Required] public string password { get; set; }
		public bool staySignedIn { get; set; }
	}
}
