namespace IssueTracker.Data.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
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
                        Updated = c.DateTime(nullable: false),
                        Name = c.String(),
                        Assignee_Id = c.Guid(),
                        Owner_Id = c.Guid(),
                        Priority_Id = c.Guid(),
                        Project_Id = c.Guid(),
                        Status_Id = c.Guid(),
                        UpdatedBy_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.Assignee_Id)
                .ForeignKey("dbo.Users", t => t.Owner_Id)
                .ForeignKey("dbo.Priorities", t => t.Priority_Id)
                .ForeignKey("dbo.Projects", t => t.Project_Id)
                .ForeignKey("dbo.Status", t => t.Status_Id)
                .ForeignKey("dbo.Users", t => t.UpdatedBy_Id)
                .Index(t => t.Assignee_Id)
                .Index(t => t.Owner_Id)
                .Index(t => t.Priority_Id)
                .Index(t => t.Project_Id)
                .Index(t => t.Status_Id)
                .Index(t => t.UpdatedBy_Id);
            
            CreateTable(
                "dbo.Users",
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
                        Project_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Projects", t => t.Project_Id)
                .Index(t => t.Project_Id);
            
            CreateTable(
                "dbo.Projects",
                c => new
                    {
                        Id = c.Guid(nullable: false),
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
                        Project_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Projects", t => t.Project_Id)
                .Index(t => t.Project_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Issues", "UpdatedBy_Id", "dbo.Users");
            DropForeignKey("dbo.Issues", "Status_Id", "dbo.Status");
            DropForeignKey("dbo.Status", "Project_Id", "dbo.Projects");
            DropForeignKey("dbo.Issues", "Project_Id", "dbo.Projects");
            DropForeignKey("dbo.Issues", "Priority_Id", "dbo.Priorities");
            DropForeignKey("dbo.Priorities", "Project_Id", "dbo.Projects");
            DropForeignKey("dbo.Issues", "Owner_Id", "dbo.Users");
            DropForeignKey("dbo.Issues", "Assignee_Id", "dbo.Users");
            DropIndex("dbo.Issues", new[] { "UpdatedBy_Id" });
            DropIndex("dbo.Issues", new[] { "Status_Id" });
            DropIndex("dbo.Status", new[] { "Project_Id" });
            DropIndex("dbo.Issues", new[] { "Project_Id" });
            DropIndex("dbo.Issues", new[] { "Priority_Id" });
            DropIndex("dbo.Priorities", new[] { "Project_Id" });
            DropIndex("dbo.Issues", new[] { "Owner_Id" });
            DropIndex("dbo.Issues", new[] { "Assignee_Id" });
            DropTable("dbo.Status");
            DropTable("dbo.Projects");
            DropTable("dbo.Priorities");
            DropTable("dbo.Users");
            DropTable("dbo.Issues");
        }
    }
}
