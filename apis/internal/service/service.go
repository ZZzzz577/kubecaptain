package service

import (
	"github.com/go-kratos/kratos/v2/transport/grpc"
	"github.com/go-kratos/kratos/v2/transport/http"
	"github.com/google/wire"
)

type Service interface {
	Register(gs *grpc.Server, hs *http.Server)
}

func NewServices(
	app *AppService,
	appCISetting *AppCISettingService,
	appCITask *AppCITaskService,
) []Service {
	return []Service{
		app,
		appCISetting,
		appCITask,
	}
}

// ProviderSet is service providers.
var ProviderSet = wire.NewSet(
	NewServices,
	NewAppService,
	NewAppCISettingService,
	NewAppCITaskService,
)
