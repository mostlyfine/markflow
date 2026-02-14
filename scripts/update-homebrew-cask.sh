#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 <version>" >&2
  echo "Example: $0 0.1.0" >&2
  exit 1
fi

VERSION="$1"
ARM_ASSET="release/MarkFlow-${VERSION}-arm64.zip"
INTEL_ASSET="release/MarkFlow-${VERSION}-x64.zip"
CASK_FILE="Casks/markflow.rb"

if [[ ! -f "$ARM_ASSET" ]]; then
  echo "Missing asset: $ARM_ASSET" >&2
  exit 1
fi

if [[ ! -f "$INTEL_ASSET" ]]; then
  echo "Missing asset: $INTEL_ASSET" >&2
  exit 1
fi

ARM_SHA="$(shasum -a 256 "$ARM_ASSET" | awk '{print $1}')"
INTEL_SHA="$(shasum -a 256 "$INTEL_ASSET" | awk '{print $1}')"

cat > "$CASK_FILE" <<EOF
cask "markflow" do
  arch arm: "arm64", intel: "x64"

  version "${VERSION}"
  sha256 arm:   "${ARM_SHA}",
         intel: "${INTEL_SHA}"

  url "https://github.com/mostlyfine/markflow/releases/download/v#{version}/MarkFlow-#{version}-#{arch}.zip",
      verified: "github.com/mostlyfine/markflow/"
  name "MarkFlow"
  desc "GFM-compatible Markdown viewer"
  homepage "https://github.com/mostlyfine/markflow"

  livecheck do
    url :url
    strategy :github_latest
  end

  app "MarkFlow.app"
end
EOF

echo "Updated ${CASK_FILE}"
echo "  version: ${VERSION}"
echo "  arm64 sha256: ${ARM_SHA}"
echo "  x64   sha256: ${INTEL_SHA}"
