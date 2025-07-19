package service

import (
	"context"
	"github.com/go-kratos/kratos/v2/transport/http"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/emptypb"
	"kubecaptain/apis/api/v1/app"
	"kubecaptain/apis/internal/biz"
)

type AppService struct {
	app.UnimplementedAppServiceServer
	uc *biz.AppUseCase
}

func NewAppService(uc *biz.AppUseCase) *AppService {
	return &AppService{
		uc: uc,
	}
}

func (a *AppService) RegisterServiceGRPCServer(s grpc.ServiceRegistrar) {
	app.RegisterAppServiceServer(s, a)
}

func (a *AppService) RegisterServiceHTTPServer(s *http.Server) {
	app.RegisterAppServiceHTTPServer(s, a)
}

func (a *AppService) List(ctx context.Context, request *app.ListRequest) (*app.ListResponse, error) {
	return a.uc.List(ctx, request)
}

func (a *AppService) Get(ctx context.Context, request *app.NameRequest) (*app.App, error) {
	return a.uc.Get(ctx, request)
}

func (a *AppService) Create(ctx context.Context, request *app.App) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, a.uc.Create(ctx, request)
}

func (a *AppService) Update(ctx context.Context, request *app.UpdateRequest) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, a.uc.Update(ctx, request)
}

func (a *AppService) Delete(ctx context.Context, request *app.NameRequest) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, a.uc.Delete(ctx, request)
}
