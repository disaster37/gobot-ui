package main

import (
	"context"

	"dagger/gobot-ui/internal/dagger"
)

// GobotUi orchestrates the dfp-ui/pond dashboard build using only Daggerverse
// modules: Dudesons/nodejs, build-core/node, disaster37/image and disaster37/codecov.
type GobotUi struct{}

func (m *GobotUi) baseNode(src *dagger.Directory, nodeVersion string) *dagger.Dudesons {
	if nodeVersion == "" {
		nodeVersion = "24"
	}
	return dag.Dudesons().
		WithPipelineID("gobot-ui").
		WithVersion(nodeVersion, dagger.DudesonsWithVersionOpts{Image: "node", IsAlpine: true}).
		WithNpm().
		WithSource(src).
		Install()
}

// Lint runs ESLint and Prettier checks via Dudesons/daggerverse/nodejs.
func (m *GobotUi) Lint(ctx context.Context, src *dagger.Directory) (string, error) {
	return m.baseNode(src, "24").
		Lint().
		Do(ctx)
}

// Typecheck runs nuxt typecheck via Dudesons/daggerverse/nodejs.
func (m *GobotUi) Typecheck(ctx context.Context, src *dagger.Directory) (string, error) {
	return m.baseNode(src, "24").
		Run([]string{"typecheck"}, false).
		Do(ctx)
}

// Test runs Vitest with coverage via Dudesons/daggerverse/nodejs and returns the coverage directory.
func (m *GobotUi) Test(src *dagger.Directory) *dagger.Directory {
	return m.baseNode(src, "24").
		Run([]string{"test:coverage"}, false).
		Directory(dagger.DudesonsDirectoryOpts{Path: "coverage"})
}

// Build compiles the static SPA via Dudesons/daggerverse/nodejs and returns .output/public.
func (m *GobotUi) Build(src *dagger.Directory) *dagger.Directory {
	return m.baseNode(src, "24").
		Build().
		Directory(dagger.DudesonsDirectoryOpts{Path: ".output/public"})
}

// BuildStaticImage builds the Nginx SPA container via gitlab.com/build-core/daggerverse/node.
func (m *GobotUi) BuildStaticImage(src *dagger.Directory) *dagger.Container {
	return dag.Frontend(dagger.FrontendOpts{NodeVersion: "24"}).
		BuildStatic(src, dagger.FrontendBuildStaticOpts{
			PackageManager:  "npm",
			NodeVersion:     "24",
			OutputDir:       ".output/public",
			NginxConfigPath: "docker/nginx.conf",
		})
}

// Ci runs the full pipeline across Dudesons/nodejs, disaster37/codecov, and disaster37/image.
func (m *GobotUi) Ci(
	ctx context.Context,
	src *dagger.Directory,
	// +optional
	codecovToken *dagger.Secret,
	// +optional
	ci bool,
	// +optional
	dryRun bool,
	// +optional
	registry string,
	// +optional
	repositoryName string,
	// +optional
	version string,
	// +optional
	registryUsername *dagger.Secret,
	// +optional
	registryPassword *dagger.Secret,
) (string, error) {
	// 1. Install + Lint + Typecheck + Test (with coverage) + Build in a single cached Dudesons/node pipeline
	nodePipeline := m.baseNode(src, "24").
		Lint().
		Run([]string{"typecheck"}, false).
		Run([]string{"test:coverage"}, false).
		Build()

	out, err := nodePipeline.Do(ctx)
	if err != nil {
		return "", err
	}

	// 2. Upload coverage report via disaster37/dagger-library-go/codecov when token is provided
	if codecovToken != nil {
		covDir := nodePipeline.Directory(dagger.DudesonsDirectoryOpts{Path: "coverage"})
		srcWithCov := src.WithDirectory("coverage", covDir)
		if _, err := dag.Codecov().Upload(ctx, srcWithCov, codecovToken, dagger.CodecovUploadOpts{
			Files: []string{"coverage/lcov.info"},
		}); err != nil {
			return "", err
		}
	}

	// 3. Lint Dockerfile + Build production Nginx image (+ optional push) via disaster37/dagger-library-go/image
	if _, err := dag.Image().Ci(src, dagger.ImageCiOpts{
		Dockerfile:       "Dockerfile",
		Ci:               ci,
		DryRun:           dryRun,
		Registry:         registry,
		RepositoryName:   repositoryName,
		Version:          version,
		RegistryUsername: registryUsername,
		RegistryPassword: registryPassword,
	}).Sync(ctx); err != nil {
		return "", err
	}

	return out, nil
}
