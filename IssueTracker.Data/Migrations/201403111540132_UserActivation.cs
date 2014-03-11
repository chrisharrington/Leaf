namespace IssueTracker.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class UserActivation : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "IsActivated", c => c.Boolean(nullable: false, defaultValue: true));
            AddColumn("dbo.Users", "ActivationId", c => c.Guid(nullable: false, defaultValue: Guid.NewGuid()));
            DropColumn("dbo.Users", "Background");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "Background", c => c.String());
            DropColumn("dbo.Users", "ActivationId");
            DropColumn("dbo.Users", "IsActivated");
        }
    }
}
