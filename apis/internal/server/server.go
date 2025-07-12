package server

import (
	"github.com/go-kratos/kratos/v2/transport/http"
	"github.com/google/wire"
	"google.golang.org/grpc"
)

type GRPCService interface {
	RegisterServiceGRPCServer(s grpc.ServiceRegistrar)
}

type HTTPService interface {
	RegisterServiceHTTPServer(s *http.Server)
}

type GeneralService interface {
	GRPCService
	HTTPService
}

// ProviderSet is server providers.
var ProviderSet = wire.NewSet(NewGRPCServer, NewHTTPServer)
