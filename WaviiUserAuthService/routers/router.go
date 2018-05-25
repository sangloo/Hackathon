package routers

import (
	"github.com/gorilla/mux"
)

// InitRoutes : initializing the routes
func InitRoutes() *mux.Router {
	router := mux.NewRouter().StrictSlash(true)

	router = SetUserRoutes(router)

	return router
}
