package biz

import (
	"context"
	"fmt"
	"github.com/rs/zerolog/log"
	"github.com/samber/lo"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/timestamppb"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"kubecaptain/apis/api/v1/app"
	"kubecaptain/apis/internal/conf"
	appv1 "kubecaptain/apis/internal/kube/api/v1"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"
	"slices"
)

const DockerfileConfigmapKey = "Dockerfile"

type AppUseCase struct {
	namespace  string
	mgr        ctrl.Manager
	kubeClient client.Client
}

func NewAppUseCase(config *conf.Bootstrap, mgr ctrl.Manager) (*AppUseCase, error) {
	namespace := config.GetApplication().GetNamespace()
	if namespace == "" {
		return nil, fmt.Errorf("application namespace is empty")
	}
	return &AppUseCase{
		namespace:  namespace,
		mgr:        mgr,
		kubeClient: mgr.GetClient(),
	}, nil
}

func (a *AppUseCase) List(ctx context.Context, _ *app.ListRequest) (*app.ListResponse, error) {
	list := &appv1.ApplicationList{}
	err := a.kubeClient.List(ctx, list, client.InNamespace(a.namespace))
	if err != nil {
		log.Error().Err(err).Msg("list applications error")
		return nil, err
	}
	slices.SortFunc(list.Items, func(item1, item2 appv1.Application) int {
		if item1.CreationTimestamp.Before(&item2.CreationTimestamp) {
			return 1
		} else {
			return -1
		}

	})
	return &app.ListResponse{
		Items: lo.Map(list.Items, func(item appv1.Application, index int) *app.App {
			return a.toProto(&item, "")
		}),
	}, nil
}

func (a *AppUseCase) Get(ctx context.Context, request *app.NameRequest) (*app.App, error) {
	application, err := a.get(ctx, request.Name)
	if err != nil {
		log.Log().Err(err).Str("name", request.Name).Msg("get application error")
		return nil, err
	}
	configMap, err := a.getDockerfileConfigMap(ctx, application.Name)
	if err != nil {
		log.Error().Err(err).Str("appName", application.Name).Msg("get application error")
		return nil, err
	}
	dockerfile := ""
	if configMap != nil {
		dockerfile = configMap.Data[DockerfileConfigmapKey]
	}
	return a.toProto(application, dockerfile), nil
}

func (a *AppUseCase) Create(ctx context.Context, request *app.App) error {
	application := &appv1.Application{
		ObjectMeta: metav1.ObjectMeta{
			Name:      request.Name,
			Namespace: a.namespace,
		},
		Spec: appv1.ApplicationSpec{
			Description: request.Description,
			Users:       request.Users,
			CI: &appv1.ApplicationCIConfig{
				GitUrl: request.CiConfig.GetGitUrl(),
			},
		},
	}
	if err := a.kubeClient.Create(ctx, application); err != nil {
		switch {
		case errors.IsAlreadyExists(err):
			return status.Error(codes.AlreadyExists, err.Error())
		case errors.IsInvalid(err):
			return status.Error(codes.InvalidArgument, err.Error())
		default:
			log.Error().Err(err).Msg("create application error")
			return err
		}
	}

	configMap := &corev1.ConfigMap{
		ObjectMeta: metav1.ObjectMeta{
			Name:      fmt.Sprintf("%s-dockerfile", application.Name),
			Namespace: a.namespace,
			Labels: map[string]string{
				"app": application.Name,
			},
		},
		Data: map[string]string{
			DockerfileConfigmapKey: request.CiConfig.GetDockerfile(),
		},
	}
	if err := a.kubeClient.Create(ctx, configMap); err != nil {
		switch {
		case errors.IsAlreadyExists(err):
			return status.Error(codes.AlreadyExists, err.Error())
		case errors.IsInvalid(err):
			return status.Error(codes.InvalidArgument, err.Error())
		default:
			log.Error().Err(err).Msg("create application error")
			return err
		}
	}

	err := controllerutil.SetControllerReference(application, configMap, a.mgr.GetScheme())
	if err != nil {
		log.Error().Err(err).Msg("create application error")
		return err
	}
	return nil
}

func (a *AppUseCase) Update(ctx context.Context, request *app.UpdateRequest) error {
	// 直接更新报错metadata.resourceVersion: Invalid value: 0x0: must be specified for an update
	// 先获取app再更新
	name := request.App.Name
	application, err := a.get(ctx, name)
	if err != nil {
		log.Error().Err(err).Str("name", request.App.Name).Msg("update application error")
		return err
	}
	application.Spec = appv1.ApplicationSpec{
		Description: request.App.Description,
		Users:       request.App.Users,
		CI: &appv1.ApplicationCIConfig{
			GitUrl: request.App.CiConfig.GetGitUrl(),
		},
	}
	if err = a.kubeClient.Update(ctx, application); err != nil {
		switch {
		case errors.IsNotFound(err):
			return status.Error(codes.NotFound, err.Error())
		case errors.IsInvalid(err):
			return status.Error(codes.InvalidArgument, err.Error())
		default:
			log.Error().Err(err).Msg("update application error")
			return err
		}
	}

	configMap, err := a.getDockerfileConfigMap(ctx, name)
	if err != nil {
		log.Error().Err(err).Str("name", request.App.Name).Msg("update application error")
		return err
	}
	configMap.Data[DockerfileConfigmapKey] = request.App.CiConfig.GetDockerfile()
	err = a.kubeClient.Update(ctx, configMap)
	if err != nil {
		log.Error().Err(err).Msg("update application error")
		return err
	}

	return nil
}

func (a *AppUseCase) Delete(ctx context.Context, request *app.NameRequest) error {
	err := a.kubeClient.Delete(ctx, &appv1.Application{
		ObjectMeta: metav1.ObjectMeta{
			Name:      request.Name,
			Namespace: a.namespace,
		},
	})
	if err != nil {
		log.Error().Err(err).Str("name", request.GetName()).Msg("delete application error")
		return err
	}
	err = a.kubeClient.Delete(ctx, &corev1.ConfigMap{
		ObjectMeta: metav1.ObjectMeta{
			Name:      fmt.Sprintf("%s-dockerfile", request.Name),
			Namespace: a.namespace,
		},
	})
	if err != nil {
		log.Error().Err(err).Str("name", request.GetName()).Msg("delete application error")
		return err
	}
	return nil
}

func (a *AppUseCase) get(ctx context.Context, name string) (*appv1.Application, error) {
	application := &appv1.Application{}
	err := a.kubeClient.Get(ctx, client.ObjectKey{
		Namespace: a.namespace,
		Name:      name,
	}, application)
	if err != nil {
		if errors.IsNotFound(err) {
			return nil, status.Error(codes.NotFound, err.Error())
		} else {
			log.Error().Err(err).Str("name", name).Msg("get application error")
			return nil, err
		}
	}
	return application, nil
}

func (a *AppUseCase) getDockerfileConfigMap(ctx context.Context, appName string) (*corev1.ConfigMap, error) {
	dockerfile := &corev1.ConfigMap{}
	err := a.kubeClient.Get(ctx, client.ObjectKey{
		Namespace: a.namespace,
		Name:      fmt.Sprintf("%s-dockerfile", appName),
	}, dockerfile)
	if err != nil {
		switch {
		case errors.IsNotFound(err):
			return nil, status.Error(codes.NotFound, err.Error())
		default:
			log.Error().Err(err).Msg("get application ci dockerfile error")
			return nil, err
		}
	}
	return dockerfile, nil
}

func (a *AppUseCase) toProto(source *appv1.Application, dockerfile string) *app.App {
	res := &app.App{
		Name:        source.Name,
		Description: source.Spec.Description,
		Users:       source.Spec.Users,
		CiConfig: &app.AppCIConfig{
			GitUrl: source.Spec.CI.GitUrl,
		},
		CreatedAt: timestamppb.New(source.GetCreationTimestamp().Time),
	}
	if dockerfile != "" {
		res.CiConfig.Dockerfile = dockerfile
	}
	return res
}
