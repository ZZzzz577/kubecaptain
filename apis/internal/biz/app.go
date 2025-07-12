package biz

import (
	"context"
	"kubecaptain/apis/api/v1/app"
)

type AppBiz struct {
}

func NewAppBiz() *AppBiz {
	return &AppBiz{}
}

func (a *AppBiz) Get(ctx context.Context, request *app.IdentityRequest) (*app.App, error) {
	return nil, nil
}
