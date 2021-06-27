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
