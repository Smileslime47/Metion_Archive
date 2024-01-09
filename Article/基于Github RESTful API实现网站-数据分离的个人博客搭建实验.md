# 基于Github RESTful API实现网站-数据分离的个人博客搭建实验

## 概要

原先的博客是基于Vitepress加上一些现有的轮子和脚手架搭起来的，现在自己对Vite和Typescript的了解更深入了，想着是时候重构一下自己的博客了

突发奇想想到了用Github提供的RESTful API，将数据单独存放在一个Repo里面，网站部署在Github Page上，这样可以实现数据和网站的分离（四舍五入Github给我当Web后端）。查询资料后看到有人直接用Issue作为文章数据，直接连评论都带上了，但是考虑后感觉还是不符合本人归档分类的习惯，遂放弃。

想法是把所有markdown文章存放在一个repo里——[Metion_Archive](https://github.com/Smileslime47/Metion_Archive)，一方面我的网站可以通过RESTfulAPI直接查询数据，另一方面是在其他平台上可以通过支持git的第三方客户端访问文章数据（比如我在iPhone上通过Metion编辑文章，该App自带完整的Git功能），实现跨平台的数据同步和编辑。这么看的话最大的问题其实就是网站要如何实现接口了。

## 最初尝试

最初通过[repo根目录的contentsAPI](https://api.github.com/repos/smileslime47/Metion_Archive/contents) 直接访问了一下，得到以下结构的JSON对象的Array，实际上对Repo中的大部分资源的直接访问都会返回以下格式的JSON对象（访问File）或者数组（访问Dir），其中`url`代表访问该资源的API。

如果资源的Type属于`file`，那么还会多出`encode:string`（通常是`base64`）和`content:string,`两个字段

```Typescript
interface GithubResponse{
    _links:Object,
    download_url:string,
    git_url:string,
    html_url:string,
    name:string,
    path:string,
    sha:string,
    size:number,
    type:string,
    url:string,
}
```

很无奈地说，我们并不能通过Github的RESTful API直接获取到整个Repo的结构

- 第一次访问时，它会返回给我数个Dir和数个File
- 如果我想知道Dir里的内容，那么我还需要再对每个Dir再发送一次Http请求
- 这就导致了要**探明**整个Repo的结构，**发送Http请求的次数**等于**Repo里的目录数**
- 当然，如果要查询文章的内容，那还需要额外单独发送一次请求获取markdown的content

考虑到我本人喜欢用文件夹对文章进行归档，这无疑导致每次生成Repo的目录结构——从而进一步生成文章的分类结构，需要对Github进行几十次的请求才能完成。在查询[官方文档](https://docs.github.com/zh/rest/using-the-rest-api/rate-limits-for-the-rest-api?apiVersion=2022-11-28)后得知

- 对于未验证的Http请求，单IP有每小时60次的请求限制
- 对于请求头的**authorization字段**中附上Github Token的Http请求，单IP有每小时5000次的请求限制
  - 例外：如果这里的Token使用的是Github Action中的**Secret_Token**，那么是每小时1000次的请求限制
  - 由于网站是通过Github Page部署的，所以我们不得不采用上述方式，如果不考虑目录结构只考虑文章访问的请求，每小时最多1000次的文章访问限制对于我个人博客的访问也算绰绰有余
- 通过OAuth登录接口登录后的Http请求，单IP有每小时5000次的请求限制
  - 但是该接口无法部署在静态网站上，和我们的目的不符

不论如何，如果这么深度遍历