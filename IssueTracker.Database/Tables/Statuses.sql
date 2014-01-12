create table Statuses (
	Id uniqueidentifier not null primary key,
	Name nvarchar(1023) not null,
	[Order] int not null
)