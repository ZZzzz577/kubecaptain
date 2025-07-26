package service

import (
	"context"
	"github.com/go-kratos/kratos/v2/transport/grpc"
	"github.com/go-kratos/kratos/v2/transport/http"
	"google.golang.org/protobuf/types/known/emptypb"
	setting "kubecaptain/apis/api/v1/ci_setting"
	"kubecaptain/apis/internal/biz"
)

type AppCISettingService struct {
	setting.UnimplementedAppCISettingServiceServer
	uc *biz.AppCISettingUseCase
}

func NewAppCISettingService(
	uc *biz.AppCISettingUseCase,
) *AppCISettingService {
	return &AppCISettingService{
		uc: uc,
	}
}

func (a *AppCISettingService) Register(gs *grpc.Server, hs *http.Server) {
	setting.RegisterAppCISettingServiceServer(gs, a)
	setting.RegisterAppCISettingServiceHTTPServer(hs, a)
}

func (a *AppCISettingService) Get(ctx context.Context, request *setting.GetRequest) (*setting.AppCISetting, error) {
	return a.uc.Get(ctx, request)
}

func (a *AppCISettingService) Apply(ctx context.Context, request *setting.ApplyRequest) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, a.uc.Apply(ctx, request)
}
