#!/usr/bin/env bash
# Vercel build entrypoint (see vercel.json's "buildCommand").
#
# This script assumes it is run with cwd already at the monorepo root. That is
# guaranteed by vercel.json invoking it as `pnpm -w exec sh vercel-build.sh`:
# pnpm's `-w`/`--workspace-root` flag walks up to the workspace root and runs
# the given command from there, regardless of what Vercel's Project Settings
# -> Root Directory is set to. Without this, a Root Directory set to a
# subfolder (e.g. `artifacts/drew-halle`) would leave this script's plain
# relative paths pointing at the wrong place and silently break the build
# (this has happened before -- see VERCEL_DEPLOYMENT.md).
set -euo pipefail

pnpm --filter @workspace/drew-halle run build

BUILD_OUTPUT="artifacts/drew-halle/dist/public"

if [ ! -d "$BUILD_OUTPUT" ]; then
  echo "" >&2
  echo "ERROR: expected the Vite build output at '$BUILD_OUTPUT' (relative to" >&2
  echo "the monorepo root) but it does not exist." >&2
  echo "" >&2
  echo "This almost always means Vercel's Project Settings -> Root Directory is" >&2
  echo "not set to the repository root. Set it to the repo root (blank) and" >&2
  echo "redeploy -- see the 'Project settings' section of VERCEL_DEPLOYMENT.md." >&2
  exit 1
fi

rm -rf public
cp -r "$BUILD_OUTPUT" ./public
