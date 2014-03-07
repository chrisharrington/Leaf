namespace IssueTracker.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SingleProjectPerUser : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Projects", "User_Id", "dbo.Users");
            DropIndex("dbo.Projects", new[] { "User_Id" });
            AddColumn("dbo.Users", "Project_Id", c => c.Guid());
            CreateIndex("dbo.Users", "Project_Id");
            AddForeignKey("dbo.Users", "Project_Id", "dbo.Projects", "Id");
            DropColumn("dbo.Projects", "User_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Projects", "User_Id", c => c.Guid());
            DropForeignKey("dbo.Users", "Project_Id", "dbo.Projects");
            DropIndex("dbo.Users", new[] { "Project_Id" });
            DropColumn("dbo.Users", "Project_Id");
            CreateIndex("dbo.Projects", "User_Id");
            AddForeignKey("dbo.Projects", "User_Id", "dbo.Users", "Id");
        }
    }
}
