package service

import "github.com/google/wire"

type Service interface{}

func NewServices(
	app *AppService,
) []Service {
	return []Service{
		app,
	}
}

// ProviderSet is service providers.
var ProviderSet = wire.NewSet(
	NewServices,
	NewAppService,
)
