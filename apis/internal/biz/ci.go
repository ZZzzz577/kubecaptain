package biz

import (
	"context"
	"fmt"
	"github.com/rs/zerolog/log"
	v1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"kubecaptain/apis/api/v1/ci"

	"sigs.k8s.io/controller-runtime/pkg/client"
)

const (
	GitUrlConfigmapKey     = "GitUrl"
	DockerfileConfigmapKey = "Dockerfile"
)

type AppCIUseCase struct {
	app        *AppUseCase
	kubeClient client.Client
}

func NewAppCIUseCase(
	app *AppUseCase,
	kubeClient client.Client,
) (*AppCIUseCase, error) {
	return &AppCIUseCase{
		app,
		kubeClient,
	}, nil
}

func (a *AppCIUseCase) Get(ctx context.Context, request *ci.GetRequest) (*ci.AppCIConfig, error) {
	appName := request.GetName()
	app, err := a.app.get(ctx, appName)
	if err != nil {
		log.Log().Err(err).Str("appName", appName).Msg("get application ci config error")
		return nil, err
	}
	dockerfileCM, err := a.getDockerfileConfigMap(ctx, app.Name)
	if err != nil {
		log.Error().Err(err).Str("appName", app.Name).Msg("get application ci config error")
		return nil, err
	}
	var dockerfile, gitUrl string
	if dockerfileCM != nil {
		dockerfile = dockerfileCM.Data[DockerfileConfigmapKey]
		gitUrl = dockerfileCM.Data[GitUrlConfigmapKey]
	}
	return &ci.AppCIConfig{
		GitUrl:     gitUrl,
		Dockerfile: dockerfile,
	}, nil
}

func (a *AppCIUseCase) Apply(ctx context.Context, request *ci.ApplyRequest) error {
	appName := request.GetName()
	app, err := a.app.get(ctx, appName)
	if err != nil {
		log.Log().Err(err).Str("appName", appName).Msg("apply application ci config error")
		return err
	}
	dockerfileCM, err := a.getDockerfileConfigMap(ctx, app.Name)
	if err != nil {
		log.Error().Err(err).Str("appName", app.Name).Msg("apply application ci config error")
		return err
	}
	if dockerfileCM == nil {
		dockerfileCM = &v1.ConfigMap{
			ObjectMeta: metav1.ObjectMeta{
				Name:      fmt.Sprintf("%s-dockerfile", app.Name),
				Namespace: a.app.namespace,
				OwnerReferences: []metav1.OwnerReference{
					{
						APIVersion: app.APIVersion,
						Kind:       app.Kind,
						Name:       app.GetName(),
						UID:        app.GetUID(),
					},
				},
			},
			Data: map[string]string{
				GitUrlConfigmapKey:     request.Config.GetGitUrl(),
				DockerfileConfigmapKey: request.Config.GetDockerfile(),
			},
		}
		err = a.kubeClient.Create(ctx, dockerfileCM)
		if err != nil {
			log.Error().Err(err).Msg("apply application ci config error")
			return err
		}
	} else {
		dockerfileCM.Data[GitUrlConfigmapKey] = request.Config.GetGitUrl()
		dockerfileCM.Data[DockerfileConfigmapKey] = request.Config.GetDockerfile()
		err = a.kubeClient.Update(ctx, dockerfileCM)
		if err != nil {
			log.Error().Err(err).Msg("apply application ci config error")
			return err
		}
	}
	return nil
}

func (a *AppCIUseCase) getDockerfileConfigMap(ctx context.Context, appName string) (*v1.ConfigMap, error) {
	dockerfile := &v1.ConfigMap{}
	err := a.kubeClient.Get(ctx, client.ObjectKey{
		Namespace: a.app.namespace,
		Name:      fmt.Sprintf("%s-dockerfile", appName),
	}, dockerfile)
	if err != nil {
		switch {
		case errors.IsNotFound(err):
			return nil, nil
		default:
			log.Error().Err(err).Msg("get application ci dockerfile error")
			return nil, err
		}
	}
	return dockerfile, nil
}
