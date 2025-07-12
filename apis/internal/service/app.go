package service

import (
	"context"
	"github.com/go-kratos/kratos/v2/transport/http"
	"google.golang.org/grpc"
	"kubecaptain/apis/api/v1/app"
	"kubecaptain/apis/internal/biz"
)

type AppService struct {
	app.UnimplementedAppServiceServer
	appBiz *biz.AppBiz
}

func NewAppService(appBiz *biz.AppBiz) *AppService {
	return &AppService{
		appBiz: appBiz,
	}
}

func (a *AppService) RegisterServiceGRPCServer(s grpc.ServiceRegistrar) {
	app.RegisterAppServiceServer(s, a)
}

func (a *AppService) RegisterServiceHTTPServer(s *http.Server) {
	app.RegisterAppServiceHTTPServer(s, a)
}

func (a *AppService) Get(ctx context.Context, request *app.IdentityRequest) (*app.App, error) {
	return a.appBiz.Get(ctx, request)
}
