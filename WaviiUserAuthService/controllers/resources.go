package controllers

import "github.com/hackathon/WaviiLib/models"

/*
This file contains different structure for json marshaling and other api methods
Some improvements:
	- Code Duplication
	- Maybe More indentation for some structs...
*/

type (
	//AuthUserModel : model used for authorized users with access token
	AuthUserModel struct {
		User  models.UserAuth `json:"user"`
		Token string          `json:"token"`
	}
	//LoginModel : Model used for authentication
	LoginModel struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	//UserResource : for post /user/register
	UserResource struct {
		Data models.UserAuth `json:"data"`
	}

	//LoginResource : for post /user/login
	LoginResource struct {
		Data LoginModel `json:"data"`
	}

	//RegisterResponse : A simple Response
	RegisterResponse struct {
		Email         string `json:"email"`
		Notice        string `json:"message"`
		EmailVerified bool   `json:"emailverified"`
		UserId        string `json:"user_id"`
	}
	// RegisterResponseWithCode :
	RegisterResponseWithCode struct {
		Email         string `json:"email"`
		Notice        string `json:"message"`
		EmailVerified bool   `json:"emailverified"`
		UserId        string `json:"user_id"`
		Code          int    `json:"code"`
	}

	// RegisterResource :
	RegisterResource struct {
		Data RegisterResponse `json:"data"`
	}

	//RegisterResourceWithCode :
	RegisterResourceWithCode struct {
		Data RegisterResponseWithCode `json:"data"`
	}

	//RegisterResponseWithToken : A simple response with token
	RegisterResponseWithToken struct {
		Email         string `json:"email"`
		Notice        string `json:"message"`
		EmailVerified bool   `json:"emailverified"`
		Token         string `json:"token"`
		UserId        string `json:"user_id"`
	}

	// RegisterResourceWithToken :
	RegisterResourceWithToken struct {
		Data RegisterResponseWithToken `json:"data"`
	}

	// RegisterResponseWithTokenCode :
	RegisterResponseWithTokenCode struct {
		Email         string `json:"email"`
		Notice        string `json:"message"`
		EmailVerified bool   `json:"emailverified"`
		Token         string `json:"token"`
		UserId        string `json:"user_id"`
		Code          int    `json:"code"`
	}

	// RegisterResourceWithTokenCode :
	RegisterResourceWithTokenCode struct {
		Data RegisterResponseWithTokenCode `json:"data"`
	}

	//AuthResource : Response for authorized users post /user/login
	AuthResource struct {
		Data AuthUserModel `json:"data"`
	}
)
