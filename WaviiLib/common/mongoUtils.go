package common

import (
	"log"
	"time"

	"gopkg.in/mgo.v2"
)

var session *mgo.Session

//GetSession :
func GetSession() *mgo.Session {
	if session == nil {
		var err error

		session, err = mgo.DialWithInfo(&mgo.DialInfo{
			Addrs:    []string{AppConfig.MongoDBHost}, // in config.json link to mongodb
			Username: AppConfig.DBUser,                // username for accessing the db
			Password: AppConfig.DBPwd,                 // password for accessing the db
			Timeout:  60 * time.Second,                // returns an error if request takes more than 60sex
		})

		if err != nil {
			log.Fatalf("[GetSession2]: %s\n", err)
		}
	}

	return session
}

// method for creating a new session
func createDbSession() {
	var err error

	session, err = mgo.DialWithInfo(&mgo.DialInfo{
		Addrs:    []string{AppConfig.MongoDBHost},
		Username: AppConfig.DBUser,
		Password: AppConfig.DBPwd,
		Timeout:  60 * time.Second,
	})

	if err != nil {
		log.Fatalf("[createDbSession]: %s\n", err)
	}

}

// Add Indexes into MongoDB to increase Performance,
func addIndexes() {
	var err error

	// User Auth Secondary indices
	userAuthIndex := mgo.Index{
		Key:        []string{"email"},
		Unique:     true,
		DropDups:   true,
		Background: true,
		Sparse:     true,
	}

	// Add indexes into MongoDB
	sess := GetSession().Copy()
	defer sess.Close()

	// ensure index for userauth collection
	userAuthCol := sess.DB(AppConfig.Database).C("usersauth")
	err = userAuthCol.EnsureIndex(userAuthIndex)
	if err != nil {
		log.Fatalf("[addIndexes]: %s\n", err)
	}

}
