import { createInterface } from 'node:readline'

// JIRA APIと認証情報の設定
const ORGANIZATION_NAME = process.env.JIRA_ORGANIZATION_NAME
const JIRA_API_URL = `https://${ORGANIZATION_NAME}.atlassian.net/rest/api/3/issue/`
const API_TOKEN = process.env.JIRA_API_TOKEN // 環境変数からAPIトークンを読み込む
const JIRA_EMAIL = process.env.JIRA_EMAIL // 環境変数からJIRAのメールアドレスを読み込む

// 環境変数が設定されていることを確認
if (!API_TOKEN || !JIRA_EMAIL || !ORGANIZATION_NAME) {
  console.error('環境変数を設定してください')
  process.exit(1)
}

// チケットIDの配列
let ticketIds: string[] = []

// 標準入力のセットアップ
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
})

// 標準入力からチケットIDを読み込む
rl.on('line', (line) => {
  ticketIds.push(line.trim())
})

// 入力終了時にリリース更新を実行
rl.on('close', () => {
  const releaseId = process.argv[2] // コマンドライン引数からリリースIDを取得

  if (!releaseId) {
    console.error('リリースIDを指定してください')
    process.exit(1)
  }

  updateRelease(ticketIds, releaseId)
})

// チケット更新用の非同期関数
const updateRelease = async (ticketIds: string[], releaseId: string) => {
  const auth = Buffer.from(`${JIRA_EMAIL}:${API_TOKEN}`).toString('base64')

  for (const ticketId of ticketIds) {
    const response = await fetch(`${JIRA_API_URL}${ticketId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        update: {
          fixVersions: [{ set: [{ id: releaseId }] }],
        },
      }),
    })

    if (!response.ok) {
      console.error(
        `Failed to update ticket ${ticketId}: ${response.statusText}`
      )
      continue
    }

    console.log(
      `Ticket ${ticketId} updated successfully with release ${releaseId}`
    )
  }
}
