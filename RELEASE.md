# リリース手順

## 1. バージョンの更新

package.jsonのversionフィールドを更新:
```json
{
  "version": "1.0.0"
}
```

## 2. 変更をコミット

```bash
git add package.json
git commit -m "chore: bump version to 1.0.0"
git push origin main
```

## 3. タグを作成してプッシュ

```bash
git tag v1.0.0
git push origin v1.0.0
```

## 4. GitHub Actionsの確認

- GitHubリポジトリの「Actions」タブで進行状況を確認
- ビルドが完了すると、「Releases」に自動的に公開される

## 5. リリースノートの編集（任意）

- GitHubの「Releases」ページでリリースを開く
- 自動生成されたリリースノートを必要に応じて編集

## トラブルシューティング

### ビルドが失敗する場合

1. ローカルでビルドを試す:
```bash
npm run dist
```

2. package.jsonの設定を確認

3. GitHub Actionsのログを確認

### macOSのコード署名

コード署名なしでビルドするため、`CSC_IDENTITY_AUTO_DISCOVERY: false`を設定済み。
署名が必要な場合は、以下のGitHub Secretsを追加:
- `CSC_LINK`: 証明書ファイル（base64エンコード）
- `CSC_KEY_PASSWORD`: 証明書のパスワード

### Windowsのコード署名

署名が必要な場合は、以下のGitHub Secretsを追加:
- `CSC_LINK`: 証明書ファイル（base64エンコード）
- `CSC_KEY_PASSWORD`: 証明書のパスワード
