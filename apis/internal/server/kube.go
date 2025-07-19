package server

import (
	"context"
	"github.com/rs/zerolog/log"
	"kubecaptain/apis/internal/conf"
	"kubecaptain/apis/internal/kube"

	ctrl "sigs.k8s.io/controller-runtime"
)

type KubeManagerServer struct {
	config *conf.Bootstrap
	ctrl.Manager
}

func NewKubeManagerServer(config *conf.Bootstrap, mgr ctrl.Manager, reconcilers []kube.ManagedReconciler) (*KubeManagerServer, error) {
	for _, reconciler := range reconcilers {
		err := reconciler.SetupWithManager(mgr)
		if err != nil {
			log.Error().Err(err).Msg("unable to create controller")
			return nil, err
		}
	}
	return &KubeManagerServer{config, mgr}, nil
}

func (m *KubeManagerServer) Start(_ context.Context) error {
	if err := m.Manager.Start(ctrl.SetupSignalHandler()); err != nil {
		log.Error().Err(err).Msg("problem running manager")
		return err
	}
	return nil
}

func (m *KubeManagerServer) Stop(_ context.Context) error {
	return nil
}
