create table stocks_crypto
(search_id serial primary key,
user_input varchar,
time_stamp, timestamp);

insert into stocks_crypto(
user_input, time_stamp)
values('NFLX', '2021-07-20 11:05:49.909977')

-- Query to check successful load
select * from stocks_crypto