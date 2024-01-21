//prebuild-tree.ts
let msgpack = require('./msgpack.min.js');
let fs = require('fs')
let token = process.argv[2]
let fileTree: Array<GitSimpleResponse> = []

interface GitSimpleResponse {
    name: string,        //内容名
    path: string,        //路径
    sha: string,         //SHA
    type: string,        //内容类型
    url: string,         //API网址
    html_url: string,    //浏览器网址
    contents: Array<GitSimpleResponse>
}

interface GithubResponse {
    _links: Object,
    download_url: string,
    git_url: string,
    html_url: string,
    name: string,
    path: string,
    sha: string,
    size: number,
    type: string,
    url: string,
    contents: Array<GithubResponse>
}

//将完整的Github相应转化为简化对象
const simplify = (response: GithubResponse) => {
    return {
        name: response.name,
        path: response.path,
        sha: response.sha,
        type: response.type,
        url: response.url,
        html_url: response.html_url,
        contents: []
    } as GitSimpleResponse
}

//以当前节点为根节点，递归生成子节点
const createSubtree = async (parent: GitSimpleResponse) => {
    if (parent.type === "file") return

    parent.contents = []
    await fetch(
        parent.url,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                Authorization: token
        }
        }).then((response) => response.json()).then(async (json) => {
            let contents = json as Array<GithubResponse>
            for await (const content of contents) {
                let simplifiedContent = simplify(content)
                parent.contents.push(simplifiedContent)
                if (content.type === "dir") {
                    await createSubtree(simplifiedContent)
                }
            }
        })
}

console.log("Token:" + token)

//获取root目录信息
fetch("https://api.github.com/repos/Smileslime47/Metion_Archive/contents", {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        Authorization: token
    },
}).then((response) => {
    if (!response.ok) {
        console.log("Http Response Not Ok.")
    }
    return response.json()
}).then(async (json) => {
    let contents = json as Array<GithubResponse>
    //获取最外层节点
    contents.forEach((content: GithubResponse, _: any) => {
        fileTree.push(simplify(content))
    })

    //对最外层节点进行递归，生成子节点
    await Promise.all(fileTree.map(async (content) => {
        await createSubtree(content)
    }))

    //生成msgpack二进制流并写入文件
    console.log(msgpack.serialize(fileTree) as Uint8Array)
    fs.writeFile('./archive.tree', msgpack.serialize(fileTree) as Uint8Array, (err: any) => {
        if (err) {
            console.log("Write Failed")
        } else {
            console.log("Write Success")
        }
    })
})
