package controllers

import (
	"github.com/hackathon/WaviiLib/common"
	"gopkg.in/mgo.v2"
)

//Context : Used for maintaining HTTP request Context
type Context struct {
	MongoSession *mgo.Session
	User         string
}

//Close mgo.Session
func (c *Context) Close() {

	c.MongoSession.Close()

}

//DbCollection : returns mgo.Collection for the given name
func (c *Context) DbCollection(dbname, name string) *mgo.Collection {

	return c.MongoSession.DB(dbname).C(name)

}

//NewContext :  creates a new context object for every http request
func NewContext() *Context {

	session := common.GetSession().Copy()
	context := &Context{
		MongoSession: session,
	}

	return context
}
