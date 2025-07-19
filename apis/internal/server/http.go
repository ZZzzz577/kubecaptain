package server

import (
	"github.com/go-kratos/kratos/v2/middleware/recovery"
	"github.com/go-kratos/kratos/v2/middleware/validate"
	"github.com/go-kratos/kratos/v2/transport/http"
	"kubecaptain/apis/internal/conf"
	"kubecaptain/apis/internal/service"
)

// NewHTTPServer new an HTTP server.
func NewHTTPServer(config *conf.Bootstrap, services []service.Service) *http.Server {
	var opts = []http.ServerOption{
		http.Middleware(
			recovery.Recovery(),
			validate.Validator(),
		),
	}
	c := config.Server
	if c.Http.Network != "" {
		opts = append(opts, http.Network(c.Http.Network))
	}
	if c.Http.Addr != "" {
		opts = append(opts, http.Address(c.Http.Addr))
	}
	if c.Http.Timeout != nil {
		opts = append(opts, http.Timeout(c.Http.Timeout.AsDuration()))
	}
	srv := http.NewServer(opts...)
	for _, s := range services {
		if v, ok := s.(HTTPService); ok {
			v.RegisterServiceHTTPServer(srv)
		}
	}
	return srv
}
