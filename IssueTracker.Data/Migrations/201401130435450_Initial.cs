namespace IssueTracker.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Issues",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Number = c.Int(nullable: false),
                        Description = c.String(),
                        Opened = c.DateTime(nullable: false),
                        Closed = c.DateTime(),
                        Name = c.String(),
                        Assignee_Id = c.Guid(),
                        Owner_Id = c.Guid(),
                        Priority_Id = c.Guid(),
                        Status_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ApplicationUsers", t => t.Assignee_Id)
                .ForeignKey("dbo.ApplicationUsers", t => t.Owner_Id)
                .ForeignKey("dbo.Priorities", t => t.Priority_Id)
                .ForeignKey("dbo.Status", t => t.Status_Id)
                .Index(t => t.Assignee_Id)
                .Index(t => t.Owner_Id)
                .Index(t => t.Priority_Id)
                .Index(t => t.Status_Id);
            
            CreateTable(
                "dbo.ApplicationUsers",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        EmailAddress = c.String(),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Priorities",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Order = c.Int(nullable: false),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Status",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Order = c.Int(nullable: false),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Issues", "Status_Id", "dbo.Status");
            DropForeignKey("dbo.Issues", "Priority_Id", "dbo.Priorities");
            DropForeignKey("dbo.Issues", "Owner_Id", "dbo.ApplicationUsers");
            DropForeignKey("dbo.Issues", "Assignee_Id", "dbo.ApplicationUsers");
            DropIndex("dbo.Issues", new[] { "Status_Id" });
            DropIndex("dbo.Issues", new[] { "Priority_Id" });
            DropIndex("dbo.Issues", new[] { "Owner_Id" });
            DropIndex("dbo.Issues", new[] { "Assignee_Id" });
            DropTable("dbo.Status");
            DropTable("dbo.Priorities");
            DropTable("dbo.ApplicationUsers");
            DropTable("dbo.Issues");
        }
    }
}
