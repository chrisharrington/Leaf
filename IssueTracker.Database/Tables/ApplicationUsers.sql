create table ApplicationUsers (
	Id uniqueidentifier not null primary key,
	Name nvarchar(1023) not null,
	EmailAddress nvarchar(255) not null
)