# bulk-update-jira-tickets-with-version

## 概要
JIRAのチケットにバージョンを一括で設定するスクリプトです。

## 実行環境

[Bun](https://bun.sh/)を使用しています。Bunの[インストール](https://bun.sh/docs/installation)が必要です。


## インストール

```sh
$ bun install
```

## 設定
`.env.example` ファイルをコピーして、`.env` ファイルを作成します。

```sh
cp .env.example .env
```

`.env` ファイルに以下の情報を設定します。

| 項目 | 説明 |
| --- | --- |
| JIRA_API_TOKEN | JIRAのAPIトークン |
| JIRA_EMAIL | アカウントのメールアドレス |
| JIRA_ORGANIZATION_NAME | 対象となるJIRAの組織名 |

## 実行手順
### 標準入力からチケットIDを直接入力する場合
```sh
$ echo -e "TICKET-1\nTICKET-2\nTICKET-3" | bun run index.ts RELEASE-ID
```
- `TICKET-1\nTICKET-2\nTICKET-3` の部分は、更新したいJIRAチケットのIDリストです。改行で区切ります。
- `RELEASE-ID` の部分は設定したいリリースIDです。

### CSVファイルを使用する場合
```sh
$ cat tickets.csv | bun run index.ts RELEASE-ID
```
- `tickets.csv` ファイルには、各行に1つのチケットIDを記述します。
- `RELEASE-ID` の部分は設定したいリリースIDです。
