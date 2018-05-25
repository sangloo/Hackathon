package data

import (
	"github.com/hackathon/WaviiLib/common"
	"github.com/hackathon/WaviiLib/models"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// UserAuthRepository :
type UserAuthRepository struct {
	C *mgo.Collection
}

// CreateUser :
func (r *UserAuthRepository) CreateUser(user *models.UserAuth) (int, error) {

	u := models.UserAuth{}
	err := r.C.Find(bson.M{"email": user.Email}).One(&u)

	passwordValid, err := common.IsValidPassword(user.Password)
	if err != nil {
		return 0, err
	}

	if !passwordValid {
		return 2, err
	}

	emailValid, err := common.IsValidEmail(user.Email)
	if err != nil {
		return 0, err
	}
	if !emailValid {
		return 3, err
	}

	objID := bson.NewObjectId()
	user.ID = objID

	hpass, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	user.PasswordHash = hpass
	// clear the incoming text password
	user.Password = ""

	err = r.C.Insert(&user)
	return 0, err
}

// Login :
func (r *UserAuthRepository) Login(user models.UserAuth) (u models.UserAuth, code int, err error) {
	code = 0
	err = r.C.Find(bson.M{"email": user.Email}).One(&u)
	if err != nil {
		code = 0
		return
	}
	err = bcrypt.CompareHashAndPassword(u.PasswordHash, []byte(user.Password))
	if err != nil {
		code = 1
	}
	code = 0
	return

}
