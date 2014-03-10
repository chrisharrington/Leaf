namespace IssueTracker.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class RenamedUserColourCodeToBackground : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Users", "Background", c => c.String());
            DropColumn("dbo.Users", "ColourCode");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Users", "ColourCode", c => c.String());
            DropColumn("dbo.Users", "Background");
        }
    }
}
