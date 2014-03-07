namespace IssueTracker.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SingleProjectPerUserDataRestored : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Users", "Project_Id", "dbo.Projects");
            DropIndex("dbo.Users", new[] { "Project_Id" });
            AlterColumn("dbo.Users", "Project_Id", c => c.Guid(nullable: false));
            CreateIndex("dbo.Users", "Project_Id");
            AddForeignKey("dbo.Users", "Project_Id", "dbo.Projects", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Users", "Project_Id", "dbo.Projects");
            DropIndex("dbo.Users", new[] { "Project_Id" });
            AlterColumn("dbo.Users", "Project_Id", c => c.Guid());
            CreateIndex("dbo.Users", "Project_Id");
            AddForeignKey("dbo.Users", "Project_Id", "dbo.Projects", "Id");
        }
    }
}
