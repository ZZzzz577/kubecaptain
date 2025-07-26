package biz

import (
	"context"
	"fmt"
	"github.com/rs/zerolog/log"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	setting "kubecaptain/apis/api/v1/ci_setting"
	kubecaptianv1 "kubecaptain/apis/internal/kube/api/v1"
	"sigs.k8s.io/controller-runtime/pkg/client"
)

const DockerfileConfigmapKey = "Dockerfile"

type AppCISettingUseCase struct {
	app        *AppUseCase
	kubeClient client.Client
}

func NewAppCISettingUseCase(
	app *AppUseCase,
	kubeClient client.Client,
) (*AppCISettingUseCase, error) {
	return &AppCISettingUseCase{
		app:        app,
		kubeClient: kubeClient,
	}, nil
}

func (a *AppCISettingUseCase) Get(ctx context.Context, request *setting.GetRequest) (*setting.AppCISetting, error) {
	app, err := a.app.get(ctx, request.Name)
	if err != nil {
		log.Error().Err(err).Msg("get application error")
	}
	CIConfig := app.Spec.CI
	gitUrl := ""
	if CIConfig != nil && CIConfig.GitUrl != "" {
		gitUrl = CIConfig.GitUrl
	}

	cm, err := a.getDockerfileCM(ctx, app.Name)
	if err != nil {
		log.Error().Err(err).Msg("get dockerfile configmap error")
	}
	dockerfile := ""
	if cm != nil && cm.Data != nil {
		dockerfile = cm.Data[DockerfileConfigmapKey]
	}
	return &setting.AppCISetting{
		GitUrl:     gitUrl,
		Dockerfile: dockerfile,
	}, nil

}

func (a *AppCISettingUseCase) Apply(ctx context.Context, request *setting.ApplyRequest) error {
	app, err := a.app.get(ctx, request.Name)
	if err != nil {
		log.Error().Err(err).Msg("get application error")
	}
	gitUrl := request.Setting.GitUrl
	if app.Spec.CI == nil {
		app.Spec.CI = &kubecaptianv1.ApplicationCIConfig{
			GitUrl: gitUrl,
		}
	} else if app.Spec.CI.GitUrl != gitUrl {
		app.Spec.CI.GitUrl = gitUrl
	}
	if err = a.kubeClient.Update(ctx, app); err != nil {
		log.Error().Err(err).Msg("update application error")
		return err
	}

	dockerfile := request.Setting.Dockerfile
	cm, err := a.getDockerfileCM(ctx, app.Name)
	if err != nil {
		log.Error().Err(err).Msg("get dockerfile configmap error")
	}
	if cm == nil || cm.Data == nil {
		cm = &corev1.ConfigMap{
			ObjectMeta: metav1.ObjectMeta{
				Name:      fmt.Sprintf("%s-dockerfile", app.Name),
				Namespace: a.app.namespace,
			},
			Data: map[string]string{
				DockerfileConfigmapKey: request.Setting.Dockerfile,
			},
		}
		if err = a.kubeClient.Create(ctx, cm); err != nil {
			log.Error().Err(err).Msg("create configmap error")
			return err
		}
	} else {
		if cm.Data[DockerfileConfigmapKey] != dockerfile {
			cm.Data[DockerfileConfigmapKey] = dockerfile
			if err = a.kubeClient.Update(ctx, app); err != nil {
				log.Error().Err(err).Msg("update configmap error")
				return err
			}
		}
	}
	return nil
}

func (a *AppCISettingUseCase) getDockerfileCM(ctx context.Context, appName string) (*corev1.ConfigMap, error) {
	name := fmt.Sprintf("%s-dockerfile", appName)
	cm := &corev1.ConfigMap{}
	err := a.kubeClient.Get(ctx, client.ObjectKey{
		Namespace: a.app.namespace,
		Name:      name,
	}, cm)
	if errors.IsNotFound(err) {
		return nil, nil
	}
	if err != nil {
		log.Error().Err(err).Msg("get configmap error")
		return nil, err
	}
	return cm, nil
}
