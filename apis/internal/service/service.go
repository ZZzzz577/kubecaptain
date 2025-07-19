package service

import "github.com/google/wire"

type Service interface{}

func NewServices(
	app *AppService,
	appCITask *AppCITaskService,
) []Service {
	return []Service{
		app,
		appCITask,
	}
}

// ProviderSet is service providers.
var ProviderSet = wire.NewSet(
	NewServices,
	NewAppService,
	NewAppCITaskService,
)
