package service

import "github.com/google/wire"

type Service interface{}

func NewServices(
	app *AppService,
	appCI *AppCIService,
) []Service {
	return []Service{
		app,
		appCI,
	}
}

// ProviderSet is service providers.
var ProviderSet = wire.NewSet(
	NewServices,
	NewAppService,
	NewAppCIService,
)
