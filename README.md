# oshiAni(推しアニ)

## API は Annict さんを利用している

https://docs.annict.com/docs/ja/api/v1/casts

## vue-router

```
this.$router.push({
name: "Article",
path: "/Article",
params: {
    articleId: articleId,
},
});
```

↑ は push する側。
router.js 側は、

```
{
    path: "/Article/:articleId",
    name: "Article",
    component: () => import("./pages/Article.vue"),
    props: true,
    meta: { isPublic: true },
},
```

って感じで受けている。
つまりこれって、get と同じことを vue-router がやってくれてる。
post と同じことをしようと思ったら、path のところに「:articleId」って書かなければ、
vue-router は特に URL バーの中にパラメーターを表示しないので、これが Post と同じ役割ってことになる。

もう 1 パターンある。

push する側。

```
      this.$router.push({
        path: "/WorkInfoList/year/:year/season/:season",
        name: "WorkInfoList",
        params: {
          year: targetYear,
          season: targetSeason,
        },
      });
```

使う側。

```
    this.targetYear = this.$route.params.year;
    this.targetSeason = this.$route.params.season;
```

## cloud functions

ローカルのエミュレーターは、テスト環境のキーを使ってエミュレートする。
デプロイはテストと本番にする必要があるので、npm コマンドを叩くときに、どっちのプロジェクトを使うのかだけを切り分けてあげればＯＫ

## docker → 結局 localhost 問題を解決できないからやめた

基本的には docker の中で作業していけばいい感じ

### コンテナの中に入る

```
docker-compose exec vue ash
```

### エミュレーター用の環境変数をセットする

以下のサイトを参考にした。
https://zenn.dev/shuneihayakawa/articles/021f4cb06c2b30

### firebase login に失敗する

docker で firebase login をたたくと、認証ページには勝手に飛ばない。
リンクは表示されるのでそれを貼り付けると認証ページを開くことはできるが、
最終的に失敗してしまう。
原因を調べてると、どうも 9005 のポートを使って通信してるみたいなので、
たぶんだけど docker のポート転送に 9005 を書いてないからだと思う。
(9005:9005 で設定してやると解消した)
で、調べてると、9005 のポート転送する以外に、
https://zenn.dev/tet0h/articles/docker-firebase-login-port9005
というやり方があるらしい。

```
firebase login --no-localhost
```

でやってあげると認証ページの最後に ↓ のトークンが表示される。

```
4/1AX4XfWjBbMyqwKcIYlzSmqxdF_cvUYShgqs6A7E2Cs-ovAjtm9bEicOVZkg
```

これを貼り付けてやるとログインできた。

### ログイン中のアカウントで利用可能な firebase プロジェクトを確認する

```
firebase projects:list
```

### 利用するプロジェクトの切り替え

```
firebase use 使いたいプロジェクト名
```

### emurator を使おうとするとエラーになる

まず Java ランタイムが必要。
docker ファイルに以下のコマンドを書いてあげてる。

```
RUN apk add --no-cache openjdk8-jre
```

で、emulator 自体は起動したけど、URL を押すとエラーになってる。
https://qiita.com/pannpers/items/244a7e3c18d8c8422e4f
とかを見てると、エミュレーターのポートをコンテナにバインドしてないからっぽい。

### コンテナを起動するたびに firebase へのログイン情報が削除されてしまう

docker コンテナが起動するたびに docker run が走るので、ログイン情報が保持されなくなってしまう。
https://qiita.com/pannpers/items/244a7e3c18d8c8422e4f
の記事がとても参考になった。

```
docker container ps -l
docker commit --message "Add firebase login" da6abc02d8d3 oshiani_vue
```

ちなみに、firebase login の認証情報は
~/.config/configstore/firebase-tools.json
に保存されるらしい。cat で中見るといろいと書かれてる。

## cloud functions をキックするためのトークンを取得する

gcloud auth print-identity-token

## スクレイピングツールに node-fetch jsdom を入れた

https://qiita.com/otchy/items/244c19c561ecb7211fa5

## 特定のファンクション飲みデプロイ

firebase deploy --only functions: ファクション名
