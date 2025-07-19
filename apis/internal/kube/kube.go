package kube

import (
	"crypto/tls"
	"github.com/google/wire"
	"github.com/rs/zerolog/log"
	"k8s.io/apimachinery/pkg/runtime"
	utilruntime "k8s.io/apimachinery/pkg/util/runtime"
	clientgoscheme "k8s.io/client-go/kubernetes/scheme"
	appv1 "kubecaptain/apis/internal/kube/api/v1"
	"kubecaptain/apis/internal/kube/controller"
	ctrl "sigs.k8s.io/controller-runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/healthz"
	"sigs.k8s.io/controller-runtime/pkg/log/zap"
	"sigs.k8s.io/controller-runtime/pkg/manager"
	metricsserver "sigs.k8s.io/controller-runtime/pkg/metrics/server"
	"sigs.k8s.io/controller-runtime/pkg/reconcile"
	"sigs.k8s.io/controller-runtime/pkg/webhook"
)

var (
	scheme   = runtime.NewScheme()
	setupLog = ctrl.Log.WithName("setup")
)

func init() {
	utilruntime.Must(clientgoscheme.AddToScheme(scheme))
	utilruntime.Must(appv1.AddToScheme(scheme))
}

func NewKubeManager() (manager.Manager, error) {
	opts := zap.Options{
		Development: true,
	}
	ctrl.SetLogger(zap.New(zap.UseFlagOptions(&opts)))
	disableHTTP2 := func(c *tls.Config) {
		setupLog.Info("disabling http/2")
		c.NextProtos = []string{"http/1.1"}
	}
	tlsOpts := []func(*tls.Config){disableHTTP2}
	webhookServer := webhook.NewServer(webhook.Options{
		TLSOpts: tlsOpts,
	})

	mgr, err := ctrl.NewManager(ctrl.GetConfigOrDie(), ctrl.Options{
		Scheme: scheme,
		Metrics: metricsserver.Options{
			BindAddress:   "0",
			SecureServing: false,
			TLSOpts:       tlsOpts,
		},
		WebhookServer:          webhookServer,
		HealthProbeBindAddress: ":8080",
		LeaderElection:         false,
		LeaderElectionID:       "0c3d519e.kubecaptain",
	})
	if err != nil {
		log.Error().Err(err).Msg("unable to start manager")
		return nil, err
	}

	if err = mgr.AddHealthzCheck("healthz", healthz.Ping); err != nil {
		log.Error().Err(err).Msg("unable to set up health check")
		return nil, err
	}
	if err = mgr.AddReadyzCheck("readyz", healthz.Ping); err != nil {
		log.Error().Err(err).Msg("unable to set up ready check")
		return nil, err
	}
	return mgr, nil
}

func NewKubeClient(mgr manager.Manager) (client.Client, error) {
	return mgr.GetClient(), nil
}

type ManagedReconciler interface {
	reconcile.Reconciler
	SetupWithManager(mgr ctrl.Manager) error
}

func NewManagedReconciler(application *controller.ApplicationReconciler) []ManagedReconciler {
	return []ManagedReconciler{
		application,
	}
}

var ProviderSet = wire.NewSet(
	NewKubeManager,
	NewKubeClient,
	NewManagedReconciler,
	controller.NewApplicationReconciler,
)
