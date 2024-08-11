# AWS-cloudFormation

<details open="open">
<summary>目次</summary>


- [今回のシステム概要図](#今回のシステム概要図)
- [cognitoの設定](#cognitoの設定)
- [備考](#備考)
- [参考](#参考)
</details>

# 今回のシステム概要図
<details>
<summary> システム概要図</summary>

下記をcloudformation-baseで立ち上げ
- vpc
- サブネット
- igw
- ngw
- githubActions用のAssumeロール

下記をcloudformation-template.ymlで立ち上げる
- ALB
- ALBのリスナー
- Route53でAレコード追加してALBにルーティング
- ターゲットグループ（taskで立ち上がるコンテナへルーティング）
- ECSクラスター
- ECSサービス
- ECS task (ECRのイメージを使用)
- IAMロール（ECSのtask定義で使用）
- ECRのリポジトリ
- ALB/ECS/RDSのセキュリティーグループ
- SecretsManager

</details>


# cognitoの設定

<details>
<summary> 1. 特に別のIdPと連携しないなら、チェックなしで次に</summary>

![](./assets/images/cognito1.png)

</details>

<details>
<summary> 2. MFA認証は入れる方がおすすめ</summary>

![](./assets/images/cognito2.png)

</details>

<details>
<summary> 3. とりあえずエラーが出るのでCognitoの方を設定</summary>

![](./assets/images/cognito3.png)

</details>

<details>
<summary> 4. アプリケーションとの統合部分（やること多い）</summary>

- ホストされた認証ページにチュックを入れて、springsecurityのauthorize-urlからアクセスできるCognitoドメインの作成
- 秘密クライエントにチェックを入れて、シークレットの生成
- コールバックURIの登録
- スコープをopenIDで設定（できるだけ少ない情報にしたかった）
- 実際に取れそうなPrincipalは下記の添付

![](./assets/images/cognito4.png)
![](./assets/images/cognito5.png)
![](./assets/images/cognito6.png)
![](./assets/images/cognito-principal.png)

</details>


# 備考


# 参考
