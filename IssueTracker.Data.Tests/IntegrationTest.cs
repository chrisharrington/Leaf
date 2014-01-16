using System;
using System.Configuration;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Migrations;
using System.Data.SqlClient;
using Dapper;
using IssueTracker.Common.Tests;

namespace IssueTracker.Data.Tests
{
	public class IntegrationTest : Test
	{
		protected IntegrationTest()
		{
			InitializeDatabase();
			RemoveData();
		}

		protected string ConnectionString
		{
			get { return ConfigurationManager.ConnectionStrings["DefaultDataConnection"].ConnectionString; }
		}

		protected DataContext BuildContext()
		{
			return new DataContext();
		}

		protected IDbConnection OpenConnection()
		{
			return new SqlConnection(ConnectionString);
		}

		private void InitializeDatabase()
		{
			Database.SetInitializer(new MigrateDatabaseToLatestVersion<DataContext, Migrations.Configuration>());
			using (var context = new DataContext())
			{
				context.Database.Initialize(true);
			}
		}

		private void RemoveData()
		{
			using (var connection = new SqlConnection(ConnectionString))
			{
				connection.Open();
				connection.Execute(@"while(exists(select 1 from INFORMATION_SCHEMA.TABLE_CONSTRAINTS where CONSTRAINT_TYPE='FOREIGN KEY'))
                                begin
                                    declare @sql nvarchar(2000)
                                    SELECT TOP 1 @sql=('ALTER TABLE ' + TABLE_SCHEMA + '.[' + TABLE_NAME + '] DROP CONSTRAINT [' + CONSTRAINT_NAME + ']')
                                    FROM information_schema.table_constraints
                                    WHERE CONSTRAINT_TYPE = 'FOREIGN KEY'
                                    exec (@sql)
                                    PRINT @sql
                                end
                                declare @tableSchema nvarchar(max)
								declare @tableName nvarchar(max)

								declare tableCursor cursor for select TABLE_SCHEMA, TABLE_NAME from INFORMATION_SCHEMA.TABLES
								open tableCursor

								fetch next from tableCursor into @tableSchema, @tableName

								while @@fetch_status = 0
								begin

									if (@tableName <> '__MigrationHistory')
									begin
										declare @dropSql nvarchar(max)
										set @dropSql = 'truncate table ' + @tableSchema + '.[' + @tableName + ']'
										exec (@dropSql)
									end

									fetch next from tableCursor into @tableSchema, @tableName

								end

								close tableCursor
								deallocate tableCursor");
			}
		}
	}
}
