create table Issues (
	Id uniqueidentifier not null primary key,
	Name nvarchar(1023) not null,
	Number int not null,
	Description nvarchar(max) null,
	OwnerId uniqueidentifier not null,
	AssigneeId uniqueidentifier null,
	PriorityId uniqueidentifier not null,
	StatusId uniqueidentifier not null,
	Opened datetime not null,
	Closed datetime null
)