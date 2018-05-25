package controllers

import (
	"encoding/json"
	"net/http"

	"github.com/hackathon/WaviiLib/common"
	"github.com/hackathon/WaviiLib/models"
	"github.com/hackathon/WaviiUserAuthService/data"
)

//Register :
func Register(w http.ResponseWriter, r *http.Request) {
	var dataResource UserResource

	// Decode the incoming User json
	err := json.NewDecoder(r.Body).Decode(&dataResource)
	if err != nil {
		common.DisplayAppError(
			w,
			err,
			"Invalid User Data",
			500,
		)
		return
	}

	user := &dataResource.Data
	context := NewContext()
	defer context.Close()

	col := context.DbCollection(common.AppConfig.Database, "usersauth")
	repo := &data.UserAuthRepository{C: col}

	// insert User Document
	Code, err := repo.CreateUser(user)
	if err != nil {
		common.DisplayAppError(
			w,
			err,
			"Error creating the user",
			500,
		)
		return
	}

	// cleanup the hashPassword to eliminate it from response JSON
	user.PasswordHash = nil

	j, err := json.Marshal(RegisterResourceWithCode{Data: RegisterResponseWithCode{user.Email, "", true, "", Code}})
	if err != nil {
		common.DisplayAppError(
			w,
			err,
			"An unexpected error has occurred",
			500,
		)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	w.Write(j)
}

// Login :
func Login(w http.ResponseWriter, r *http.Request) {
	var dataResource LoginResource
	var token string

	// Decode the incoming request
	err := json.NewDecoder(r.Body).Decode(&dataResource)
	if err != nil {
		common.DisplayAppError(
			w,
			err,
			"Invalid Login Data",
			500,
		)
		return
	}

	loginModel := dataResource.Data
	loginUser := models.UserAuth{
		Email:    loginModel.Email,
		Password: loginModel.Password,
	}

	context := NewContext()
	defer context.Close()
	col := context.DbCollection(common.AppConfig.Database, "usersauth")
	repo := &data.UserAuthRepository{C: col}

	// Authenticate the login user
	user, code, err := repo.Login(loginUser)
	if err != nil {
		common.DisplayAppError(
			w,
			err,
			"",
			401,
		)
		return
	}

	token, err = common.GenerateJWT(user.Email, "member")
	if err != nil {
		common.DisplayAppError(
			w,
			err,
			"Error while generating the access token",
			500,
		)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	user.PasswordHash = nil

	j, errs := json.Marshal(RegisterResourceWithTokenCode{Data: RegisterResponseWithTokenCode{user.Email, "", true, token, user.ID.Hex(), code}})
	if errs != nil {
		common.DisplayAppError(
			w,
			errs,
			"",
			500,
		)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(j)

}
