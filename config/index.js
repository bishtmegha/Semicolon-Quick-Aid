var config={
    "port":9000,
    "dbPort":27017,
    "dbHost":"10.244.25.55",
    "dbName":"quickbot",
    "dburl":"mongodb://10.244.25.55:27017/quickbot",
    "sessionStore":{
	"store":"mongoStore",
	"secret":'123, easy as ABC. ABC, easy as 123'//optional only use for memcached
	},
}

module.exports=config;