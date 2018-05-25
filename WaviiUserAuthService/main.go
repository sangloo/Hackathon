package main

import (
	"log"
	"net/http"

	csp2 "github.com/awakesecurity/csp"
	"github.com/codegangsta/negroni"
	"github.com/hackathon/WaviiUserAuthService/routers"
)

// The program entry point,
// Initializing the routes
func main() {
	//mux router
	router := routers.InitRoutes()

	n := negroni.Classic()
	n.UseHandler(router)

	csp := csp2.New(csp2.Config{
		Default: csp2.None,
		Script:  csp2.Self,
		Connect: csp2.Self,
		Img:     csp2.Self,
		Style:   csp2.Self,
	})

	n.UseFunc(csp.NegroniHandlerFunc())

	server := &http.Server{
		Addr:    "0.0.0.0:3030",
		Handler: n,
	}

	log.Println("Server Listening...")
	server.ListenAndServe()
}
