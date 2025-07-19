package service

import (
	"context"
	"github.com/go-kratos/kratos/v2/transport/http"
	"google.golang.org/grpc"
	"google.golang.org/protobuf/types/known/emptypb"
	"kubecaptain/apis/api/v1/ci"
	"kubecaptain/apis/internal/biz"
)

type AppCIService struct {
	ci.UnimplementedAppCIServiceServer
	uc *biz.AppCIUseCase
}

func NewAppCIService(
	uc *biz.AppCIUseCase,
) *AppCIService {
	return &AppCIService{
		uc: uc,
	}
}

func (a *AppCIService) RegisterServiceGRPCServer(srv grpc.ServiceRegistrar) {
	ci.RegisterAppCIServiceServer(srv, a)
}

func (a *AppCIService) RegisterServiceHTTPServer(srv *http.Server) {
	ci.RegisterAppCIServiceHTTPServer(srv, a)
}

func (a *AppCIService) Get(ctx context.Context, request *ci.GetRequest) (*ci.AppCIConfig, error) {
	return a.uc.Get(ctx, request)
}

func (a *AppCIService) Apply(ctx context.Context, request *ci.ApplyRequest) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, a.uc.Apply(ctx, request)
}
