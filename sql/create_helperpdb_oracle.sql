-- sql plus / as sysdba
-- alter session set container=EMPPDB
-- show con_name   

create pluggable database "HELPERPDB" admin user "HELPERADMIN" identified by "1111" roles=(dba) file_name_convert = ('pdbseed','HELPERPDB') ;

alter pluggable database "HELPERPDB" open read write; 
alter pluggable database "HELPERPDB" save state ;

alter session set container = "HELPERPDB";  
grant resource, dba to "HELPERADMIN"; 

conn HELPERADMIN/1111@localhost/HELPERPDB 
CREATE tablespace helpertbls 
datafile 'helpertbls' size 64M autoextend on; 

CREATE USER helper IDENTIFIED BY 1111 default tablespace helpertbls ;
alter user HELPER quota unlimited on helpertbls ;
GRANT connect, resource, dba TO helper ;

connect helper/1111@localhost/helperpdb

commit;





