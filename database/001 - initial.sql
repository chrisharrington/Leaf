create table projects (
    id uniqueidentifier primary key,
    name nvarchar(max) not null,
    isDeleted bit not null default(0)
)

create table users (
	id uniqueidentifier primary key,
	name nvarchar(max) not null,
    isDeleted bit not null default(0),
    emailAddress nvarchar(max) not null,
    isActivated bit not null default(0),
    activationToken uniqueidentifier not null,
    projectId uniqueidentifier not null,
    foreign key (projectId) references projects(id)
)
go

create table issueTypes (
	id uniqueidentifier primary key,
	name nvarchar(max) not null,
    isDeleted bit not null default(0)
)
go

create table milestones (
	id uniqueidentifier primary key,
	name nvarchar(max) not null,
    isDeleted bit not null default(0),
    projectId uniqueidentifier not null,
    foreign key (projectId) references projects(id)
)
go

create table priorities (
	id uniqueidentifier primary key,
	name nvarchar(max) not null,
    isDeleted bit not null default(0),
    projectId uniqueidentifier not null,
    [order] int not null,
    foreign key (projectId) references projects(id)
)
go

create table statuses (
	id uniqueidentifier primary key,
	name nvarchar(max) not null,
    isDeleted bit not null default(0),
    projectId uniqueidentifier not null,
    [order] int not null,
    foreign key (projectId) references projects(id)
)
go

create table issues (
	id uniqueidentifier primary key,
	name nvarchar(max) null,
    isDeleted bit not null default(0),
    number int not null,
    opened datetime not null,
    closed datetime null,
    updated datetime not null,
	details nvarchar(max) null,
	developerId uniqueidentifier not null,
	priorityId uniqueidentifier not null,
	projectId uniqueidentifier not null,
	statusId uniqueidentifier not null,
	testerId uniqueidentifier not null,
	updatedById uniqueidentifier not null,
	milestoneId uniqueidentifier not null,
	typeId uniqueidentifier not null,
	foreign key (projectId) references projects(id),
	foreign key (developerId) references users(id),
	foreign key (testerId) references users(id),
	foreign key (statusId) references statuses(id),
	foreign key (updatedById) references users(id),
	foreign key (milestoneId) references milestones(id),
	foreign key (typeId) references issueTypes(id)
	
)
go

create table issueAudits (
	id uniqueidentifier primary key,
    isDeleted bit not null default(0),
    date datetime not null,
    issueId uniqueidentifier not null,
    userId uniqueidentifier not null,
    foreign key (issueId) references issues(id),
    foreign key (userId) references users(id)
)
go

create table audits (
	id uniqueidentifier primary key,
	name nvarchar(max) null,
    isDeleted bit not null default(0),
	property nvarchar(max) null,
	oldValue nvarchar(max) null,
	newValue nvarchar(max) null,
	issueAuditId uniqueidentifier null,
	foreign key (issueAuditId) references issueAudits(id)
)
go

create table comments (
	id uniqueidentifier primary key,
    isDeleted bit not null default(0),
    date datetime not null,
    text nvarchar(max) null,
    issueId uniqueidentifier not null,
    userId uniqueidentifier not null,
    foreign key (issueId) references issues(id),
    foreign key (userId) references users(id)
)
go

create table transitions (
	id uniqueidentifier primary key,
	name nvarchar(max) not null,
    isDeleted bit not null default(0),
    projectId uniqueidentifier not null,
    fromId uniqueidentifier null,
    toId uniqueidentifier null,
    foreign key (fromId) references statuses(id),
    foreign key (toId) references statuses(id)
)
go

