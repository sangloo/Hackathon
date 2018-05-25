package routers

import (
	"github.com/gorilla/mux"
	"github.com/hackathon/WaviiUserAuthService/controllers"
)

func SetUserRoutes(router *mux.Router) *mux.Router {
	router.HandleFunc("/userAuth/register", controllers.Register).Methods("POST")
	router.HandleFunc("/userAuth/login", controllers.Login).Methods("POST")

	return router
}
