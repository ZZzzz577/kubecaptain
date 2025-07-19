package service

import "github.com/google/wire"

type Service interface{}

func NewServices(
	app *AppService,
	appCI *AppCIService,
	appCITask *AppCITaskService,
) []Service {
	return []Service{
		app,
		appCI,
		appCITask,
	}
}

// ProviderSet is service providers.
var ProviderSet = wire.NewSet(
	NewServices,
	NewAppService,
	NewAppCIService,
	NewAppCITaskService,
)
