package common

import (
	"encoding/json"
	"math"
	"math/rand"
	"net/http"
	"os"
	"regexp"
	"time"
)

var seededRand = rand.New(rand.NewSource(time.Now().UnixNano()))

type (
	appError struct {
		Error      string `json:"error"`
		Message    string `json:"message"`
		HTTPStatus int    `json:"status"`
	}

	errorResource struct {
		Data appError `json:"data"`
	}

	configuration struct {
		Server, MongoDBHost, DBUser, DBPwd, Database, DomainName string
		LogLevel                                                 int
	}
)

// DisplayAppError :  method for handling http based requests
func DisplayAppError(w http.ResponseWriter, handlerError error, message string, code int) {

	errObj := appError{
		Error:      handlerError.Error(),
		Message:    message,
		HTTPStatus: code,
	}

	Error.Printf("AppError]: %s\n", handlerError)

	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(code)

	if j, err := json.Marshal(errorResource{Data: errObj}); err == nil {
		w.Write(j)
	}
}

//AppConfig holds the configuration values from config.json file
var AppConfig configuration

//Initialize AppConfig
func initConfig() {
	loadAppConfig()
}

func loadAppConfig() {
	AppConfig = configuration{
		Server:      "0.0.0.0:3030",
		MongoDBHost: os.Getenv("MONGO_URL"),
		DBUser:      "",
		DBPwd:       "",
		Database:    "waviiauth",
		DomainName:  "localhost:3030",
		LogLevel:    1,
	}
}

// GenerateRandomString :  function for generating a random string
func GenerateRandomString(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

	str := make([]byte, length)
	for i := range str {
		str[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(str)
}

// IsValidPassword :  Method for validating password using regex according to the ...
func IsValidPassword(pass string) (bool, error) {

	pattern1 := "^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*)$"
	pattern2 := "^(.{0,7}|[^A-Z]*|[^a-z]*|[a-zA-Z0-9]*)$"
	pattern3 := "^(.{0,7}|[^0-9]*|[^a-z]*|[a-zA-Z0-9]*)$"
	pattern4 := "^(.{0,7}|[^0-9]*|[^A-Z]*|[a-zA-Z0-9]*)$"

	//At least 8 characters, one uppercase, one lowercase, and one number
	match1, err := regexp.MatchString(pattern1, pass)
	if err != nil {
		return false, err
	}

	//At least 8 characters, one uppercase, one lowercase, and one special character
	match2, err := regexp.MatchString(pattern2, pass)
	if err != nil {
		return false, err
	}

	//At least 8 characters, one special character, one lowercase, and one number
	match3, err := regexp.MatchString(pattern3, pass)
	if err != nil {
		return false, err
	}

	//At least 8 characters, one uppercase, one lowercase, and one number
	match4, err := regexp.MatchString(pattern4, pass)
	if err != nil {
		return false, err
	}

	if match1 == false || match2 == false || match3 == false || match4 == false {
		return true, err

	}

	return false, err
}

// IsValidEmail : Method for validating the email address using regexp according to the ...
func IsValidEmail(email string) (bool, error) {
	pattern := "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"

	validEmail, err := regexp.MatchString(pattern, email)
	if err != nil {
		return false, err
	}

	if validEmail {
		return true, err
	}
	return false, err
}

//SetLevel :
func SetLevel(points int) (level int) {
	return int(0.08*math.Sqrt(float64(points/3))) + 1
}
