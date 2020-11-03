create table towns (
	id serial not null primary key,
    town_name text not null,
	town_id text not null
);

create table   y(
	id serial not null primary key,
    reg_id text not null
	
);

insert into towns (town_name, town_id)values('Cape Town', 'CA');
insert into towns (town_name, town_id)values('Bellville', 'CY');
insert into towns (town_name, town_id)values('Stellenbosch','CL');


