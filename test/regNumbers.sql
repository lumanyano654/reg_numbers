create table towns (
	id serial not null primary key,
    town_name text not null,
	town_id text not null
);

create table registration_numbers(
	id serial not null primary key,
    reg_numbers text not null,
    town_code int not null,
    foreign key (town_code) references towns(id)
);

insert into towns (town_name, town_id)values('Cape Town', 'CA');
insert into towns (town_name, town_id)values('Bellville', 'CY');
insert into towns (town_name, town_id)values('Stellenbosch','CL');
