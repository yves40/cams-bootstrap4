rem -------------------------------------------------------------------------------------------
rem     Oct 28 2019   Initial
rem 
rem -------------------------------------------------------------------------------------------
rem The starting service command on W10
rem -------------------------------------------------------------------------------------------
D:\TOOLS\mongodb\bin\mongod.exe --config "D:\TOOLS\mongodb\bin\mongod.cfg" --service
rem -------------------------------------------------------------------------------------------
rem Alias to start the shell client
rem -------------------------------------------------------------------------------------------
doskey mongo="D:\TOOLS\mongodb\bin\mongo.exe"
rem -------------------------------------------------------------------------------------------
rem Some init commands
rem -------------------------------------------------------------------------------------------
show dbs
use cams 
dbs
rem -------------------------------------------------------------------------------------------
rem Add a user on cams
rem Be sure to be switched on the proper schema
rem -------------------------------------------------------------------------------------------
db.createUser({ user:'yves', pwd:'manager1', roles: [ "readWrite", "dbAdmin"], })
rem -------------------------------------------------------------------------------------------
rem List users from the camsusers collection
rem And some other commands to demonstrate simple mongo syntax
rem -------------------------------------------------------------------------------------------
db.camsusers.find();
db.camsusers.find().pretty();
db.camsusers.update({"email" : "yves@free.fr"}, {"adminflag" : "true"});
db.camsusers.update({"email" : "yves@free.fr"}, {"adminflag" : "false"});
db.camsusers.find({"email" : "yves@free.fr"}).pretty();
