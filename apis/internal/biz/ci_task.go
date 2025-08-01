package biz

import (
	"context"
	"fmt"
	"github.com/rs/zerolog/log"
	"github.com/samber/lo"
	batchv1 "k8s.io/api/batch/v1"
	corev1 "k8s.io/api/core/v1"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	task "kubecaptain/apis/api/v1/ci_task"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"
	"time"
)

type AppCITaskUseCase struct {
	app        *AppUseCase
	mgr        ctrl.Manager
	kubeClient client.Client
}

func NewAppCITaskUseCase(
	app *AppUseCase,
	mgr ctrl.Manager,
) (*AppCITaskUseCase, error) {
	return &AppCITaskUseCase{
		app:        app,
		mgr:        mgr,
		kubeClient: mgr.GetClient(),
	}, nil
}

func (a *AppCITaskUseCase) Create(ctx context.Context, request *task.CreateRequest) error {
	app, err := a.app.get(ctx, request.Name)
	if err != nil {
		log.Error().Err(err).Msg("get app error")
		return err
	}
	appConfig := &corev1.ConfigMap{}
	err = a.kubeClient.Get(ctx, client.ObjectKey{
		Namespace: app.Namespace,
		Name:      fmt.Sprintf("%s-dockerfile", app.Name),
	}, appConfig)
	if err != nil {
		log.Error().Err(err).Msg("get app config error")
		return err
	}
	ciTaskName := fmt.Sprintf("%s-%s", app.Name, time.Now().Format("20060102150405"))
	labels := map[string]string{"app": app.Name}
	ciTask := &batchv1.Job{
		ObjectMeta: metav1.ObjectMeta{
			Name:      ciTaskName,
			Namespace: a.app.namespace,
			Labels:    labels,
		},
		Spec: batchv1.JobSpec{
			BackoffLimit: lo.ToPtr(int32(0)),
			Template: corev1.PodTemplateSpec{
				ObjectMeta: metav1.ObjectMeta{
					Labels: labels,
				},
				Spec: corev1.PodSpec{
					Containers: []corev1.Container{
						{
							Name:            "ci-task",
							Image:           "docker.io/library/build:1.0",
							ImagePullPolicy: corev1.PullNever,
							Env: []corev1.EnvVar{
								{
									Name:  "GIT_URL",
									Value: app.Spec.CI.GitUrl,
								},
							},
							VolumeMounts: []corev1.VolumeMount{
								{
									Name:      "ci-config",
									MountPath: "/app/config",
								},
							},
						},
					},
					RestartPolicy: corev1.RestartPolicyNever,
					Volumes: []corev1.Volume{
						{
							Name: "ci-config",
							VolumeSource: corev1.VolumeSource{
								ConfigMap: &corev1.ConfigMapVolumeSource{
									LocalObjectReference: corev1.LocalObjectReference{
										Name: appConfig.Name,
									},
								},
							},
						},
					},
				},
			},
		},
	}

	err = controllerutil.SetControllerReference(app, ciTask, a.mgr.GetScheme())
	if err != nil {
		log.Error().Err(err).Msg("create application CI task error")
		return err
	}

	err = a.kubeClient.Create(ctx, ciTask)
	if err != nil {
		log.Error().Err(err).Msg("create application CI task error")
		return err
	}

	return nil
}
