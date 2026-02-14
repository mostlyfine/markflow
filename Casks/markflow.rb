cask "markflow" do
  arch arm: "arm64", intel: "x64"

  version "0.1.0"
  sha256 arm:   "1b48e2c26e0409dd49abfd125485b74dabaad3f7cb143cde36ad9c728967104a",
         intel: "f370fa5327f2237d97a4f1eb9b31d95ffe091697469ba5b4656ee882e3d39223"

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
