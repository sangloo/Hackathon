package common

func init() {
	//init AppConfig variables
	initConfig()

	//init private/public keys for JWT Authentication
	initKeys()

	//init logger
	setLogLevel(Level(AppConfig.LogLevel))

	//Start a mongoDB session
	createDbSession()

	//add indexes into MongoDB
	addIndexes()
}
