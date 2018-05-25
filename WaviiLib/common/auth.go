package common

import (
	"crypto/rsa"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/dgrijalva/jwt-go/request"
	"github.com/gorilla/context"
)

// AppClaims : contains the claims that will make the jwt token...
type AppClaims struct {
	UserName string `json:"username"`
	Role     string `json:"role"`
	jwt.StandardClaims
}

//using asymmetric crypto/RSA keys
const (
	privateKeyPath = "WaviiLib/keys/app.rsa"
	publicKeyPath  = "WaviiLib/keys/app.rsa.pub"
)

//the one used for signing is the private key, and the public key fr verification
var (
	verifyKey *rsa.PublicKey
	signKey   *rsa.PrivateKey
)

func initKeys() {
	signBytes, err := ioutil.ReadFile(privateKeyPath)
	if err != nil {
		log.Fatalf("[initKeys]: %s\n", err)
	}
	signKey, err = jwt.ParseRSAPrivateKeyFromPEM(signBytes)
	if err != nil {
		log.Fatalf("[initKeys]: %s\n", err)
	}

	verifyBytes, err := ioutil.ReadFile(publicKeyPath)
	if err != nil {
		log.Fatalf("[initKeys]: %s\n", err)
	}
	verifyKey, err = jwt.ParseRSAPublicKeyFromPEM(verifyBytes)
	if err != nil {
		log.Fatalf("[initKeys]: %s\n", err)
	}

}

//GenerateJWT generates a new JWT token
func GenerateJWT(name, role string) (string, error) {
	//create claims
	claims := AppClaims{
		name,
		role,
		jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Minute * 2000).Unix(),
			Issuer:    "admin",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)

	ss, err := token.SignedString(signKey)

	if err != nil {
		return "", err
	}

	return ss, nil
}

//Authorize Middleware for validating the JWT token
func Authorize(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {

	//get token from request header
	token, err := request.ParseFromRequestWithClaims(r, request.OAuth2Extractor, &AppClaims{}, func(token *jwt.Token) (interface{}, error) {
		return verifyKey, nil
	})

	if err != nil {
		switch err.(type) {

		case *jwt.ValidationError: // JWT validation error
			vErr := err.(*jwt.ValidationError)

			switch vErr.Errors {
			case jwt.ValidationErrorExpired: //JWT expired
				DisplayAppError(
					w,
					err,
					"Access Token is expired, get a new Token",
					401,
				)
				return

			default:
				DisplayAppError(w,
					err,
					"Error while parsing the Access Token!",
					500,
				)
				return
			}

		default:
			DisplayAppError(w,
				err,
				"Error while parsing Access Token!",
				500)
			return
		}
	}

	if token.Valid {

		//set username to HTTP context
		context.Set(r, "user", token.Claims.(*AppClaims).UserName)

		next(w, r)
	} else {
		DisplayAppError(
			w,
			err,
			"Invalid Access Token",
			401,
		)
	}

}
