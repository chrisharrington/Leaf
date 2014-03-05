namespace IssueTracker.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class EnableRequiredIssueTypes : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Issues", "Type_Id", "dbo.IssueTypes");
            DropIndex("dbo.Issues", new[] { "Type_Id" });
            AlterColumn("dbo.Issues", "Type_Id", c => c.Guid(nullable: false));
            CreateIndex("dbo.Issues", "Type_Id");
            AddForeignKey("dbo.Issues", "Type_Id", "dbo.IssueTypes", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Issues", "Type_Id", "dbo.IssueTypes");
            DropIndex("dbo.Issues", new[] { "Type_Id" });
            AlterColumn("dbo.Issues", "Type_Id", c => c.Guid());
            CreateIndex("dbo.Issues", "Type_Id");
            AddForeignKey("dbo.Issues", "Type_Id", "dbo.IssueTypes", "Id");
        }
    }
}
