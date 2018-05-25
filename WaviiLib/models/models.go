package models

import (
	"gopkg.in/mgo.v2/bson"
)

type (
	// UserAuth should be kept in the auth microService
	UserAuth struct {
		ID           bson.ObjectId `bson:"_id,omitempty" json:"id"`
		Email        string        `json:"email,omitempty"`
		Password     string        `json:"password,omitempty"`
		PasswordHash []byte        `json:"passwordhash,omitempty"`
	}
)
