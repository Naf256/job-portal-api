drop table if exists "jobs";
drop table if exists "companys";


create table if not exists "companys" (
	"id"			integer,
	"name"			text not null,
	"email"         text not null,
	"password"		text not null,
	"logo"			blob,
	"total_post"    integer,
	"tagline"		text,
	"description"   text,
	"contact_email" text,
	"contact_phone" text,
	primary key("id")
);

create table if not exists "jobs" (
	"id"		    integer,
	"title"		    text not null,
	"experience"    text not null,
	"location"	    text not null,
	"description"   text not null,
	"salary"        text not null,
	"deadline"	    text,
	"type"		    text,
	"creation_date" text,
	"company_id"   integer,
	foreign key("company_id") references companys("id"),
	primary key("id")
);
