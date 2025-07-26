package service

import (
	"context"
	"github.com/go-kratos/kratos/v2/transport/grpc"
	"github.com/go-kratos/kratos/v2/transport/http"
	"google.golang.org/protobuf/types/known/emptypb"
	task "kubecaptain/apis/api/v1/ci_task"
	"kubecaptain/apis/internal/biz"
)

type AppCITaskService struct {
	task.UnimplementedAppCITaskServiceServer
	uc *biz.AppCITaskUseCase
}

func NewAppCITaskService(
	uc *biz.AppCITaskUseCase,
) *AppCITaskService {
	return &AppCITaskService{
		uc: uc,
	}
}

func (a *AppCITaskService) Register(gs *grpc.Server, hs *http.Server) {
	task.RegisterAppCITaskServiceServer(gs, a)
	task.RegisterAppCITaskServiceHTTPServer(hs, a)
}

func (a *AppCITaskService) Create(ctx context.Context, request *task.CreateRequest) (*emptypb.Empty, error) {
	return &emptypb.Empty{}, a.uc.Create(ctx, request)
}
