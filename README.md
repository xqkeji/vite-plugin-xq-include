# vite-plugin-xq-include
A vite file include plugin and supports template variables.
一个Vite的包含文件插件，同时支持模板变量。

## Install 安装

```bash
npm i -D vite-plugin-xq-include
```

Add plugin to your `vite.config.ts`:

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import xqInclude from 'vite-plugin-xq-include';
export default defineConfig({
  plugins: [
    xqInclude()
  ],
}
```


## 模板文件 partial/header.html

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title><?=$seo_title?></title>
    <link rel="stylesheet" href="/scss/main.scss">
  </head>
  <body>
    <header>
      <div class="container-fluid text-center fixed-top">
        <?=$pageTitle?>
      </div>
    </header>
```

## 模板变量格式语法
```php

<?=$变量名?>

```

## 包含文件语法
```html
<xq-include file="partial/header.html" seo_title="产品页" pageTitle="产品页"></xq-include>

```

```html
<xq-include file="partial/header.html" seo_title="产品页" pageTitle="产品页">
支持HTML内容
</xq-include>
HTML内容模板变量名为<?=$content?>

```
