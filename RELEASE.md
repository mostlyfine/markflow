# Release Guide

## 1. Bump the version

Update the `version` field in `package.json`:

```json
{
  "version": "1.0.0"
}
```

## 2. Commit and push

```bash
git add package.json
git commit -m "chore: bump version to 1.0.0"
git push origin main
```

## 3. Tag the release

```bash
git tag v1.0.0
git push origin v1.0.0
```

## 4. Monitor GitHub Actions

- Check progress under the **Actions** tab.
- Once the workflow succeeds, artifacts are attached to the **Releases** page automatically.

## 5. (Optional) Edit release notes

- Open the new entry on the **Releases** page.
- Tweak the auto-generated notes if needed.

## Troubleshooting

### Build failures

1. Try building locally:

```bash
npm run dist
```

2. Verify `package.json` settings.
3. Inspect GitHub Actions logs.

### macOS code signing

The workflow currently skips signing via `CSC_IDENTITY_AUTO_DISCOVERY=false`.
To enable signing, provide these GitHub Secrets:
- `CSC_LINK`: Base64-encoded certificate file
- `CSC_KEY_PASSWORD`: Certificate password

### Windows code signing

Provide the following secrets if you need signed Windows binaries:
- `CSC_LINK`: Base64-encoded certificate file
- `CSC_KEY_PASSWORD`: Certificate password
